import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useEncryption from "./useEncryption";
import { setItem, deleteItem, getItem } from "../utils/sessionStorage";

export default function useWebSocket(username) {
  const [history, setHistory] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const { generateKeys, encryptMessage, decryptMessage } = useEncryption();

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ADDRESS}?username=${username}`);

    ws.onopen = () => {
      const { publicKey, privateKey } = generateKeys();
      setItem("privateKey", privateKey);
      ws.send(JSON.stringify({ username, message: publicKey, event: "key" }));
    };

    ws.onmessage = (wsEvent) => {
      const { username: msgUsername, message, event } = JSON.parse(wsEvent.data);
      let newData = {};
      console.log(wsEvent.data);

      if (event === "key") {
        setItem("publicKey", message);
        
        const currentUserCount = Object.keys(getItem("publicKey") ?? {}).length;
        
        setUserCount(currentUserCount);

        if (!currentUserCount) {
          setHistory([]);
          deleteItem("publicKey");
        }
        
        return;
      }

      if (event === "close") {
        setUserCount(userCount - 1);
        return;
      }

      if (event === "connection") {
        setUserCount(userCount + 1);
        newData = { message: `${msgUsername} entrou no chat.` };
      }

      if (event === "message") {
        const privateKey = getItem("privateKey");
        const decryptedMessage = decryptMessage(message, privateKey);
        newData = { username: msgUsername, message: decryptedMessage };
      }

      setHistory((prevData) => [...prevData, newData]);
    };

    ws.onclose = (wsEvent) => {
      const POLICY_VIOLATION_CODE = 1008;

      if (wsEvent.reason)
        alert(wsEvent.reason);

      if (wsEvent.code === POLICY_VIOLATION_CODE)
        navigate("/");
    };

    socketRef.current = ws;

    return () => {
      ws.close();
      setHistory([]);
      deleteItem("privateKey");
      deleteItem("publicKey");
    };
  
  }, [username, navigate]);

  const sendMessage = (text) => {
    const publicKeys = getItem("publicKey");
    
    setHistory((prevData) => [...prevData, { username, message: text }]);
    
    for (const publicKeyUsername of Object.keys(publicKeys)) {
      const publicKey = publicKeys[publicKeyUsername];
      const encryptedMessage = encryptMessage(text, publicKey);
      socketRef.current.send(JSON.stringify({ username, message: encryptedMessage, event: "message", destination: publicKeyUsername}));
    }    
  };

  return { history, userCount, sendMessage };
}

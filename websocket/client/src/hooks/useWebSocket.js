import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useEncryption from "./useEncryption";
import { setItem, deleteItem, getItem } from "../utils/sessionStorage";

export default function useWebSocket(username) {
  const [history, setHistory] = useState([]);
  const [isUserOnline, setisUserOnline] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const { generateKeys, encryptMessage, decryptMessage } = useEncryption();

  useEffect(() => {
    const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ADDRESS}?username=${username}`);

    ws.onopen = () => {
      const { publicKey, privateKey } = generateKeys();
      setItem("privateKey", privateKey);
      ws.send(JSON.stringify({ username, publicKey }));
    };

    ws.onmessage = (wsEvent) => {
      const { username: msgUsername, message, event } = JSON.parse(wsEvent.data);
      let newData = {};

      if (event === "key") {
        setItem("publicKey", message);
        setisUserOnline(true);
        return;
      }

      if (event === "close") {
        setHistory([]);
        setisUserOnline(false);
        deleteItem("publicKey");
        return;
      }

      if (event === "connection") {
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
    const publicKey = getItem("publicKey");
    
    const firstAttribute = Object.keys(publicKey)[0];
    const publicKeyValue = publicKey[firstAttribute];
    const encryptedMessage = encryptMessage(text, publicKeyValue);
        
    socketRef.current.send(encryptedMessage);
    setHistory((prevData) => [...prevData, { username, message: text }]);
  };

  return { history, isUserOnline, sendMessage };
}

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useEncryption from "./useEncryption";
import { setItem, deleteItem, getItem } from "../utils/sessionStorage";
import { POLICY_VIOLATION_CODE } from "../constants/webSocket";

export default function useWebSocket(username) {
  const [history, setHistory] = useState([]);
  const [userCount, setUserCount] = useState(0);
  
  const socketRef = useRef(null);
  
  const navigate = useNavigate();

  const { generateKeys, encryptMessage, decryptMessage } = useEncryption();

  function refreshUserCount() {
    const users = Object.keys(getItem("publicKeys") ?? {});
    const count = users.length;
    setUserCount(count);
    
    if (!count) {
      setHistory([]);
      deleteItem("publicKeys");
    }
  }

  useEffect(function createConnection() {
    const ws = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_ADDRESS}?username=${username}`);

    ws.onopen = () => {
      const { publicKey, privateKey } = generateKeys();
      setItem("privateKey", privateKey);
      ws.send(JSON.stringify({ username, message: publicKey, event: "key" }));
    };

    ws.onmessage = (wsEvent) => {
      const { username: msgUsername, message, event } = JSON.parse(wsEvent.data);
      let newData = {};

      if (event === "key") {
        setItem("publicKeys", message);
        refreshUserCount();
        return;
      }

      if (event === "close") {
        refreshUserCount();
        newData = { message: `${msgUsername} saiu do chat.` };
      } else if (event === "connection") {
        refreshUserCount();
        newData = { message: `${msgUsername} entrou no chat.` };
      } else if (event === "message") {
        const privateKey = getItem("privateKey");
        const decryptedMessage = decryptMessage(message, privateKey);
        newData = { username: msgUsername, message: decryptedMessage };
      }

      setHistory((prevData) => [...prevData, newData]);
    };

    ws.onclose = (wsEvent) => {
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
      deleteItem("publicKeys");
    };
  
  }, [username, navigate]);

  function sendMessage(text) {
    const publicKeys = getItem("publicKeys");
    const users = Object.keys(publicKeys);
    
    setHistory((prevData) => [...prevData, { username, message: text }]);
    
    for (const user of users) {
      const publicKey = publicKeys[user];
      const encryptedMessage = encryptMessage(text, publicKey);
      socketRef.current.send(JSON.stringify({
        username,
        message: encryptedMessage,
        event: "message",
        destination: user,
      }));
    }    
  };

  return { history, userCount, sendMessage };
}

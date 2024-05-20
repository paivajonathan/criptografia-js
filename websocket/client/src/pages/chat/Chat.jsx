import styles from "./Chat.module.css";
import { useState, useEffect, useRef } from "react";
import send from "../../assets/send.svg";
import leave from "../../assets/leave.svg";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import { useNavigate, useParams } from "react-router-dom";
import { generatePrimePairBetween } from "../../utils/rsa";
import useSessionStorage from "../../hooks/useSessionStorage";
import Loader from "../../components/loader/Loader";

const ADDRESS = "ws://localhost:8000";

export default function Chat() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);
  const [publicKey, setPublicKey] = useSessionStorage("publicKey");
  const [, setPrivateKey] = useSessionStorage("privateKey");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  const { username } = useParams();
  const navigate = useNavigate();

  useAutosizeTextArea(textAreaRef.current, text);

  function handleSubmit(event) {
    if (!["keydown", "submit"].includes(event.type)) return;
    if (event.type === "keydown" && event.keyCode !== 13) return;

    event.preventDefault();

    if (!text) {
      alert("Digite uma mensagem válida!");
      return;
    }

    setHistory((prevData) => [...prevData, { username, message: text }]);
    
    socketRef.current.send(text);
   
    setText("");
  }

  function handleExit() {
    if (!confirm("Deseja sair do chat?"))
      return;

    alert("Obrigado por usar!");
    navigate("/");
  }

  useEffect(function createWebSocketConnection() {
    const ws = new WebSocket(`${ADDRESS}?username=${username}`);

    ws.onopen = () => {
      const { prime1, prime2 } = generatePrimePairBetween(10, 100);
      const publicKey = prime1 * prime2;

      ws.send(JSON.stringify({ username, publicKey }));
      setPrivateKey(JSON.stringify({ prime1, prime2 }));
    };

    ws.onmessage = (e) => {
      const { username, message, event } = JSON.parse(e.data);
      let newData = {};

      switch (event) {
        case "key":
          setPublicKey(message);
          return;
        case "close":
          setHistory([]);
          setPublicKey("");
          return;
        case "connection":
          newData = { message: `${username} se conectou` };
          break;
        default:
          newData = { username, message };
          break;
      }

      setHistory((prevData) => [...prevData, newData]);
    };

    ws.onclose = (e) => {
      if (e.reason)
        alert(e.reason);

      if (e.code === 1008)
        navigate("/");
    };

    socketRef.current = ws;

    return () => {
      ws.close();
      setPrivateKey("");
      setPublicKey("");
    };
  }, []);

  useEffect(function scrollMessages() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!publicKey)
    return <Loader />;

  return (
    <div className={styles.main}>
      <div className={styles.messages}>
        <div className={styles.leaveChat}>
          <img src={leave} alt="Sair" className={styles.logo} onClick={handleExit} />
        </div>
        {history.map((data, index) => (
          <div
            key={index}
            className={`${styles.message} ${data.username === username ? styles.ownMessage : styles.othersMessage}`}
          >
            <div className={styles.messageTitle}>
              {data.username === username ? "Você" : data.username}
            </div>
            <div
              className={`${styles.messageInfo} ${!data.username && styles.eventMessage}`}
            >
              {data.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className={styles.messageBox}>
        <textarea
          rows={1}
          placeholder="Digite a sua mensagem"
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleSubmit}
          className={styles.textInput}
          ref={textAreaRef}
          autoFocus
        ></textarea>

        <div className={styles.buttonArea}>
          <button type="submit" className={styles.textButton}>
            <img src={send} alt="Enviar" className={styles.logo} />
          </button>
        </div>
      </form>
    </div>
  );
}

import styles from "./Chat.module.css";
import { useState, useEffect, useRef } from "react";
import SendLogo from "../../assets/send.svg";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import { useNavigate, useParams } from "react-router-dom";
import { generatePrimePairBetween } from "../../utils/rsa";

const ADDRESS = "ws://localhost:8000";

export default function Chat() {
  const [text, setText] = useState("");
  const [history, setHistory] = useState([]);

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
    if (confirm("Deseja sair do chat?")) {
      alert("Obrigado por usar!");
      navigate("/");
    }
  }

  useEffect(function createWebSocketConnection() {
    const ws = new WebSocket(`${ADDRESS}?username=${username}`);

    ws.onopen = () => {
      const { prime1, prime2 } = generatePrimePairBetween(10, 100);
      const publicKey = prime1 * prime2;
      
      ws.send(JSON.stringify({ username, publicKey }));
      sessionStorage.setItem("privateKey", JSON.stringify({ prime1, prime2 }));
    }

    ws.onmessage = (e) => {
      const { username, message, event } = JSON.parse(e.data);

      if (event === "key") {
        sessionStorage.setItem("publicKey", message);
        return;
      }

      if (event === "close") {
        alert(`O usuário ${username} se desconectou`);
        setHistory([]);
        return;
      }

      const newData = event === "connection" ? { message: `${username} se conectou` } : { username, message };
      setHistory((prevData) => [...prevData, newData]);
    };

    ws.onclose = (e) => {
      console.log(e);
      e.reason && alert(e.reason);

      navigate("/");
    }

    socketRef.current = ws;

    return () => ws.close();
  }, []);

  useEffect(function scrollMessages() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  return (
    <div className={styles.main}>
      <h1 className={styles.title} onClick={handleExit}>Cryptowhats</h1>

      <div className={styles.messages}>
        {history.map((data, index) => (
          <div
            className={styles.message}
            style={
              data.username === username ?
              {
                alignSelf: "flex-end",
                backgroundColor: "#dcf8c6",
                borderBottomRightRadius: "0",
                borderBottomLeftRadius: "10px",
              } :
              {
                alignSelf: "flex-start",
                backgroundColor: "#f4f4f4",
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "0",
              }
            }
            key={index}
          >
            <div className={styles.messageTitle}>{data.username !== username ? data.username : "Você"}</div>
            <div className={styles.messageInfo} style={{ fontStyle: !data.username && "italic" }}>{data.message}</div>
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
            <img src={SendLogo} alt="Enviar" />
          </button>
        </div>
      </form>
    </div>
  );
}

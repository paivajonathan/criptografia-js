import styles from "./Chat.module.css";
import { useState, useEffect, useRef } from "react";
import SendLogo from "../../assets/send.svg";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import { useNavigate, useParams } from "react-router-dom";

const ADDRESS = "ws://localhost:8000";

/**
 * @param {string} username 
 * @param {string} message 
 * @param {string} event 
 * @returns 
 */
function checkEvent(username, message, event) {
  switch (event) {
    case "connection":
      return { author: "", text: `${username} entrou no servidor.` };
    case "close":
      return { author: "", text: `${username} saiu do servidor.` };
    default:
      return { author: `${username}: `, text: message };
  }
}

export default function Chat() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  const { username } = useParams();
  const navigate = useNavigate();

  useAutosizeTextArea(textAreaRef.current, text);

  /**
   * @param {Event} event 
   */
  function handleSubmit(event) {    
    if (!["keydown", "submit"].includes(event.type)) return;
    if (event.type === "keydown" && event.keyCode !== 13) return;
    
    event.preventDefault();
    
    if (!text) {
      alert("Digite uma mensagem válida!");
      return;
    }

    setText("");
    socketRef.current.send(text);
  }

  function handleExit() {
    if (confirm("Deseja sair do chat?")) {
      alert("Obrigado por usar!");
      navigate("/");
    }
  }

  useEffect(function createWebSocketConnection() {
    const ws = new WebSocket(`${ADDRESS}?username=${username}`);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      data.forEach(({ username, message, event }) => {
        const newData = checkEvent(username, message, event);
        setData((prevData) => [...prevData, newData]);
      });
    };

    ws.onclose = (e) => {
      if (!e.wasClean)
        alert("Ocorreu um erro inesperado.");
      else if (e.reason)
        alert(e.reason);
      
      navigate("/");
    }

    socketRef.current = ws;

    return () => ws.close();
  }, []);

  useEffect(function scrollMessages() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  return (
    <div className={styles.main}>
      <h1 className={styles.title} onClick={handleExit}>Cryptowhats</h1>

      <div className={styles.messages}>
        {data.map((data, index) => (
          <div className={styles.message} key={index}>
            <strong>{data.author ?? ""}</strong>
            {data.author ? <span>{data.text}</span> : <em>{data.text}</em>}
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

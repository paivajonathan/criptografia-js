import styles from "./Chat.module.css";
import { useState, useEffect, useRef } from "react";
import send from "../../assets/send.svg";
import leave from "../../assets/leave.svg";
import useAutosizeTextArea from "../../hooks/useAutosizeTextArea";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/loader/Loader";
import useWebSocket from "../../hooks/useWebSocket";

export default function Chat() {
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);

  const { username } = useParams();
  const navigate = useNavigate();

  const { history, isUserOnline, sendMessage } = useWebSocket(username);

  useAutosizeTextArea(textAreaRef, text);

  function handleSubmit(event) {
    if (!["keydown", "submit"].includes(event.type)) return;
    if (event.type === "keydown" && event.keyCode !== 13) return;

    event.preventDefault();

    if (!text) {
      alert("Digite uma mensagem válida!");
      return;
    }

    sendMessage(text);
    setText("");
  }

  function handleExit() {
    if (!confirm("Deseja sair do chat?"))
      return;

    alert("Obrigado por usar!");
    navigate("/");
  }

  useEffect(function scrollMessages() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  if (!isUserOnline)
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

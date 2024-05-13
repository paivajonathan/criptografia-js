import styles from "./App.module.css";
import { useState, useEffect, useRef } from "react";
import SendLogo from "./assets/send.svg";
import useAutosizeTextArea from "./useAutosizeTextArea";

const ADDRESS = "ws://localhost:8000";

function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textAreaRef = useRef(null);
  useAutosizeTextArea(textAreaRef.current, text);

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

  function handleSubmit(event) {
    if (!["keydown", "submit"].includes(event.type)) return;
    if (event.type === "keydown" && event.keyCode !== 13) return;

    event.preventDefault();
    setText("");
    socketRef.current.send(text);
  }

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const username = params.get("username") ?? "";
    const ws = new WebSocket(
      `${ADDRESS}${username ? "?username=" + username : username}`
    );
    console.log("Use effect executado");

    ws.onopen = () => {
      console.log("Conexão estabelecida");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const { username, message, event } = data;

      if (message instanceof Array) {
        message.forEach(({ username, message, event }) => {
          const newData = checkEvent(username, message, event);
          setData((prevData) => [...prevData, newData]);
        });
        return;
      }

      const newData = checkEvent(username, message, event);
      setData((prevData) => [...prevData, newData]);
    };

    socketRef.current = ws;

    return () => ws.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Cryptowhats</h1>

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
        ></textarea>
        <button type="submit" className={styles.textButton}>
          <img src={SendLogo} alt="Enviar" />
        </button>
      </form>
    </main>
  );
}

export default App;

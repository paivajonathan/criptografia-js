import style from "./App.module.css";
import { useState, useEffect, useRef } from "react";

const ADDRESS = "ws://192.168.11.111:8000";

function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();
    setText("");
    socket.current.send(text);
  }

  useEffect(() => {
    const ws = new WebSocket(ADDRESS);

    ws.onopen = () => {
      console.log("Conexão estabelecida");
    };

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const { username, message, event } = data;

      if (event === "close") {
        alert(`User ${username} has logged off`);
        setMessages([]);
        return;
      }
      
      const newMessage = { author: username, text: message };
      setMessages(prevMessages => [newMessage, ...prevMessages]);
    };

    socket.current = ws;

    return () => ws.close();
  }, []);

  return (
    <>
      <h1>Cryptowhats</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Digite uma mensagem"
        />
        <input type="submit" value="Enviar" />
      </form>
      <div>
        <h1>Messages:</h1>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>{`${message.author}: ${message.text}`}</li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;

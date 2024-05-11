import style from "./App.module.css";
import { useState, useEffect, useRef } from "react";

const ADDRESS = "ws://localhost:8000";

function App() {
  const [text, setText] = useState("");
  const [data, setData] = useState([]);
  const socket = useRef(null);

  function checkEvent(username, message, event) {
    switch (event) {
      case "connection":
        return { author: "", text: `${username} entrou no servidor.`};
      case "close":
        return { author: "", text: `${username} saiu do servidor.` };
      default:
        return { author: username, text: `: ${message}` };
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    setText("");
    socket.current.send(text);
  }

  useEffect(() => {
    const params = new URLSearchParams(document.location.search);
    const username = params.get("username") ?? "";
    const ws = new WebSocket(`${ADDRESS}${ username ? "?username=" + username : username }`);
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
          setData(prevData => [newData, ...prevData]);
        });
        return;
      }

      const newData = checkEvent(username, message, event);
      setData(prevData => [newData, ...prevData]);
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
          {data.map((data, index) => (
            <li key={index}>
              {`${data.author ?? ""}${data.text}`}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default App;

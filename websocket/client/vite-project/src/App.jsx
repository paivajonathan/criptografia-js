import { useEffect } from "react"

function App() {

  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000?username=A");

    ws.onopen = () => {
      console.log("Conexão estabelecida")
    };

    ws.onmessage = (event) => {
      console.log(event)
    };
  })

  return (
    <>
      <h1>Testando</h1>
    </>
  )
}

export default App

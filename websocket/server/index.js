const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const publicKeys = {};

function broadcastKeys() {
  Object.keys(connections).forEach((connUsername) => {
    const filteredKeys = Object.keys(publicKeys)
      .filter(
        (publicKeyUsername) => ![connUsername].includes(publicKeyUsername)
      )
      .reduce((publicKey, publicKeyUsername) => {
        publicKey[publicKeyUsername] = publicKeys[publicKeyUsername];
        return publicKey;
      }, {});

    const connection = connections[connUsername];

    connection.send(
      JSON.stringify({
        username: "server",
        message: filteredKeys,
        event: "key",
      })
    );
  });
}

function broadcastMessage(connections, username, event, message = "") {
  console.log(`${username} - ${message} - ${event}`);

  const data = { username, message, event };

  Object.keys(connections).forEach((id) => {
    if (id === username) return;

    const connection = connections[id];
    connection.send(JSON.stringify(data));
  });
}

wsServer.on("connection", (connection, request) => {
  const username = url.parse(request.url, true).query.username;

  if (Object.keys(connections).includes(username)) {
    connection.close(1008, "Usuário já está logado!");
    return;
  }

  connections[username] = connection;
  broadcastMessage(connections, username, "connection");

  connection.on("message", (bytes) => {
    const {
      username: messageUsername,
      message,
      event,
      destination,
    } = JSON.parse(bytes.toString());

    if (event === "key") {
      publicKeys[messageUsername] = message;
      broadcastKeys();
      return;
    }

    Object.keys(connections).forEach((connUsername) => {
      if (connUsername !== destination) return;
      
      console.log([username, message, event, destination].join(" - "));
      
      const connection = connections[connUsername];
      connection.send(JSON.stringify({ username, message, event }));
    });
  });

  connection.on("close", () => {
    broadcastMessage(connections, username, "close");
    delete connections[username];
    delete publicKeys[username];
    broadcastKeys();
  });
});

server.listen(port, () => {
  console.log(`O servidor está rodando na porta ${port}!`);
});

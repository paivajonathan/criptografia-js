const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const connections = {};
const users = {};

wsServer.on("connection", (connection, request) => {
    const { username } = url.parse(request.url, true).query;
    const uuid = uuidv4();
    console.log(`O usuário ${username} (${uuid}) conectou-se no servidor.`)

    connections[uuid] = connection;
    users[uuid] = {
        username: username,
        state: {x: 0, y: 0},
    };

    connection.on("message", (message) => {
        console.log(`Usuário: ${username} enviou ${message.toString()}`);
    });
    
    connection.on("close", (code, reason) => {
        console.log(code, reason.toString(), "Deslogado");
    });
});

server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
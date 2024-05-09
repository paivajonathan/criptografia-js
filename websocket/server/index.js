const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const uuidv4 = require("uuid").v4;

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const MAX_CONNECTIONS = 2;
const connections = {};

wsServer.on("connection", (connection, request) => {
    if (Object.keys(connections).length >= MAX_CONNECTIONS) {
        connection.close();
        return;
    }

    const { username } = url.parse(request.url, true).query;
    const uuid = uuidv4();
    
    connections[uuid] = connection;
    
    console.log(`O usuário ${username} (${uuid}) conectou-se no servidor.`);

    connection.on("message", (message) => {
        console.log(`Usuário: ${username} enviou ${message.toString()}`);

        Object.keys(connections).forEach((id) => {
            if (uuid === id) return;
            const connection = connections[id];
            connection.send(`${username}: "${message.toString()}"`);
        });
    });
    
    connection.on("close", (code, reason) => {
        console.log(`Usuário ${username} se deslogou.`);
        delete connections[uuid];
    });
});

server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
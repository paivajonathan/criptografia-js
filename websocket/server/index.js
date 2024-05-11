const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const uuidv4 = require("uuid").v4;

const { faker } = require('@faker-js/faker');

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const MAX_CONNECTIONS = 2;
const connections = {};
// const messages = [];

// function sendToOne(connection, message) {
//     connection.send(JSON.stringify({ username: "server", message, event: "oldMessages" }));
// }

function sendToAll(connections, username, message, event) {
    Object.keys(connections).forEach((id) => {
        const connection = connections[id];
        const data = JSON.stringify({ username, message, event });
        connection.send(data);
    });
}

wsServer.on("connection", (connection, request) => {
    if (Object.keys(connections).length >= MAX_CONNECTIONS) {
        connection.close();
        return;
    }

    const username = url.parse(request.url, true).query.username || faker.person.fullName();
    const uuid = uuidv4();
    
    connections[uuid] = connection;

    console.log(`O usuário ${username} (${uuid}) conectou-se no servidor.`);
    sendToAll(connections, username, "", "connection");

    connection.on("message", (message) => {
        console.log(`${username} enviou ${message.toString()}`);
        sendToAll(connections, username, message.toString(), "message");
        
        // messages.push({ username, message: message.toString() });
    });
    
    connection.on("close", (code, reason) => {
        console.log(`Usuário ${username} se deslogou.`);
        sendToAll(connections, username, "", "close");
        delete connections[uuid];
    });
});

server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
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

wsServer.on("connection", (connection, request) => {
    if (Object.keys(connections).length >= MAX_CONNECTIONS) {
        connection.close();
        return;
    }

    const username = url.parse(request.url, true).query.username || faker.person.fullName();
    const uuid = uuidv4();
    
    connections[uuid] = connection;
    
    console.log(`O usuário ${username} (${uuid}) conectou-se no servidor.`);

    connection.on("message", (message) => {
        console.log(`${username} enviou ${message.toString()}`);

        Object.keys(connections).forEach((id) => {
            const connection = connections[id];
            const data = JSON.stringify({username, message: message.toString(), event: "message"});
            connection.send(data);
        });
    });
    
    connection.on("close", (code, reason) => {
        console.log(`Usuário ${username} se deslogou.`);

        Object.keys(connections).forEach((id) => {
            const connection = connections[id];
            const data = JSON.stringify({username, message: "", event: "close"});
            connection.send(data);
        });

        delete connections[uuid];
    });
});

server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});
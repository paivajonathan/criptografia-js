const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");

const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const MAX_CONNECTIONS = 2;
const connections = {};
const keys = {};

function isJSON(text) {
    if (typeof text !== "string")
        return false;
    
    try {
        JSON.parse(text);
        return true;
    } catch (error) {
        return false;
    }
}

function unicast(connections, username, message, event) {
    const connection = connections[username];
    connection.send(JSON.stringify({ username, message, event }));
}

function broadcast(connections, username, event, message = "") {
    console.log(`${username} - ${message} - ${event}`);
    
    const data = { username, message, event };

    Object.keys(connections).forEach((id) => {
        if (id === username) return;
        
        const connection = connections[id];
        connection.send(JSON.stringify(data));
    });
}

wsServer.on("connection", (connection, request) => {
    if (Object.keys(connections).length >= MAX_CONNECTIONS) {
        connection.close(1000, "Foi excedido o limite de conexões!");
        return;
    }

    const username = url.parse(request.url, true).query.username;

    if (Object.keys(connections).includes(username)) {
        connection.close(1000, "Usuário já está logado!");
        return;
    }
    
    connections[username] = connection;

    console.log(keys);

    unicast(connections, username, JSON.stringify(keys), "key");
    broadcast(connections, username, "connection");

    connection.on("message", (message) => {
        if (isJSON(message.toString())) {
            const { username, publicKey } = JSON.parse(message.toString());
            keys[username] = publicKey;
            return;
        }

        if (Object.keys(connections).length < 2) {
            connection.close(1000, "Espere algum outro usuário se conectar!");
            return;
        }

        broadcast(connections, username, "message", message.toString());
    });
    
    connection.on("close", () => { 
        broadcast(connections, username, "close");
        delete connections[username];
        delete keys[username];
    });
});

server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});

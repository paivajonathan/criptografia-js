const http = require("http");
const { WebSocketServer } = require("ws");

const url = require("url");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const server = http.createServer();
const wsServer = new WebSocketServer({ server });
const port = 8000;

const MAX_CONNECTIONS = 2;
const connections = {};

async function sendOldData(connection) {
    const oldData = await prisma.data.findMany({
        orderBy: { id: "asc" }
    });
    connection.send(JSON.stringify(oldData));
}

async function sendToAll(connections, username, message, event) {
    console.log(`${username} - ${message} - ${event}`);
    
    const data = { username, message, event };

    Object.keys(connections).forEach((id) => {
        const connection = connections[id];
        connection.send(JSON.stringify([data]));
    });

    await prisma.data.create({data: data});
}

wsServer.on("connection", async (connection, request) => {
    if (Object.keys(connections).length >= MAX_CONNECTIONS) {
        connection.close(1000, "Foi excedido o limite de conexões!");
        return;
    }

    const username = url.parse(request.url, true).query.username;

    if (Object.keys(connections).includes(username)) {
        connection.close(1000, "Usuário já existe!");
        return;
    }
    
    connections[username] = connection;
    
    await sendOldData(connection);
    await sendToAll(connections, username, "", "connection");

    connection.on("message", (message) => {        
        sendToAll(connections, username, message.toString(), "message");        
    });
    
    connection.on("close", () => {        
        sendToAll(connections, username, "", "close");
        delete connections[username];
    });
});

server.listen(port, () => {
    console.log(`The server is running on port ${port}`);
});

import app from './app.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create an HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Function to broadcast transactions
export const broadcastTransaction = (transaction) => {
    io.emit("transaction_update", transaction);
};

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


export { server, io }; 

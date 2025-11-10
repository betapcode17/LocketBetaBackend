import express from 'express';
import connectDB from "./libs/db.js";
import cors from 'cors';
import chatRouter from './routes/chat_router.js';
import messageRouter from './routes/message_router.js';
import PostRoute from './routes/post_routes.js';
import AuthRoute from './routes/auth_routes.js';
import http from "http";
import { WebSocketServer } from 'ws';
import { handleWsConnection } from './controller/message_controller.js';
import dotenv from 'dotenv';

dotenv.config(); // Load env vars

const PORT = process.env.PORT || 5000; // Chọn 5000 từ commit kia

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/chats', chatRouter);
app.use('/api/messages', messageRouter);
app.use('/api/posts', PostRoute);
app.use('/api/auth', AuthRoute);

// Create HTTP server from Express
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
var webSockets = {};

server.on("upgrade", (request, socket, head) => {
  // Có thể kiểm tra auth header / cookie ở đây trước khi upgrade
  // Ví dụ: nếu không auth => socket.destroy()
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on('connection', (ws, req) => {
  handleWsConnection(ws, req, wss, webSockets);
});

// Connect DB and start server
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`HTTP + WS server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });
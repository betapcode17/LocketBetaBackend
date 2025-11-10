import express from "express";
import connectDB from "./libs/db.js";
import PhotoRoute from "./routes/photo_routes.js"; // chỉ dùng PhotoRoute
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import { handleWsConnection } from "./controller/message_controller.js";
import dotenv from "dotenv";

dotenv.config(); // Load env vars

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/photos", PhotoRoute);

// Create HTTP server & WebSocket server
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
var webSockets = {};

server.on("upgrade", (request, socket, head) => {
  // Có thể kiểm tra auth ở đây
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (ws, req) => {
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

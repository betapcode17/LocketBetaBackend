import express from "express";
import cors from "cors";
import connectDB from "./libs/db.js";
// import chatRouter from "./routes/chat_router.js";
// import messageRouter from "./routes/message_router.js";
import PostRoute from "./routes/post_routes.js";
import AuthRoute from "./routes/auth_routes.js";
import dotenv from "dotenv";
dotenv.config(); // Phải gọi trước khi connectDB

const PORT = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
// app.use("/api/chats", chatRouter);
// app.use("/api/messages", messageRouter);
app.use("/api/posts", PostRoute);
app.use("/api/auth", AuthRoute);
// connect to DB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err);
  });

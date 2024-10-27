import express from "express";
import apiRoutes from "./routes";
import { WebSocket } from "ws";
import { createClient } from "redis";

const app = express();
export const redisClient = createClient();
export const subscriber = createClient();
export const requestQueue = "requestQueue";

app.use(express.json());

app.use("/api/v2", apiRoutes);

export const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("websocket connected successfully");
});

ws.on("message", (message) => {
  const data = JSON.parse(message.toString());
  console.log("parsed data from websocket: ", data);
});

ws.on("close", () => {
  console.log("websocket disconnected successfully");
});

async function startServer() {
  try {
    await redisClient.connect();
    await subscriber.connect();
    console.log("redis connected successfully");

    app.listen(3000, () => {
      console.log("server is listening on port 3000");
    });
  } catch (error) {
    console.error("redis connection failed", error);
  }
}

startServer();

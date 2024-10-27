import { WebSocketServer, RawData, OPEN } from "ws";
import express from "express";
import { createClient } from "redis";

const app = express();
const http = app.listen(8080);
const wss = new WebSocketServer({ server: http });
const redisClient = createClient();
const redisPublisher = createClient();

const subscribers = new Map<string, (message: string, channel: string) => void>();

wss.on("connection", (ws) => {
  console.log("client connected successfully");

  ws.on("message", async (message: RawData) => {
    const messageStr = typeof message === "string" ? message : message.toString();
    const data = JSON.parse(messageStr);
    // console.log("received message: ", data);

    if (data.type === "subscribe") {
      const { stockSymbol } = data;
      if (!subscribers.has(stockSymbol)) {
        const listener = (message: string) => {
          if (ws.readyState === OPEN) {
            const data = {
              event: `event_orderbook_update`,
              message,
            };
            ws.send(JSON.stringify(data));
            console.log(`sent update to ${stockSymbol}:`, JSON.stringify(data));
          }
        };

        await redisClient.subscribe(`orderbook-${stockSymbol}`, listener);
        subscribers.set(stockSymbol, listener);
        console.log(`subscribed to orderbook-${stockSymbol}`);
      } else {
        console.log(`already subscribed to orderbook-${stockSymbol}`);
      }
    }

    if (data.type === "unsubscribe") {
      const { stockSymbol } = data;
      const listener = subscribers.get(stockSymbol);
      if (listener) {
        await redisClient.unsubscribe(`orderbook-${stockSymbol}`, listener);
        subscribers.delete(stockSymbol);
        console.log(`unsubscribed to orderbook-${stockSymbol}`);
      }
    }
  });

  ws.on("close", () => {
    console.log("client disconnected successfully");
    for (const stockSymbol of subscribers.keys()) {
      const listener = subscribers.get(stockSymbol);
      if (listener) {
        redisClient.unsubscribe(`orderbook-${stockSymbol}`, listener);
      }
    }
    subscribers.clear();
  });
});

async function startServerConnection() {
  try {
    await redisClient.connect();
    await redisPublisher.connect();
    console.log("connected to redis successfully");
  } catch (error) {
    console.error("failed to connect to redis", error);
  }
}

startServerConnection();

import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { redisClient, requestQueue } from "..";
import { handlePubSubTimeout } from "./index";
import { sendResponse } from "../utils";

export const buyToken = async (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;
  const uid = randomUUID();
  const data = {
    method: "buyToken",
    uid: uid,
    payload: {
      userId: userId,
      stockSymbol: stockSymbol,
      quantity: quantity,
      price: price,
      stockType: stockType,
    },
  };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 10000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

export const sellToken = async (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity, price, stockType } = req.body;
  const uid = randomUUID();
  const data = {
    method: "sellToken",
    uid: uid,
    payload: {
      userId: userId,
      stockSymbol: stockSymbol,
      quantity: quantity,
      price: price,
      stockType: stockType,
    },
  };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 10000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

import { Request, Response } from "express";
import { redisClient, requestQueue, subscriber } from "..";
import { randomUUID } from "crypto";
import { sendResponse } from "../utils";
import { handlePubSubTimeout } from "./index";

export const createUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const uid = randomUUID();
  const data = { method: "createUser", uid: uid, payload: userId };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error: any) {
    res
      .status(500)
      .json({ error: error.message || "pub/sub communication error" });
  }
};

export const createStockSymbol = async (req: Request, res: Response) => {
  const { stockSymbol } = req.params;
  const uid = randomUUID();
  const data = { method: "createStockSymbol", uid: uid, payload: stockSymbol };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

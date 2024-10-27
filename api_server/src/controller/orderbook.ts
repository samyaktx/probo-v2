import { Request, Response } from "express";
import { redisClient, requestQueue } from "..";
import { randomUUID } from "crypto";
import { sendResponse } from "../utils";
import { handlePubSubTimeout } from "./index";

export const getOrderbook = async (req: Request, res: Response) => {
  const uid = randomUUID();
  const data = { method: "getOrderbook", uid: uid };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

export const getUserOrderbook = async (req: Request, res: Response) => {
  const { stockSymbol } = req.params;
  const uid = randomUUID();
  const data = {
    method: "getUserOrderbook",
    uid: uid,
    payload: stockSymbol,
  };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "Error in pub/sub communication" });
  }
};
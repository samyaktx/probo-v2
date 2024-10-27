import { Request, Response } from "express";
import { redisClient, requestQueue } from "..";
import { randomUUID } from "crypto";
import { sendResponse } from "../utils";
import { handlePubSubTimeout } from "./index";

export const getINRBalance = async (req: Request, res: Response) => {
  const uid = randomUUID();
  const data = { method: "getINRBalance", uid: uid };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

export const getStockBalance = async (req: Request, res: Response) => {
  const uid = randomUUID();
  const data = { method: "getStockBalance", uid: uid };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

export const getUserINRBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const uid = randomUUID();
  const data = { method: "getUserINRBalance", uid: uid, payload: userId };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

export const getUserStockBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const uid = randomUUID();
  const data = {
    method: "getUserStockBalance",
    uid: uid,
    payload: userId,
  };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};
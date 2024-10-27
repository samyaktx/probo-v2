import { Request, Response } from "express";
import { randomUUID } from "crypto";
import { redisClient, requestQueue } from "..";
import { handlePubSubTimeout } from "./index";
import { sendResponse } from "../utils";

export const reset = async (req: Request, res: Response) => {
  const uid = randomUUID();
  const data = { method: "reset", uid: uid };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

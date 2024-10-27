import { Request, Response } from "express";
import { redisClient, requestQueue, subscriber } from "..";
import { randomUUID } from "crypto";

const handlePubSubTimeout = (
  uid: string,
  timeoutX: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const channel = `response.${uid}`;

    const timeout = setTimeout(() => {
      subscriber.unsubscribe(channel);
      reject(new Error("response timed out"));
    }, timeoutX);

    subscriber.subscribe(channel, (data) => {
      clearTimeout(timeout);
      subscriber.unsubscribe(channel);
      resolve(data);
    });
  });
};

const handlePubSub = (uid: string): Promise<any> => {
  return new Promise((resolve) => {
    const channel = `response.${uid}`;

    subscriber.subscribe(channel, (data) => {
      resolve(data);
    });
  });
};

const sendResponse = (res: Response, payload: any) => {
  try {
    const { error, ...data } = JSON.parse(payload);
    if (error) {
      res.status(404).json(data);
    } else {
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: "invalid response from server" });
  }
};

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

export const getUserBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const uid = randomUUID();
  const data = { method: "getUserBalance", uid: uid, payload: userId };

  try {
    const pubSubPromise = handlePubSubTimeout(uid, 5000);
    await redisClient.lPush(requestQueue, JSON.stringify(data));
    const response = await pubSubPromise;
    sendResponse(res, response);
  } catch (error) {
    res.status(500).json({ error: "pub/sub communication error" });
  }
};

export const onramp = async (req: Request, res: Response) => {
  const { userId, amount } = req.body;
  const uid = randomUUID();
  const data = {
    method: "onramp",
    uid: uid,
    payload: { userId: userId, amount: amount },
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

export const mintToken = async (req: Request, res: Response) => {
  const { userId, stockSymbol, quantity } = req.body;
  const uid = randomUUID();
  const data = {
    method: "mintToken",
    uid: uid,
    payload: { userId: userId, stockSymbol: stockSymbol, quantity: quantity },
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
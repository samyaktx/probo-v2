import { Response } from "express";

export const sendResponse = (res: Response, payload: any) => {
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

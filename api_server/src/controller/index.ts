import { subscriber } from "..";

export const handlePubSubTimeout = (
  uid: string,
  timeoutX: number
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const channel = `response.${uid}`;

    const timeout = setTimeout(() => {
      subscriber.unsubscribe(channel);
      reject(new Error("response timeout"));
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
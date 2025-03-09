import * as amqp from "amqplib/callback_api";

const RABBIT_URL = process.env.RABBITMQ_URL;
if (!RABBIT_URL) {
  throw new Error("RabbitMQ URL not provided in environment variables.");
}

let channel: amqp.Channel;

// Connect to RabbitMQ
export const connectRabbitMQ = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    amqp.connect(`${RABBIT_URL}`, (error0, connection) => {
      if (error0) {
        return reject(error0);
      }

      connection.createChannel((error1, ch) => {
        if (error1) {
          return reject(error1);
        }

        channel = ch;
        console.log("Connected to RabbitMQ!");
        resolve();
      });
    });
  });
};

export const getChannel = (): amqp.Channel => {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel is not initialized. Call connectRabbitMQ first.",
    );
  }
  return channel;
};

export const consumeFromQueue = (
  queue: string,
  callback: (msg: amqp.Message | null) => void,
): void => {
  const ch = getChannel();
  ch.assertQueue(queue, { durable: true });
  ch.consume(queue, callback, { noAck: true });
};

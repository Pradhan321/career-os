import { getChannel } from "./rabbitmq.js";

import {
  EXCHANGES,
  RETRY,
} from "./constants.js";

export const retryMessage = async ({
  message,
  routingKey,
}) => {

  const channel = getChannel();

  const headers = {
    ...(message.properties.headers || {}),
  };

  const retryCount =
    (headers["x-retry-count"] || 0) + 1;

  if (retryCount > RETRY.MAX_RETRIES) {

    console.log(
      `☠️ Message moved to DLQ after ${RETRY.MAX_RETRIES} retries`
    );

    await channel.publish(
      EXCHANGES.DLX,
      `${routingKey}.failed`,
      message.content,
      {
        persistent: true,

        headers: {
          ...headers,
          "x-retry-count": retryCount,
        },
      }
    );

    channel.ack(message);

    return;
  }

  console.log(
    `🔁 Retry Attempt ${retryCount}`
  );

  await channel.publish(
    EXCHANGES.RETRY,
    `${routingKey}.retry`,
    message.content,
    {
      persistent: true,

      headers: {
        ...headers,
        "x-retry-count": retryCount,
      },
    }
  );

  channel.ack(message);

};
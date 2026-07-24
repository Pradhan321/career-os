import { randomUUID } from "crypto";
import { getChannel } from "./rabbitmq.js";

export const publishEvent = async ({
  exchange,
  routingKey,
  data,
  headers = {},
  correlationId,
}) => {
  const channel = getChannel();

  await channel.assertExchange(exchange, "direct", {
    durable: true,
  });

  const messageId = randomUUID();

  const finalCorrelationId =
    correlationId || randomUUID();

  channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(data)),
    {
      persistent: true,

      messageId,

      correlationId: finalCorrelationId,

      timestamp: Date.now(),

      contentType: "application/json",

      headers: {
        ...headers,
      },
    }
  );

  console.log(
    `📤 Event Published: ${routingKey}`,
    {
      messageId,
      correlationId: finalCorrelationId,
    }
  );

  return {
    messageId,
    correlationId: finalCorrelationId,
  };
};
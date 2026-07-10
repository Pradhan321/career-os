import { getChannel } from "./rabbitmq.js";

export const publishEvent = async ({
  exchange,
  routingKey,
  data,
}) => {
  const channel = getChannel();

  await channel.assertExchange(exchange, "direct", {
    durable: true,
  });

  channel.publish(
    exchange,
    routingKey,
    Buffer.from(JSON.stringify(data)),
    {
      persistent: true,
    }
  );

  console.log(
    `📤 Event Published: ${routingKey}`
  );
};
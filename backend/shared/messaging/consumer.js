import { getChannel } from "./rabbitmq.js";

export const consumeEvent = async ({
  exchange,
  queue,
  routingKey,
  handler,
}) => {
  const channel = getChannel();

  // Create exchange if it doesn't exist
  await channel.assertExchange(exchange, "direct", {
    durable: true,
  });

  // Create queue if it doesn't exist
  await channel.assertQueue(queue, {
    durable: true,
  });

  // Bind queue to exchange
  await channel.bindQueue(
    queue,
    exchange,
    routingKey
  );

  console.log(`📥 Listening on queue: ${queue}`);

  channel.consume(
    queue,
    async (message) => {
      if (!message) return;

      try {
        const data = JSON.parse(
          message.content.toString()
        );

        await handler(data);

        channel.ack(message);

      } catch (error) {

        console.error(
          "Consumer Error:",
          error.message
        );

        channel.nack(message, false, false);
      }
    },
    {
      noAck: false,
    }
  );
};
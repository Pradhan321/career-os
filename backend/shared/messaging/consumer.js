import { getChannel } from "./rabbitmq.js";
import { retryMessage } from "./retry.js";

export const consumeEvent = async ({
  exchange,
  queue,
  routingKey,
  handler,
}) => {
  const channel = getChannel();

  await channel.prefetch(1);

  console.log(
    `📥 Listening on queue: ${queue}`
  );

  channel.consume(
    queue,
    async (message) => {
      if (!message) return;

      const correlationId =
        message.properties.correlationId;

      const messageId =
        message.properties.messageId;

      try {
        const data = JSON.parse(
          message.content.toString()
        );

        await handler(data, {
          messageId,
          correlationId,
        });

        channel.ack(message);

      } catch (error) {
        console.error(
          `❌ Consumer Error`,
          {
            messageId,
            correlationId,
            error: error.message,
          }
        );

        await retryMessage({
          message,
          routingKey,
        });
      }
    },
    {
      noAck: false,
    }
  );
};
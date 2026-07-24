import amqp from "amqplib";

let connection = null;
let channel = null;

let reconnectTimer = null;
let reconnectHandler = null;

let isShuttingDown = false;

const RECONNECT_DELAY = 5000;

export const connectRabbitMQ = async () => {
  try {

    if (connection && channel) {
      return {
        connection,
        channel,
      };
    }

    const newConnection = await amqp.connect(
      process.env.RABBITMQ_URL
    );

    const newChannel =
      await newConnection.createChannel();

    connection = newConnection;
    channel = newChannel;

    console.log(
      "🐇 RabbitMQ Connected"
    );

    newConnection.on(
      "close",
      () => {

        console.log(
          "RabbitMQ Connection Closed"
        );

        connection = null;
        channel = null;

        if (!isShuttingDown) {
          scheduleReconnect();
        }
      }
    );

    newConnection.on(
      "error",
      (error) => {

        console.error(
          "RabbitMQ Error:",
          error.message
        );
      }
    );

    return {
      connection,
      channel,
    };

  } catch (error) {

    console.error(
      "RabbitMQ Connection Failed:",
      error.message
    );

    connection = null;
    channel = null;

    throw error;
  }
};

const scheduleReconnect = () => {

  if (reconnectTimer) {
    return;
  }

  console.log(
    `🔄 Reconnecting to RabbitMQ in ${
      RECONNECT_DELAY / 1000
    } seconds...`
  );

  reconnectTimer = setTimeout(
    async () => {

      reconnectTimer = null;

      try {

        await connectRabbitMQ();

        console.log(
          "✅ RabbitMQ Reconnected"
        );

        if (reconnectHandler) {

          console.log(
            "🔄 Restarting RabbitMQ Consumers..."
          );

          await reconnectHandler();
        }

      } catch (error) {

        console.error(
          "RabbitMQ Reconnection Failed:",
          error.message
        );

        scheduleReconnect();
      }

    },
    RECONNECT_DELAY
  );
};

export const registerReconnectHandler = (
  handler
) => {

  reconnectHandler = handler;
};

export const getChannel = () => {

  if (!channel) {
    throw new Error(
      "RabbitMQ not connected"
    );
  }

  return channel;
};

export const isRabbitMQHealthy = () => {

  return Boolean(
    connection && channel
  );
};

export const closeRabbitMQ = async () => {

  isShuttingDown = true;

  if (reconnectTimer) {

    clearTimeout(reconnectTimer);

    reconnectTimer = null;
  }

  try {

    if (channel) {

      await channel.close();

      channel = null;
    }

    if (connection) {

      await connection.close();

      connection = null;
    }

    console.log(
      "🐇 RabbitMQ Connection Closed Gracefully"
    );

  } catch (error) {

    console.error(
      "RabbitMQ Shutdown Error:",
      error.message
    );
  }
};
import amqp from "amqplib";

let connection = null;
let channel = null;

export const connectRabbitMQ = async () => {
  try {
    if (connection && channel) {
      return { connection, channel };
    }

    connection = await amqp.connect(process.env.RABBITMQ_URL);

    channel = await connection.createChannel();

    console.log("🐇 RabbitMQ Connected");

    connection.on("close", () => {
      console.log("RabbitMQ Connection Closed");
      connection = null;
      channel = null;
    });

    connection.on("error", (err) => {
      console.error("RabbitMQ Error:", err.message);
    });

    return { connection, channel };

  } catch (error) {
    console.error("RabbitMQ Connection Failed");
    throw error;
  }
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("RabbitMQ not connected");
  }

  return channel;
};
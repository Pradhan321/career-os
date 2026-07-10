import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";
import { connectRabbitMQ } from "../../shared/messaging/rabbitmq.js";
import { startConsumers } from "./events/startConsumers.js";

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  await connectDB();
  await connectRabbitMQ();
  await startConsumers();
  app.listen(PORT, () => {
    console.log(
      `🚀 User Service running on port ${PORT}`
    );
  });
};

startServer();
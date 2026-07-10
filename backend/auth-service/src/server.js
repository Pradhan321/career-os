import dotenv from "dotenv";
import { connectRabbitMQ } from "../../shared/messaging/rabbitmq.js";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    app.listen(PORT, () => {
      console.log(
        `🚀 Auth Service running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
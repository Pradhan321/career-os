import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB, {
  closeDB,
} from "./config/db.js";

import {
  connectRabbitMQ,
  closeRabbitMQ,
} from "../../shared/messaging/rabbitmq.js";

const PORT = process.env.PORT || 5001;

let server;

const startServer = async () => {
  try {
    await connectDB();

    await connectRabbitMQ();

    server = app.listen(PORT, () => {
      console.log(
        `🚀 Auth Service running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "❌ Auth Service Startup Failed:",
      error.message
    );

    process.exit(1);
  }
};

const shutdown = async (signal) => {
  console.log(
    `\n🛑 ${signal} received. Starting graceful shutdown...`
  );

  try {

    // 1. Stop accepting new HTTP requests
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      console.log(
        "🌐 Auth HTTP Server Closed"
      );
    }

    // 2. Close RabbitMQ
    await closeRabbitMQ();

    // 3. Close MongoDB
    await closeDB();

    console.log(
      "✅ Auth Service Shutdown Completed"
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "❌ Auth Service Shutdown Failed:",
      error.message
    );

    process.exit(1);
  }
};

process.on(
  "SIGINT",
  () => shutdown("SIGINT")
);

process.on(
  "SIGTERM",
  () => shutdown("SIGTERM")
);

startServer();
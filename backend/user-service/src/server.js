import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB, {
  closeDB,
} from "./config/db.js";

import {
  connectRabbitMQ,
  closeRabbitMQ,
  registerReconnectHandler,
} from "../../shared/messaging/rabbitmq.js";

import { startConsumers } from "./events/startConsumers.js";

const PORT = process.env.PORT || 5002;

let server;

const startServer = async () => {
  try {
    await connectDB();

    await connectRabbitMQ();

    await startConsumers();

    registerReconnectHandler(async () => {
  await startConsumers();
});

    server = app.listen(PORT, () => {
      console.log(
        `🚀 User Service running on port ${PORT}`
      );
    });

  } catch (error) {
    console.error(
      "❌ Service Startup Failed:",
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
    // Stop accepting new HTTP requests
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });

      console.log(
        "🌐 HTTP Server Closed"
      );
    }

    // Close RabbitMQ
    await closeRabbitMQ();

    // Close MongoDB
    await closeDB();

    console.log(
      "✅ Graceful Shutdown Completed"
    );

    process.exit(0);

  } catch (error) {
    console.error(
      "❌ Graceful Shutdown Failed:",
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
import mongoose from "mongoose";
import {
  isRabbitMQHealthy,
} from "../../../shared/messaging/rabbitmq.js";

export const healthCheck = (req, res) => {
  const mongoHealthy =
    mongoose.connection.readyState === 1;

  const rabbitMQHealthy =
    isRabbitMQHealthy();

  const isHealthy =
    mongoHealthy && rabbitMQHealthy;

  return res.status(
    isHealthy ? 200 : 503
  ).json({
    success: isHealthy,
    service: "user-service",
    status: isHealthy
      ? "healthy"
      : "unhealthy",

    dependencies: {
      mongodb: mongoHealthy
        ? "connected"
        : "disconnected",

      rabbitmq: rabbitMQHealthy
        ? "connected"
        : "disconnected",
    },

    timestamp: new Date().toISOString(),
  });
};
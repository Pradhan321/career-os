import axios from "axios";
import { SERVICES } from "../config/services.js";

export const healthCheck = async (req, res) => {
  const services = {};

  const checkService = async (name, url) => {
    try {
      await axios.get(`${url}/health`, {
        timeout: 3000,
      });

      services[name] = "UP";
    } catch {
      services[name] = "DOWN";
    }
  };

  await Promise.all([
    checkService("auth-service", SERVICES.auth.baseURL),
    checkService("user-service", SERVICES.profiles.baseURL),
  ]);

  res.status(200).json({
    success: true,
    gateway: "UP",
    services,
    timestamp: new Date().toISOString(),
  });
};
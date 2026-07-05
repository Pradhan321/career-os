import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT,
  AUTH_SERVICE: process.env.AUTH_SERVICE,
  USER_SERVICE: process.env.USER_SERVICE,
};
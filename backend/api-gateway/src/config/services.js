import { env } from "./env.js";

export const SERVICES = {

  auth: {
    baseURL: env.AUTH_SERVICE,
    prefix: "/api/v1/auth",
  },

  profiles: {
    baseURL: env.USER_SERVICE,
    prefix: "/api/v1/profiles",
  },

};
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import gatewayRoutes from "./routes/gateway.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import requestIdMiddleware from "./middlewares/requestId.middleware.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import { apiLimiter } from "./middlewares/rateLimiter.middleware.js";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(requestIdMiddleware);
app.use(loggerMiddleware);
app.use(apiLimiter);
app.use("/api", gatewayRoutes);

app.use(errorHandler);

export default app;
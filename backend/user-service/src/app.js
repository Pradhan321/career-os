import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import profileRoutes from "./routes/profile.routes.js";
import errorHandler from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/v1/profiles", profileRoutes);

app.use(errorHandler);

export default app;
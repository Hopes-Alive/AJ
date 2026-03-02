import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./routes";

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow any localhost origin in development
      if (origin.startsWith("http://localhost:") || origin === FRONTEND_URL) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

export default app;

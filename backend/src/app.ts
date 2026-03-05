import "dotenv/config";
import express from "express";
import cors from "cors";
import apiRouter from "./routes";

const app = express();
const configuredFrontendUrls =
  process.env.FRONTEND_URL?.split(",").map((url) => url.trim()).filter(Boolean) ?? [];
const staticAllowedOrigins = [
  "https://ajfreshfood.com.au",
  "https://www.ajfreshfood.com.au",
  "https://ajfresh-git-main-gamisangita7-1406s-projects.vercel.app",
];
const allowedOrigins = new Set([...configuredFrontendUrls, ...staticAllowedOrigins]);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin) return callback(null, true);
      // Allow any localhost origin in development
      if (origin.startsWith("http://localhost:")) {
        return callback(null, true);
      }
      // Allow explicitly configured production frontend URLs.
      if (allowedOrigins.has(origin)) {
        return callback(null, true);
      }
      // Allow Vercel preview and production domains.
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "AJ backend API is running",
    health: "/api/health",
  });
});

app.use("/api", apiRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

export default app;

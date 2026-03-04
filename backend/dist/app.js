"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const configuredFrontendUrls = process.env.FRONTEND_URL?.split(",").map((url) => url.trim()).filter(Boolean) ?? [];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin)
            return callback(null, true);
        // Allow any localhost origin in development
        if (origin.startsWith("http://localhost:")) {
            return callback(null, true);
        }
        // Allow explicitly configured production frontend URLs.
        if (configuredFrontendUrls.includes(origin)) {
            return callback(null, true);
        }
        // Allow Vercel preview and production domains.
        if (origin.endsWith(".vercel.app")) {
            return callback(null, true);
        }
        callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "AJ backend API is running",
        health: "/api/health",
    });
});
app.use("/api", routes_1.default);
app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});
exports.default = app;
//# sourceMappingURL=app.js.map
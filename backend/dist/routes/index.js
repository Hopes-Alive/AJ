"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_1 = __importDefault(require("./orders"));
const admin_1 = __importDefault(require("./admin"));
const catalog_1 = __importDefault(require("./catalog"));
const developer_1 = __importDefault(require("./developer"));
const router = (0, express_1.Router)();
// Base API route registration for the backend service.
router.use("/admin", admin_1.default);
router.use("/developer", developer_1.default);
router.use("/orders", orders_1.default);
router.use("/catalog", catalog_1.default);
router.get("/health", (_req, res) => {
    res.json({ success: true, message: "AJ Fresh Backend is running" });
});
exports.default = router;
//# sourceMappingURL=index.js.map
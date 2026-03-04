import { Router } from "express";
import ordersRouter from "./orders";
import adminRouter from "./admin";
import catalogRouter from "./catalog";
import developerRouter from "./developer";

const router = Router();

// Base API route registration for the backend service.
router.use("/admin", adminRouter);
router.use("/developer", developerRouter);
router.use("/orders", ordersRouter);
router.use("/catalog", catalogRouter);

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "AJ Fresh Backend is running" });
});

export default router;

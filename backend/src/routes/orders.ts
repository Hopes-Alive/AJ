import { Router, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { generateOrderNumber } from "../lib/orderNumber";
import { requireAuth, AuthenticatedRequest } from "../middleware/auth";
import { CreateOrderPayload, ApiResponse, Order } from "../types";

const router = Router();

router.use(requireAuth);

// GET /api/orders — list all orders for the authenticated user
router.get("/", async (req: AuthenticatedRequest, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("user_id", req.userId!)
    .order("created_at", { ascending: false });

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const response: ApiResponse<Order[]> = { success: true, data: data ?? [] };
  res.json(response);
});

// GET /api/orders/lookup/:orderNumber — look up any order by order number (owner only)
router.get("/lookup/:orderNumber", async (req: AuthenticatedRequest, res: Response) => {
  const { orderNumber } = req.params;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber.toUpperCase())
    .eq("user_id", req.userId!)
    .maybeSingle();

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  if (!data) {
    const response: ApiResponse = {
      success: false,
      error: "Order not found or you do not have access to this order",
    };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Order> = { success: true, data };
  res.json(response);
});

// GET /api/orders/:id — get a single order by UUID
router.get("/:id", async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", id)
    .eq("user_id", req.userId!)
    .maybeSingle();

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  if (!data) {
    const response: ApiResponse = { success: false, error: "Order not found" };
    res.status(404).json(response);
    return;
  }

  const response: ApiResponse<Order> = { success: true, data };
  res.json(response);
});

// POST /api/orders — create a new order
router.post("/", async (req: AuthenticatedRequest, res: Response) => {
  const payload = req.body as CreateOrderPayload;

  if (!payload.order_name || payload.order_name.trim() === "") {
    const response: ApiResponse = { success: false, error: "Order name is required" };
    res.status(400).json(response);
    return;
  }

  if (!payload.items || payload.items.length === 0) {
    const response: ApiResponse = { success: false, error: "Order must contain at least one item" };
    res.status(400).json(response);
    return;
  }

  if (!payload.delivery_address || payload.delivery_address.trim() === "") {
    const response: ApiResponse = { success: false, error: "Delivery address is required" };
    res.status(400).json(response);
    return;
  }

  const order_number = await generateOrderNumber();

  const allowedInitialStatuses = ["payment_pending", "paid"];
  const initialStatus = allowedInitialStatuses.includes(payload.status ?? "")
    ? payload.status
    : "payment_pending";

  const { data, error } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number,
      order_name: payload.order_name.trim(),
      user_id: req.userId!,
      status: initialStatus,
      items: payload.items,
      subtotal: payload.subtotal,
      notes: payload.notes ?? null,
      delivery_address: payload.delivery_address,
    })
    .select()
    .single();

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const response: ApiResponse<Order> = {
    success: true,
    data,
    message: `Order ${order_number} created successfully`,
  };
  res.status(201).json(response);
});

// PATCH /api/orders/:id/status — update order status (admin)
router.patch("/:id/status", async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body as { status: string };

  const validStatuses = ["pending", "in_progress", "payment_pending", "paid", "closed", "cancelled"];
  if (!validStatuses.includes(status)) {
    const response: ApiResponse = { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` };
    res.status(400).json(response);
    return;
  }

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("id", id)
    .eq("user_id", req.userId!)
    .maybeSingle();

  if (fetchError || !existing) {
    const response: ApiResponse = { success: false, error: "Order not found" };
    res.status(404).json(response);
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const response: ApiResponse<Order> = { success: true, data, message: `Status updated to ${status}` };
  res.json(response);
});

// PATCH /api/orders/:id/cancel — cancel an order (only if pending)
router.patch("/:id/cancel", async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("orders")
    .select("status")
    .eq("id", id)
    .eq("user_id", req.userId!)
    .maybeSingle();

  if (fetchError || !existing) {
    const response: ApiResponse = { success: false, error: "Order not found" };
    res.status(404).json(response);
    return;
  }

  if (existing.status !== "pending") {
    const response: ApiResponse = {
      success: false,
      error: "Only pending orders can be cancelled",
    };
    res.status(400).json(response);
    return;
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const response: ApiResponse<Order> = {
    success: true,
    data,
    message: "Order cancelled",
  };
  res.json(response);
});

export default router;

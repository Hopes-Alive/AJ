import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { ApiResponse } from "../types";

const router = Router();

// GET /api/admin/status — public, checks if an admin account exists yet
router.get("/status", async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const adminExists = data.users.some(
    (u) => u.user_metadata?.is_admin === true
  );

  const response: ApiResponse<{ registered: boolean }> = {
    success: true,
    data: { registered: adminExists },
  };
  res.json(response);
});

// POST /api/admin/register — creates the admin account via service role (bypasses email confirmation)
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body as {
    email: string;
    password: string;
    fullName: string;
  };

  if (!email || !password || !fullName) {
    const response: ApiResponse = { success: false, error: "email, password and fullName are required" };
    res.status(400).json(response);
    return;
  }

  // Refuse if an admin already exists
  const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
  const adminAlreadyExists = existing?.users.some(
    (u) => u.user_metadata?.is_admin === true
  );

  if (adminAlreadyExists) {
    const response: ApiResponse = { success: false, error: "An admin account already exists" };
    res.status(409).json(response);
    return;
  }

  // Create user via admin API — email_confirm: true skips confirmation email
  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, is_admin: true },
  });

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const response: ApiResponse = { success: true, message: "Admin account created" };
  res.status(201).json(response);
});

export default router;

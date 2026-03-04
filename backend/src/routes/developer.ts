import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase";
import { ApiResponse } from "../types";

const router = Router();

// GET /api/developer/status — public, checks if a developer account exists yet
router.get("/status", async (_req: Request, res: Response) => {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const developerExists = data.users.some(
    (u) => u.user_metadata?.is_developer === true
  );

  const response: ApiResponse<{ registered: boolean }> = {
    success: true,
    data: { registered: developerExists },
  };
  res.json(response);
});

// POST /api/developer/register — creates the developer account via service role
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body as {
    email: string;
    password: string;
    fullName: string;
  };

  if (!email || !password || !fullName) {
    const response: ApiResponse = {
      success: false,
      error: "email, password and fullName are required",
    };
    res.status(400).json(response);
    return;
  }

  const { data: existing } = await supabaseAdmin.auth.admin.listUsers();
  const developerAlreadyExists = existing?.users.some(
    (u) => u.user_metadata?.is_developer === true
  );

  if (developerAlreadyExists) {
    const response: ApiResponse = {
      success: false,
      error: "A developer account already exists",
    };
    res.status(409).json(response);
    return;
  }

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, is_developer: true, is_admin: false },
  });

  if (error) {
    const response: ApiResponse = { success: false, error: error.message };
    res.status(500).json(response);
    return;
  }

  const response: ApiResponse = { success: true, message: "Developer account created" };
  res.status(201).json(response);
});

export default router;

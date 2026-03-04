import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabase";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}

async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
): Promise<{ isAdmin: boolean; isDeveloper: boolean } | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Missing or invalid authorization header" });
    return null;
  }

  const token = authHeader.split(" ")[1];
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ success: false, error: "Invalid or expired token" });
    return null;
  }

  req.userId = data.user.id;
  req.userEmail = data.user.email;
  return {
    isAdmin: data.user.user_metadata?.is_admin === true,
    isDeveloper: data.user.user_metadata?.is_developer === true,
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const auth = await authenticateToken(req, res);
  if (!auth) {
    return;
  }

  if (!auth.isAdmin) {
    res.status(403).json({ success: false, error: "Admin access required" });
    return;
  }

  next();
}

export async function requireStaff(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const auth = await authenticateToken(req, res);
  if (!auth) {
    return;
  }

  if (!auth.isAdmin && !auth.isDeveloper) {
    res.status(403).json({ success: false, error: "Staff access required" });
    return;
  }

  next();
}

export async function requireDeveloper(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const auth = await authenticateToken(req, res);
  if (!auth) {
    return;
  }

  if (!auth.isDeveloper) {
    res.status(403).json({ success: false, error: "Developer access required" });
    return;
  }

  next();
}

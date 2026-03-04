"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
// GET /api/admin/status — public, checks if an admin account exists yet
router.get("/status", async (_req, res) => {
    const { data, error } = await supabase_1.supabaseAdmin.auth.admin.listUsers();
    if (error) {
        const response = { success: false, error: error.message };
        res.status(500).json(response);
        return;
    }
    const adminExists = data.users.some((u) => u.user_metadata?.is_admin === true);
    const response = {
        success: true,
        data: { registered: adminExists },
    };
    res.json(response);
});
// POST /api/admin/register — creates the admin account via service role (bypasses email confirmation)
router.post("/register", async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
        const response = { success: false, error: "email, password and fullName are required" };
        res.status(400).json(response);
        return;
    }
    // Refuse if an admin already exists
    const { data: existing } = await supabase_1.supabaseAdmin.auth.admin.listUsers();
    const adminAlreadyExists = existing?.users.some((u) => u.user_metadata?.is_admin === true);
    if (adminAlreadyExists) {
        const response = { success: false, error: "An admin account already exists" };
        res.status(409).json(response);
        return;
    }
    // Create user via admin API — email_confirm: true skips confirmation email
    const { error } = await supabase_1.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, is_admin: true },
    });
    if (error) {
        const response = { success: false, error: error.message };
        res.status(500).json(response);
        return;
    }
    const response = { success: true, message: "Admin account created" };
    res.status(201).json(response);
});
exports.default = router;
//# sourceMappingURL=admin.js.map
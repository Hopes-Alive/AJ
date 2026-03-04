"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../lib/supabase");
const router = (0, express_1.Router)();
// GET /api/developer/status — public, checks if a developer account exists yet
router.get("/status", async (_req, res) => {
    const { data, error } = await supabase_1.supabaseAdmin.auth.admin.listUsers();
    if (error) {
        const response = { success: false, error: error.message };
        res.status(500).json(response);
        return;
    }
    const developerExists = data.users.some((u) => u.user_metadata?.is_developer === true);
    const response = {
        success: true,
        data: { registered: developerExists },
    };
    res.json(response);
});
// POST /api/developer/register — creates the developer account via service role
router.post("/register", async (req, res) => {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
        const response = {
            success: false,
            error: "email, password and fullName are required",
        };
        res.status(400).json(response);
        return;
    }
    const { data: existing } = await supabase_1.supabaseAdmin.auth.admin.listUsers();
    const developerAlreadyExists = existing?.users.some((u) => u.user_metadata?.is_developer === true);
    if (developerAlreadyExists) {
        const response = {
            success: false,
            error: "A developer account already exists",
        };
        res.status(409).json(response);
        return;
    }
    const { error } = await supabase_1.supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName, is_developer: true, is_admin: false },
    });
    if (error) {
        const response = { success: false, error: error.message };
        res.status(500).json(response);
        return;
    }
    const response = { success: true, message: "Developer account created" };
    res.status(201).json(response);
});
exports.default = router;
//# sourceMappingURL=developer.js.map
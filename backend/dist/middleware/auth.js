"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
const supabase_1 = require("../lib/supabase");
async function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Missing or invalid authorization header" });
        return;
    }
    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
        res.status(401).json({ success: false, error: "Invalid or expired token" });
        return;
    }
    if (!data.user.user_metadata?.is_admin) {
        res.status(403).json({ success: false, error: "Admin access required" });
        return;
    }
    req.userId = data.user.id;
    req.userEmail = data.user.email;
    next();
}
//# sourceMappingURL=auth.js.map
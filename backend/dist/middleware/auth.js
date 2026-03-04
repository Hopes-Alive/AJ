"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireStaff = requireStaff;
exports.requireDeveloper = requireDeveloper;
const supabase_1 = require("../lib/supabase");
async function authenticateToken(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ success: false, error: "Missing or invalid authorization header" });
        return null;
    }
    const token = authHeader.split(" ")[1];
    const { data, error } = await supabase_1.supabaseAdmin.auth.getUser(token);
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
async function requireAuth(req, res, next) {
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
async function requireStaff(req, res, next) {
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
async function requireDeveloper(req, res, next) {
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
//# sourceMappingURL=auth.js.map
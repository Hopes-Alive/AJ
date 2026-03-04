"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOrderNumber = generateOrderNumber;
const supabase_1 = require("./supabase");
async function generateOrderNumber() {
    const year = new Date().getFullYear();
    const prefix = `AJ-${year}-`;
    const { count } = await supabase_1.supabaseAdmin
        .from("orders")
        .select("*", { count: "exact", head: true })
        .like("order_number", `${prefix}%`);
    const sequence = ((count ?? 0) + 1).toString().padStart(4, "0");
    return `${prefix}${sequence}`;
}
//# sourceMappingURL=orderNumber.js.map
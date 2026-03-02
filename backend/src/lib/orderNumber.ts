import { supabaseAdmin } from "./supabase";

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `AJ-${year}-`;

  const { count } = await supabaseAdmin
    .from("orders")
    .select("*", { count: "exact", head: true })
    .like("order_number", `${prefix}%`);

  const sequence = ((count ?? 0) + 1).toString().padStart(4, "0");
  return `${prefix}${sequence}`;
}

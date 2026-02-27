import { createClient } from "@/lib/supabase/client";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

async function getAuthHeader(): Promise<Record<string, string>> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not authenticated");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
    "Content-Type": "application/json",
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  groupName: string;
  pack: string;
  price: string;           // display string e.g. "$24.00 + GST"
  customPrice: number;     // actual numeric price used for this order (editable)
  quantity: number;
  lineTotal: number;       // customPrice × quantity
}

export interface Order {
  id: string;
  order_number: string;
  order_name: string;
  user_id: string;
  status: "pending" | "in_progress" | "payment_pending" | "paid" | "closed" | "cancelled";
  items: OrderItem[];
  subtotal: number;
  notes: string | null;
  delivery_address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderPayload {
  order_name: string;
  items: OrderItem[];
  subtotal: number;
  notes?: string;
  delivery_address: string;
}

export async function getOrders(): Promise<Order[]> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/orders`, { headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to fetch orders");
  return json.data;
}

export async function getOrderById(id: string): Promise<Order> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/orders/${id}`, { headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Order not found");
  return json.data;
}

export async function lookupOrderByNumber(orderNumber: string): Promise<Order> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/orders/lookup/${encodeURIComponent(orderNumber)}`, { headers });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Order not found");
  return json.data;
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to create order");
  return json.data;
}

export async function cancelOrder(id: string): Promise<Order> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/orders/${id}/cancel`, {
    method: "PATCH",
    headers,
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to cancel order");
  return json.data;
}

export async function updateOrderStatus(
  id: string,
  status: Order["status"]
): Promise<Order> {
  const headers = await getAuthHeader();
  const res = await fetch(`${API_BASE}/api/orders/${id}/status`, {
    method: "PATCH",
    headers,
    body: JSON.stringify({ status }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || "Failed to update status");
  return json.data;
}

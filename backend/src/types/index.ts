export type OrderStatus =
  | "pending"
  | "in_progress"
  | "payment_pending"
  | "paid"
  | "closed"
  | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  groupName: string;
  pack: string;
  price: string;
  customPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  order_name: string;
  user_id: string;
  status: OrderStatus;
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
  status?: "payment_pending" | "paid";
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

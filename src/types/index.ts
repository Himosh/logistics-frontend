// Product types
export interface Product {
  id: number;
  name: string;
  price: number;
  stock_quantity: number;
}

export interface CreateProductPayload {
  name: string;
  price: number;
  stock_quantity: number;
}

export interface PaginatedResponse<T> {
  total: number;
  limit: number;
  offset: number;
  items: T[];
}

// Order types
export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  quantity_ordered: number;
  price_at_time_of_order: number;
}

export interface Order {
  id: number;
  status: "Pending" | "Shipped" | "Cancelled";
  created_at: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  items: { product_id: number; quantity: number }[];
}

export interface UpdateOrderStatusPayload {
  status: "Pending" | "Shipped" | "Cancelled";
}

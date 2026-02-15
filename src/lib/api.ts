import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import type {
  Product,
  CreateProductPayload,
  Order,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  PaginatedResponse,
} from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({ baseURL: API_BASE_URL });

function handleError(error: unknown, fallback: string): never {
  if (error instanceof AxiosError && error.response) {
    const detail = error.response.data?.detail;
    toast({
      title: "Error",
      description: detail || fallback,
      variant: "destructive",
    });
  } else {
    toast({ title: "Error", description: fallback, variant: "destructive" });
  }
  throw error;
}

// Products
export async function searchProducts(q: string, limit: number, offset: number) {
  try {
    const params: Record<string, string | number> = { limit, offset };
    if (q) {
      params.q = q;
    }
    const { data } = await api.get<PaginatedResponse<Product>>("/products/search", {
      params,
    });
    return data;
  } catch (e) {
    return handleError(e, "Failed to fetch products");
  }
}

export async function getProductsByName(name?: string) {
  try {
    const params: Record<string, string> = {};
    if (name) {
      params.name = name;
    }
    const { data } = await api.get<Product[]>("/products/by-name", { params });
    return data;
  } catch (e) {
    return handleError(e, "Failed to fetch products");
  }
}

export async function createProduct(payload: CreateProductPayload) {
  try {
    const { data } = await api.post<Product>("/products", payload);
    toast({ title: "Success", description: "Product created" });
    return data;
  } catch (e) {
    return handleError(e, "Failed to create product");
  }
}

// Orders
export async function searchOrders(params: {
  product_name?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  limit: number;
  offset: number;
}) {
  try {
    const { data } = await api.get<PaginatedResponse<Order>>("/orders/search", { params });
    return data;
  } catch (e) {
    return handleError(e, "Failed to fetch orders");
  }
}

export async function createOrder(payload: CreateOrderPayload) {
  try {
    const { data } = await api.post<Order>("/orders", payload);
    toast({ title: "Success", description: "Order created" });
    return data;
  } catch (e) {
    return handleError(e, "Failed to create order");
  }
}

export async function updateOrderStatus(orderId: number, payload: UpdateOrderStatusPayload) {
  try {
    const { data } = await api.patch<Order>(`/orders/${orderId}/status`, payload);
    toast({ title: "Success", description: "Order updated" });
    return data;
  } catch (e) {
    return handleError(e, "Failed to update order status");
  }
}

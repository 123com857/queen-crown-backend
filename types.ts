export interface Product {
  id: number;
  title: string;
  price: number;
  images: string[]; // JSON string in DB, parsed to array
  stock: number;
  category: string;
  // Intentionally omitting cost_1688 and supplier_link for security
}

export interface CartItem extends Product {
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'pending', // Waiting for payment verification
  PAID = 'paid',       // Payment confirmed
  SHIPPED = 'shipped', // Tracking added
  COMPLETED = 'completed'
}

export interface Order {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  items?: string; // JSON string of items
}

export interface AdminUser {
  username: string;
  token: string;
}
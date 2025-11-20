import { Product, Order, AdminUser } from '../types';

// In production, this comes from environment variables
const API_URL = 'http://localhost:3000/api';

export const api = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (e) {
      console.error(e);
      return []; 
    }
  },

  getProduct: async (id: number): Promise<Product | null> => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (e) {
      return null;
    }
  },

  createOrder: async (orderData: any): Promise<{ orderId: number; paymentInfo: any }> => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    if (!res.ok) throw new Error('Order failed');
    return await res.json();
  },

  adminLogin: async (password: string): Promise<AdminUser | null> => {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password }),
    });
    if (!res.ok) return null;
    return await res.json();
  },

  getOrders: async (token: string): Promise<Order[]> => {
    const res = await fetch(`${API_URL}/admin/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return await res.json();
  },

  updateOrder: async (id: number, status: string, token: string): Promise<void> => {
    await fetch(`${API_URL}/admin/orders/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status }),
    });
  }
};
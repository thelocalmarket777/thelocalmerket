
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  rating?: string;
  imageUrl: string;
  media?: ProductMedia[];
}

export interface ProductMedia {
  id: number;
  product_id: number;
  file: string;
  file_type: 'image' | 'video' | 'document' | 'audio';
  description?: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  address?: string;
  phone_number?: string;
  created_at?: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_method: string;
  delivery_address: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimated_days: string;
}

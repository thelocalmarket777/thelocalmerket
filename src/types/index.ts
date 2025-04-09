
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'inactive';
  rating?: string;
  imageUrl: string;
  media?: ProductMedia[];
  author?: string;
  created_at?: string;
  genre?: string;
}

export interface ProductMedia {
  id: string;
  product_id: string;
  file: string;
  file_type: 'image' | 'video' | 'document' | 'audio';
  description?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  address?: string;
  phone_number?: string;
  created_at?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  category:string;
  name:string
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_method: string;
  delivery_address: string;
  created_at: string;
  order_items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
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


export interface FormData {
  name: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  deliveryMethod: string;
  notes: string;
  items?: Product;

}

import { LucideIcon } from 'lucide-react';

export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  estimated_days: string;
  price: number;
  icon: LucideIcon;
  priority?: 'high' | 'medium' | 'low';
}

export interface CheckoutFormData {
  address: string;
  city: string;
  zipCode: string;
  phone: string;
  deliveryMethod: string;
  paymentMethod: 'cash' | 'esewa' | 'khalti';
  notes: string;
}

export interface OrderData {
  user_id: string;
  items: OrderItem[];
  shipping_address: string;
  delivery_method: string;
  subtotal: number;
  shipping_cost: number;
  total_amount: number;
  payment_method: string;
  receiverContact: string;
  notes?: string;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  category: string;
  name: string;
}

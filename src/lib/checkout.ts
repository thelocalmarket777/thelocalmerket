import { CartItem, DeliveryMethod } from '@/types';
import { MapPin, Clock, Truck } from 'lucide-react';

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: 'pickup',
    name: 'Store Pickup',
    description: 'Pick up from our store',
    estimated_days: 'Same day',
    price: 0,
    icon: MapPin
  },
  {
    id: 'express',
    name: 'Express Delivery',
    description: 'Within hours',
    estimated_days: '2-4 hours',
    price: 200,
    icon: Clock,
    priority: 'high'
  },
  {
    id: 'standard',
    name: 'Standard Delivery',
    description: 'Normal delivery',
    estimated_days: '1-3 days',
    price: 80,
    icon: Truck
  }
];

interface AmountCalculationProps {
  items: CartItem[];
  deliveryMethod?: string;
}

export const calculateOrderAmounts = ({ items, deliveryMethod }: AmountCalculationProps) => {
  const subtotal = items.reduce((total, item) => 
    total + ((item.product.finalprice || item.product.price) * item.quantity), 0);
  
  const shipping = deliveryMethods.find(m => m.id === deliveryMethod)?.price || 0;
  
  return {
    subtotal,
    shipping,
    total: subtotal + shipping
  };
};

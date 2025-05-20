export interface ProductMedia {
  id: string;
  file: string;
  file_type: 'image' | 'video';
  description?: string;
}


export interface Review {
  id: string;
  rating: number;
  comment: string;
  user: string;
  created_at: string;
  likes: number;
  likedBy: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  finalprice?: number;
  discount?: number;
  stock: number;
  rating: number;
  image_url?: string;
  author?: string;
  genre?: string;
  totalpage?: number;
  language?: string;
  madeinwhere?: string;
  ageproduct?: string;
  isNew?: boolean;
  media?: ProductMedia[];
  reviews: Review[];
  image?: string;
  is_wishlisted?: boolean;
  
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
  category: string;
  name: string;
  image?: string;
  price: number;
  finalprice?: number;
  discount?: number;
  author?: string;
  genre?: string;
  totalpage?: number;
  language?: string;
  madeinwhere?: string;

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
  product_name: string;
  product_image: string;
  category: string;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  id: string;
  user_id: string;
  order_items: OrderItem[];
  total_amount: number;
  subtotal: number;
  shipping_cost: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  delivery_method: string;
  payment_method: string;
  shipping_address: string;
  notes?: string;
  created_at: string;
  product_img?: string;
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

export interface BusinnessConnectionRequest {
  sellerType: 'manufacturer' | 'individual' | '';
  companyName: string;
  panNumber: string;
  productName: string;
  productDescription: string;
  productCategory: string;
  cost: string;
  suggestedRetailPrice: string;
  commissionRate: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  termsAccepted: boolean;
}

export interface OrderState {
  orders: OrderDetails[];
  isLoading: boolean;
  error: string | null;
  expandedOrders: Record<string, boolean>;
}

export interface DirectCheckoutState {
  product: Product;
  quantity: number;
  isDirect: boolean;
}



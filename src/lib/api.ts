
import { Product, User, Order, DeliveryMethod, CartItem } from "@/types";

// Mock data for products
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Modern Minimalist Chair",
    description: "A sleek, comfortable chair perfect for any modern living space. Crafted with sustainable materials and designed for maximum comfort.",
    price: 149.99,
    category: "furniture",
    stock: 15,
    status: "active",
    rating: "4",
    imageUrl: "https://images.unsplash.com/photo-1592078615290-033ee584e267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: 2,
    name: "Premium Coffee Maker",
    description: "Start your day right with this premium coffee maker. Features programmable settings and a sleek design that complements any kitchen.",
    price: 89.99,
    category: "kitchen",
    stock: 25,
    status: "active",
    rating: "5",
    imageUrl: "https://images.unsplash.com/photo-1595246007497-68750bd1964a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: 3,
    name: "Smart Home Speaker",
    description: "This intelligent home speaker combines premium sound quality with voice assistant capabilities. Control your music, get information, and manage your smart home devices with simple voice commands.",
    price: 129.99,
    category: "electronics",
    stock: 18,
    status: "active",
    rating: "4",
    imageUrl: "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: 4,
    name: "Organic Cotton Bedding Set",
    description: "Transform your bedroom with this luxurious organic cotton bedding set. Includes duvet cover, flat sheet, fitted sheet, and two pillowcases.",
    price: 199.99,
    category: "home",
    stock: 10,
    status: "active",
    rating: "5",
    imageUrl: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: 5,
    name: "Wireless Noise-Cancelling Headphones",
    description: "Immerse yourself in your favorite music with these premium wireless noise-cancelling headphones. Features 30 hours of battery life and superior sound quality.",
    price: 249.99,
    category: "electronics",
    stock: 12,
    status: "active",
    rating: "4",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: 6,
    name: "Stainless Steel Water Bottle",
    description: "Stay hydrated in style with this durable stainless steel water bottle. Keeps drinks cold for 24 hours or hot for 12 hours.",
    price: 29.99,
    category: "accessories",
    stock: 30,
    status: "active",
    rating: "5",
    imageUrl: "https://images.unsplash.com/photo-1585080384025-9e15388f4b1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: 7,
    name: "Ceramic Plant Pot Set",
    description: "Add a touch of elegance to your indoor plants with this set of three ceramic plant pots in various sizes. Modern design with drainage holes.",
    price: 49.99,
    category: "home",
    stock: 20,
    status: "active",
    rating: "4",
    imageUrl: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  },
  {
    id: 8,
    name: "Bamboo Kitchen Utensil Set",
    description: "This eco-friendly bamboo kitchen utensil set includes all the essential tools for cooking. Durable, non-toxic, and beautifully crafted.",
    price: 39.99,
    category: "kitchen",
    stock: 22,
    status: "active",
    rating: "5",
    imageUrl: "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1160&q=80",
  }
];

// Mock delivery methods
const mockDeliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    name: "Standard Delivery",
    description: "Delivery within 3-5 business days",
    price: 4.99,
    estimated_days: "3-5 business days"
  },
  {
    id: "express",
    name: "Express Delivery",
    description: "Delivery within 1-2 business days",
    price: 9.99,
    estimated_days: "1-2 business days"
  },
  {
    id: "next_day",
    name: "Next Day Delivery",
    description: "Delivery the next business day",
    price: 14.99,
    estimated_days: "Next business day"
  }
];

// Local storage keys
const CART_STORAGE_KEY = "nexus_shop_cart";
const USER_STORAGE_KEY = "nexus_shop_user";
const ORDERS_STORAGE_KEY = "nexus_shop_orders";

// Helper to get cart from local storage
const getStoredCart = (): CartItem[] => {
  const storedCart = localStorage.getItem(CART_STORAGE_KEY);
  return storedCart ? JSON.parse(storedCart) : [];
};

// Helper to save cart to local storage
const saveCart = (cart: CartItem[]) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

// Helper to get orders from local storage
const getStoredOrders = (): Order[] => {
  const storedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
  return storedOrders ? JSON.parse(storedOrders) : [];
};

// Helper to save orders to local storage
const saveOrders = (orders: Order[]) => {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
};

// Mock API functions
export const api = {
  products: {
    getAll: async (): Promise<Product[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProducts;
    },
    getById: async (id: number): Promise<Product | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProducts.find(product => product.id === id);
    },
    getByCategory: async (category: string): Promise<Product[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockProducts.filter(product => product.category === category);
    }
  },
  
  delivery: {
    getMethods: async (): Promise<DeliveryMethod[]> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockDeliveryMethods;
    }
  },
  
  auth: {
    getCurrentUser: (): User | null => {
      const userString = localStorage.getItem(USER_STORAGE_KEY);
      return userString ? JSON.parse(userString) : null;
    },
    
    login: async (email: string, password: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, simply validate that something was entered
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      
      // Mock successful login
      const user: User = {
        id: 1,
        email,
        name: email.split("@")[0],
        address: "123 Main St, Anytown, USA",
        phone_number: "555-123-4567",
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    },
    
    register: async (email: string, password: string, name: string): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple validation
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }
      
      // Mock successful registration
      const user: User = {
        id: Date.now(),
        email,
        name,
        created_at: new Date().toISOString()
      };
      
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      return user;
    },
    
    logout: () => {
      localStorage.removeItem(USER_STORAGE_KEY);
    },
    
    updateProfile: async (userData: Partial<User>): Promise<User> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const currentUser = api.auth.getCurrentUser();
      if (!currentUser) {
        throw new Error("No user logged in");
      }
      
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    }
  },
  
  cart: {
    getItems: (): CartItem[] => {
      return getStoredCart();
    },
    
    addItem: (productId: number, quantity: number = 1): CartItem[] => {
      const cart = getStoredCart();
      const product = mockProducts.find(p => p.id === productId);
      
      if (!product) {
        throw new Error("Product not found");
      }
      
      // Check if product already in cart
      const existingItemIndex = cart.findIndex(item => item.product.id === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if already in cart
        cart[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        cart.push({
          id: Date.now(),
          product,
          quantity
        });
      }
      
      saveCart(cart);
      return cart;
    },
    
    updateQuantity: (itemId: number, quantity: number): CartItem[] => {
      if (quantity <= 0) {
        return api.cart.removeItem(itemId);
      }
      
      const cart = getStoredCart();
      const itemIndex = cart.findIndex(item => item.id === itemId);
      
      if (itemIndex === -1) {
        throw new Error("Item not found in cart");
      }
      
      cart[itemIndex].quantity = quantity;
      saveCart(cart);
      return cart;
    },
    
    removeItem: (itemId: number): CartItem[] => {
      const cart = getStoredCart();
      const updatedCart = cart.filter(item => item.id !== itemId);
      saveCart(updatedCart);
      return updatedCart;
    },
    
    clearCart: (): CartItem[] => {
      saveCart([]);
      return [];
    }
  },
  
  orders: {
    getAll: async (): Promise<Order[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const currentUser = api.auth.getCurrentUser();
      
      if (!currentUser) {
        return [];
      }
      
      const allOrders = getStoredOrders();
      return allOrders.filter(order => order.user_id === currentUser.id);
    },
    
    getById: async (orderId: number): Promise<Order | undefined> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const orders = getStoredOrders();
      return orders.find(order => order.id === orderId);
    },
    
    create: async (deliveryMethod: string, deliveryAddress: string): Promise<Order> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const currentUser = api.auth.getCurrentUser();
      if (!currentUser) {
        throw new Error("User must be logged in to create an order");
      }
      
      const cart = getStoredCart();
      if (cart.length === 0) {
        throw new Error("Cart is empty");
      }
      
      // Calculate total
      const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      
      // Get delivery cost
      const selectedMethod = mockDeliveryMethods.find(method => method.id === deliveryMethod);
      const deliveryCost = selectedMethod ? selectedMethod.price : 0;
      
      // Create order items
      const orderItems = cart.map(item => ({
        id: Date.now() + Math.floor(Math.random() * 1000),
        order_id: 0, // Will be set below
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      // Create new order
      const newOrder: Order = {
        id: Date.now(),
        user_id: currentUser.id,
        items: orderItems,
        total: total + deliveryCost,
        status: "pending",
        delivery_method: deliveryMethod,
        delivery_address: deliveryAddress,
        created_at: new Date().toISOString()
      };
      
      // Update order_id for items
      newOrder.items.forEach(item => {
        item.order_id = newOrder.id;
      });
      
      // Save to "database"
      const orders = getStoredOrders();
      orders.push(newOrder);
      saveOrders(orders);
      
      // Clear the cart
      api.cart.clearCart();
      
      return newOrder;
    }
  }
};

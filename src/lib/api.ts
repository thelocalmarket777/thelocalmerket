
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
 export const mockDeliveryMethods: DeliveryMethod[] = [
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



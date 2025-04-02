import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CartItem, Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Calculate derived values
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const addItem = (product: Product, quantity = 1) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.product.id === product.id);
      let updatedCart;
      
      if (existingItemIndex >= 0) {
        updatedCart = [...prevItems];
        updatedCart[existingItemIndex].quantity += quantity;
      } else {
        updatedCart = [...prevItems, { id: Date.now(), product, quantity }];
      }
      
      toast({
        title: 'Item Added',
        description: 'Item has been added to your cart',
      });
      return updatedCart;
    });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const removeItem = (itemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({
      title: 'Item Removed',
      description: 'Item has been removed from your cart',
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      isLoading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      itemCount,
      subtotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

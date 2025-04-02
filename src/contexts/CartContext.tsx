
import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CartItem } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (productId: number, quantity?: number) => void;
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
    const loadCart = () => {
      try {
        const cartItems = api.cart.getItems();
        setItems(cartItems);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const addItem = (productId: number, quantity = 1) => {
    try {
      const updatedCart = api.cart.addItem(productId, quantity);
      setItems(updatedCart);
      toast({
        title: 'Item Added',
        description: 'Item has been added to your cart',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add item to cart';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    try {
      const updatedCart = api.cart.updateQuantity(itemId, quantity);
      setItems(updatedCart);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cart';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  const removeItem = (itemId: number) => {
    try {
      const updatedCart = api.cart.removeItem(itemId);
      setItems(updatedCart);
      toast({
        title: 'Item Removed',
        description: 'Item has been removed from your cart',
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove item from cart';
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
    }
  };

  const clearCart = () => {
    try {
      const emptyCart = api.cart.clearCart();
      setItems(emptyCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
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
      subtotal
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

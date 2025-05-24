import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

import { CartItem, Product } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  buynowCartfunc: (product: Product, quantity?: number) => void;
  clearbuynowCart: () => void;
  buynowcart: CartItem[];
  buynowquantity?: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('itemcart') || '[]')
    } catch {
      return []
    }
  });
  const [buynowcart, setbuynowcart] = useState<CartItem[]>(()=>{
    const buynowcart = localStorage.getItem('buynowcart');
    if (buynowcart) {
      return JSON.parse(buynowcart);
    } else {
      return [];
    }
  });
const [buynowquantity, setbuynowquantity] = useState<number>(() => {
  try {
    return Number(localStorage.getItem('buynowquantity')) || 1;
  } catch {
    return 1;
  }
});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  const memoizedValues = useMemo(() => ({
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
    subtotal: items.reduce((total, item) => total + (item.product.finalprice * item.quantity), 0),
  }), [items]);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { id: Date.now(), product, quantity }];
    });
  }, []);

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    ));
  };

  const removeItem = (itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    toast({
      title: 'Item Removed',
      description: 'Item has been removed from your cart',
    });
  };

  const clearCart = () => {
    setItems([]);
  };
  const buynowCartfunc = (product,quantity) => {
    localStorage.setItem('buynowcart', JSON.stringify(product));
      localStorage.setItem('buynowquantity', String(quantity));
console.log('quantity', quantity);
    setbuynowcart(product);
    setbuynowquantity(quantity);
  };
  const clearbuynowCart = () => {
     localStorage.removeItem('buynowquantity');
    localStorage.removeItem('buynowcart');
    setbuynowcart([]);
    setbuynowquantity(1);
     
  };



  const cartValue = useMemo(() => ({
    items,
    ...memoizedValues,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    buynowCartfunc,
    buynowcart,
    clearbuynowCart,
    buynowquantity,
  }), [items, memoizedValues, addItem,buynowquantity, buynowcart, clearbuynowCart ]);

  return <CartContext.Provider value={cartValue}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CategoryPage from "./pages/CategoryPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import ProfilePage from "./pages/ProfilePage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import OrderPurchase from './pages/OrderPurchase';
import Wishlist from './pages/Wishlist';
import NotificationPage from './pages/Notificationpage';
import ProductSubmissionForm from './pages/RequestForProductSell';
import CategoriesPage from './pages/CategoriesPage';
import LocalProductShowcase from './pages/LocalProductShowcase';
import BuyNowCheckoutPage from '@/pages/BuyNowCheckoutPage';
import { useFcmToken } from './hooks/useFcmToken';

const queryClient = new QueryClient();

const App = () => {


  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
        
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/category/:category" element={<CategoryPage />} />
                <Route path="/all" element={<CategoryPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/checkout/buy-now" element={<BuyNowCheckoutPage />} />
                <Route path="/order-confirmation/" element={<OrderConfirmationPage />} />
                <Route path="/orderConfirmation/:id" element={<OrderPurchase  />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/notification" element={<NotificationPage />} />
                <Route path="/RequestForProductSell" element={<ProductSubmissionForm />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/local-showcase/:category" element={<LocalProductShowcase />} />
            
              
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

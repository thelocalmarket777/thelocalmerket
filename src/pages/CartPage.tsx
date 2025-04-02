
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-brand-blue flex items-center"
          >
            <ArrowLeft size={16} className="mr-1" />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="hidden sm:grid sm:grid-cols-12 bg-gray-50 p-4 text-sm font-medium text-gray-500">
                  <div className="sm:col-span-6">Product</div>
                  <div className="sm:col-span-2 text-center">Price</div>
                  <div className="sm:col-span-2 text-center">Quantity</div>
                  <div className="sm:col-span-2 text-center">Total</div>
                </div>

                {items.map((item) => (
                  <div 
                    key={item.id} 
                    className="grid sm:grid-cols-12 gap-4 p-4 border-t border-gray-200 first:border-t-0 items-center"
                  >
                    {/* Product */}
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <Link to={`/product/${item.product.id}`} className="shrink-0">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/product/${item.product.id}`}
                          className="text-gray-900 font-medium hover:text-brand-blue"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          Category: {item.product.category}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="sm:col-span-2 text-center">
                      <div className="sm:hidden text-sm text-gray-500">Price:</div>
                      <div>${item.product.price.toFixed(2)}</div>
                    </div>

                    {/* Quantity */}
                    <div className="sm:col-span-2">
                      <div className="sm:hidden text-sm text-gray-500 mb-1">Quantity:</div>
                      <div className="flex items-center justify-center">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Minus size={16} />
                        </button>
                        <input 
                          type="text" 
                          value={item.quantity}
                          readOnly
                          className="w-10 h-8 border-t border-b border-gray-300 text-center"
                        />
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="sm:col-span-2 text-center flex items-center justify-between sm:justify-center gap-4">
                      <div>
                        <div className="sm:hidden text-sm text-gray-500">Total:</div>
                        <div className="font-medium">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600">Calculated at checkout</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-semibold">Estimated Total</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleProceedToCheckout}
                  className="w-full gap-2"
                  size="lg"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CartPage;

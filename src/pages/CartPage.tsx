import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();

  const navigate = useNavigate();
  const itemlocal=localStorage.setItem('itemcart',JSON.stringify(items))

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    if (user) {
      navigate('/checkout');
    } else {
      navigate('/login', { state: { from: '/checkout' } });
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-brand-blue flex items-center transition-colors duration-200"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continue Shopping
          </Link>
          
          <Badge variant="outline" className="px-3 py-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
          </Badge>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="pb-3">
                  <div className="hidden sm:grid sm:grid-cols-12 text-sm font-medium text-gray-500">
                    <div className="sm:col-span-6">Product</div>
                    <div className="sm:col-span-2 text-center">Price</div>
                    <div className="sm:col-span-2 text-center">Quantity</div>
                    <div className="sm:col-span-2 text-center">Total</div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  {items.map((item) => (
                    <div key={item.id}>
                      <div className="grid sm:grid-cols-12 gap-4 py-4 items-center">
                        {/* Product */}
                        <div className="sm:col-span-6 flex items-center gap-4">
                          <Link to={`/product/${item.product.id}`} className="shrink-0 relative">
                            {item.product && item.product.media && item.product.media.length > 0 ? (
                              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                <img
                                  src={item.product.media[0].file}
                                  alt={item.product.media[0].description || item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                <img 
                                  src={item.product.imageUrl} 
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/product/${item.product.id}`}
                              className="text-gray-900 font-medium hover:text-brand-blue line-clamp-2"
                            >
                              {item.product.name}
                            </Link>
                            <Badge variant="outline" className="mt-2 text-xs font-normal">
                              {item.product.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="sm:col-span-2 text-center">
                          <div className="sm:hidden text-sm text-gray-500">Price:</div>
                          <div className="font-medium">NPR&nbsp;{parseFloat(item.product.price).toFixed(2)}</div>
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-2">
                          <div className="sm:hidden text-sm text-gray-500 mb-1">Quantity:</div>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-12 h-8 border-t border-b border-gray-300 text-center text-sm"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          {item.product.stock <= 5 && (
                            <div className="text-xs text-amber-600 mt-1 text-center">
                              Only {item.product.stock} left
                            </div>
                          )}
                        </div>

                        {/* Total */}
                        <div className="sm:col-span-2 text-center flex items-center justify-between sm:justify-center gap-4">
                          <div>
                            <div className="sm:hidden text-sm text-gray-500">Total:</div>
                            <div className="font-medium">
                            NPR&nbsp;{(item.product.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </div>
                      <Separator className="last:hidden" />
                    </div>
                  ))}
                </CardContent>
              </Card>
              
   
              {/* {items.length > 0 && items[0].product && items[0].product.media && items[0].product.media.length > 1 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Product Gallery</h3>
                  <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
                    <CarouselContent>
                      {items[0].product.media.map((media, index) => (
                        <CarouselItem key={index} className="basis-1/3 md:basis-1/4">
                          {media.file_type === 'image' && (
                            <div className="p-1">
                              <img
                                src={media.file}
                                alt={media.description || items[0].product.name}
                                className="w-full aspect-square object-cover rounded-md"
                              />
                            </div>
                          )}
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </Carousel>
                </div>
              )} */}
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">NPR &nbsp; {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600 text-sm">Calculated at checkout</span>
                  </div>
                  {/* Optional promo code input could go here */}
                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold">Estimated Total</span>
                    <span className="font-semibold text-lg">NPR &nbsp;{subtotal.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full gap-2"
                    size="lg"
                  >
                    Proceed to Checkout
                    <ArrowRight size={16} />
                  </Button>
                  <div className="text-xs text-center text-gray-500">
                    Taxes may apply based on your location
                  </div>
                </CardFooter>
              </Card>
              
              {/* Recommended Products or Shipping Info */}
              <Card className="mt-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Secure Checkout</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-gray-500 space-y-2">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                      </svg>
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
                        <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 005.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                        <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                      </svg>
                      <span>Fast delivery options available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                        <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M12.75 6.75a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V6.75z" clipRule="evenodd" />
                      </svg>
                      <span>Easy returns within 30 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild size="lg">
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
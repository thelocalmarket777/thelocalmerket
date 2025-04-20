import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash, ArrowLeft, ArrowRight, ShoppingBag, Tag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const CartPage = () => {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart();
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState(null);
  const navigate = useNavigate();

  // Save cart items to local storage
  React.useEffect(() => {
    localStorage.setItem('itemcart', JSON.stringify(items));
  }, [items]);

  // Calculate discount and total
  const { discount, total } = useMemo(() => {
    let discountAmount = 0

    // Apply discount if promo is active
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        discountAmount = subtotal * (appliedPromo.value / 100);
      } else if (appliedPromo.type === 'fixed') {
        discountAmount = appliedPromo.value;
      }

      // Cap discount at subtotal value
      discountAmount = Math.min(discountAmount, subtotal);
    }

    return {
      discount: discountAmount,
      total: subtotal - discountAmount
    };
  }, [subtotal, appliedPromo]);

  const handlePromoApply = () => {
    // Mock promo codes for demonstration
    const promoCodes = {
      'SAVE10': { type: 'percentage', value: 10, name: '10% Discount' },
      'SAVE20': { type: 'percentage', value: 20, name: '20% Discount' },
      'FLAT500': { type: 'fixed', value: 500, name: 'NPR 500 Off' }
    };

    if (!promoCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a promo code",
        variant: "destructive"
      });
      return;
    }

    const foundPromo = promoCodes[promoCode.toUpperCase()];
    if (foundPromo) {
      setAppliedPromo(foundPromo);
      toast({
        title: "Success!",
        description: `Promo code "${promoCode.toUpperCase()}" applied successfully`,
        variant: "default"
      });
    } else {
      toast({
        title: "Invalid Code",
        description: "This promo code is invalid or expired",
        variant: "destructive"
      });
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast({
      title: "Removed",
      description: "Promo code has been removed",
      variant: "default"
    });
  };

  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Save discount info to local storage if applicable
    if (appliedPromo) {
      localStorage.setItem('appliedDiscount', JSON.stringify({
        code: promoCode.toUpperCase(),
        amount: discount,
        ...appliedPromo
      }));
    } else {
      localStorage.removeItem('appliedDiscount');
    }

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
              <Card className="shadow-sm">
                <CardHeader className="pb-3 bg-gray-50">
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
                              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200 relative group">
                                <img
                                  src={item.product.media[0].file}
                                  alt={item.product.media[0].description || item.product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                            ) : (
                              <div className="w-24 h-24 rounded-md overflow-hidden bg-gray-100 border border-gray-200 relative group">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className="text-xs font-normal">
                                {item.product.category}
                              </Badge>
                              {item.product.discount > 0 && (
                                <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  {item.product.discount}% OFF
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="sm:col-span-2 text-center">
                          <div className="sm:hidden text-sm text-gray-500">Price:</div>
                          <div className="font-medium">
                            <div className='flex flex-col'>
                              <span className="text-gray-400 line-through text-sm mr-2">
                                NPR {parseFloat(item.product.price).toFixed(2)}
                              </span>
                              <span className="text-brand-blue">
                                NPR {parseFloat(item.product.finalprice).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="sm:col-span-2">
                          <div className="sm:hidden text-sm text-gray-500 mb-1">Quantity:</div>
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <input
                              type="text"
                              value={item.quantity}
                              readOnly
                              className="w-12 h-8 border-t border-b border-gray-300 text-center text-sm"
                              aria-label="Product quantity"
                            />
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                              aria-label="Increase quantity"
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
                              NPR {(item.product.finalprice * item.quantity).toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
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

              {/* Product Gallery - Optional Section */}
              {items.length > 0 && items[0].product && items[0].product.media && items[0].product.media.length > 1 && (
                <Card className="mt-6 shadow-sm overflow-hidden">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Product Gallery</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Carousel className="w-full" opts={{ loop: true, align: "start" }}>
                      <CarouselContent>
                        {items[0].product.media.map((media, index) => (
                          <CarouselItem key={index} className="basis-1/3 md:basis-1/4">
                            {media.file_type === 'image' && (
                              <div className="p-1">
                                <img
                                  src={media.file}
                                  alt={media.description || items[0].product.name}
                                  className="w-full aspect-square object-cover rounded-md hover:opacity-90 transition-opacity cursor-pointer"
                                />
                              </div>
                            )}
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="lg:col-span-1 space-y-6">
              {/* Promo Code Section */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag size={18} className="text-brand-blue" />
                    Promo Code
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!appliedPromo ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={handlePromoApply}
                        variant="outline"
                        size="sm"
                      >
                        Apply
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-100 rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-green-700 font-medium flex items-center gap-1">
                            <Tag size={14} />
                            {promoCode.toUpperCase()}
                          </div>
                          <div className="text-green-600 text-sm">{appliedPromo.name}</div>
                        </div>
                        <Button
                          onClick={handleRemovePromo}
                          variant="ghost"
                          size="sm"
                          className="h-8 text-gray-500 hover:text-red-500"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card className="shadow-sm">
                <CardHeader className="border-b">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">NPR {subtotal.toFixed(2)}</span>
                  </div>

                  {appliedPromo && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="flex items-center gap-1">
                        <Tag size={14} />
                        Discount ({appliedPromo.name})
                      </span>
                      <span className="font-medium">- NPR {discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600 text-sm">Calculated at checkout</span>
                  </div>

                  <Separator />
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold">Estimated Total</span>
                    <span className="font-semibold text-lg">NPR {total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    onClick={handleProceedToCheckout}
                    className="w-full gap-2 bg-brand-blue hover:bg-brand-blue-dark"
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

              {/* Trust Indicators */}
              <Card className="shadow-sm border-t-4 border-t-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Why Shop With Us</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-sm text-gray-500 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                          <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Secure payment processing</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
                          <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 005.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                          <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                        </svg>
                      </div>
                      <span>Fast delivery options available</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-600">
                          <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6z" clipRule="evenodd" />
                          <path fillRule="evenodd" d="M12.75 6.75a.75.75 0 00-1.5 0v8.25a.75.75 0 001.5 0V6.75z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span>Easy returns within 30 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <div className="max-w-md mx-auto">
              <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild size="lg" className="bg-brand-blue hover:bg-brand-blue-dark">
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
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle2, Loader2, Clock, MapPin, Truck, Contact, Info } from 'lucide-react';
import { DeliveryMethod, FormData } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { mockDeliveryMethods } from '@/lib/api';
import RemoteServices from '@/RemoteService/Remoteservice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const deliveryMethods = useMemo(() => [
    {
      id: 'pickup',
      name: 'I will pick up',
      description: 'Pick up your order from our store',
      estimated_days: 'Same day',
      price: 0,
      icon: MapPin
    },
    {
      id: 'urgent',
      name: 'Urgent Delivery',
      description: 'Express delivery within hours',
      estimated_days: 'Same day (2-4 hours)',
      price: 200,
      icon: Clock,
      priority: 'high'
    },
    {
      id: 'normal',
      name: 'Normal Delivery',
      description: 'Standard delivery service',
      estimated_days: '1-3 days',
      price: 80,
      icon: Truck
    }
  ], []);

  const [formData, setFormData] = useState<FormData>(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      address: user?.address || '',
      city: user?.city || '',
      zipCode: user?.zip_code || '',
      phone: user?.phone_number || '',
      deliveryMethod: deliveryMethods[0]?.id || '',
      notes: '',
      paymentMethod: 'cash',
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const currencySymbol= 'Rs.';
      const { user, token } = useMemo(() => ({
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || '{}')
      }), []);
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }



    if (!user || !token) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    setIsLoading(false);
  }, [items.length, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when field is modified
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDeliveryMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
    if (formErrors.deliveryMethod) {
      setFormErrors(prev => ({ ...prev, deliveryMethod: '' }));
    }
  };

  const handlePaymentMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, paymentMethod: value }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Different validation based on delivery method
    const isPickup = formData.deliveryMethod === 'pickup';
    
    // Only validate address fields if not pickup
    if (!isPickup) {
      if (!formData.address) errors.address = 'Street Address is required';
      if (!formData.city) errors.city = 'City is required';
      if (!formData.zipCode) errors.zipCode = 'Zip Code is required';
    }
    
    // Always validate these fields
    if (!formData.phone) errors.phone = 'Phone Number is required';
    if (!formData.deliveryMethod) errors.deliveryMethod = 'Delivery Method is required';

    // Phone validation
    if (formData.phone && !/^[0-9+\- ]{10,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const selectedDeliveryMethod = deliveryMethods.find(
    method => method.id === formData.deliveryMethod
  );

  
  const calculatedTotal = subtotal + (selectedDeliveryMethod?.price || 0);
  
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to complete your purchase',
      });
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Validate form
    if (!validateForm()) {
      toast({
        variant: 'destructive',
        title: 'Missing or Invalid Information',
        description: 'Please correct the highlighted fields',
      });
      // Scroll to the first error
      const firstErrorField = document.querySelector('[aria-invalid="true"]');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsPlacingOrder(true);
    const calculatedSubtotal = subtotal; // The original cart subtotal

    const shippingCost = selectedDeliveryMethod?.price || 0;
    const calculatedTotal = calculatedSubtotal + shippingCost;
    const orderData = {
      user_id: user.id,
      items: items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        category: item.product.category,
        name: item.product.name
      })),
      shipping_address: formData.deliveryMethod === 'pickup' 
        ? 'Store Pickup' 
        : `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      delivery_method: formData.deliveryMethod,
      subtotal: subtotal , // Fixed: using promoDiscount instead of undefined variable
      shipping_cost: selectedDeliveryMethod?.price || 0,
      total_amount: calculatedTotal,
      payment_method: formData.paymentMethod,
      receiverContact: formData.phone,
      notes:formData.notes
    };

    // Place the order
    try {
      const res = await RemoteServices.orderPlaced(orderData);
      const order = res.data;
      
      await Promise.all([
        clearCart(),
        localStorage.removeItem('itemcart'),
        localStorage.setItem('orderconform', JSON.stringify(order))
      ]);

      toast({
        title: 'Order Placed Successfully',
        description: `Your order #${order.id} has been confirmed`,
      });

      navigate(`/order-confirmation/`, { state: { oderconform: order } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your order';

      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: errorMessage,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  }, [formData, items, clearCart, navigate, toast]);

  // Get the badge color based on priority
  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    
    switch(priority) {
      case 'high':
        return <Badge className="ml-2 bg-red-500">Express</Badge>;
      default:
        return null;
    }
  };

  const getDeliveryIcon = (icon) => {
    const Icon = icon || Truck;
    return <Icon className="h-5 w-5 mr-3 text-gray-600" />;
  };


  const isAddressDisabled = formData.deliveryMethod === 'pickup';

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        {items.length === 0 ? (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your cart is empty. Please add items before proceeding to checkout.
            </AlertDescription>
          </Alert>
        ) : null}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
            <div className="lg:col-span-2 space-y-6">
             {/* Delivery Method */}
             <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Delivery Method</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, index) => (
                        <div key={index} className="h-16 bg-gray-100 rounded"></div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <RadioGroup
                        value={formData.deliveryMethod}
                        onValueChange={handleDeliveryMethodChange}
                        className="space-y-4"
                      >
                        {deliveryMethods.map((method) => (
                          <div
                            key={method.id}
                            className={`flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                              method.priority === 'high' ? 'border-red-200 bg-red-50 hover:bg-red-100' : 
                              method.id === 'pickup' ? 'border-green-200 bg-green-50 hover:bg-green-100' : 
                              formData.deliveryMethod === method.id ? 'bg-blue-50 border-blue-500' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={method.id} id={method.id} />
                              <div className="flex items-center">
                                {getDeliveryIcon(method.icon)}
                                <div>
                                  <div className="flex items-center">
                                    <Label
                                      htmlFor={method.id}
                                      className="font-medium cursor-pointer"
                                    >
                                      {method.name}
                                    </Label>
                                    {getPriorityBadge(method.priority)}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {method.description} ({method.estimated_days})
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="font-medium">
                              {method.price > 0 ? `${currencySymbol} ${method.price.toFixed(2)}` : 'Free'}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                      {formErrors.deliveryMethod && (
                        <p id="deliveryMethod-error" className="text-sm text-red-500 mt-2">
                          {formErrors.deliveryMethod}
                        </p>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={user.name}
                        placeholder="Enter your full name"
                        required
                        disabled={true}
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={user.email}
                        placeholder="Enter your email"
                        required
                        disabled={true}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="Enter your street address"
                        required={!isAddressDisabled}
                        disabled={isAddressDisabled}
                        aria-invalid={!!formErrors.address}
                        aria-describedby={formErrors.address ? "address-error" : undefined}
                      />
                      {formErrors.address && (
                        <p id="address-error" className="text-sm text-red-500 mt-1">
                          {formErrors.address}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        required={!isAddressDisabled}
                        disabled={isAddressDisabled}
                        aria-invalid={!!formErrors.city}
                        aria-describedby={formErrors.city ? "city-error" : undefined}
                      />
                      {formErrors.city && (
                        <p id="city-error" className="text-sm text-red-500 mt-1">
                          {formErrors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="Enter your zip code"
                        required={!isAddressDisabled}
                        disabled={isAddressDisabled}
                        aria-invalid={!!formErrors.zipCode}
                        aria-describedby={formErrors.zipCode ? "zipCode-error" : undefined}
                      />
                      {formErrors.zipCode && (
                        <p id="zipCode-error" className="text-sm text-red-500 mt-1">
                          {formErrors.zipCode}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="phone">Receiver Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                        aria-invalid={!!formErrors.phone}
                        aria-describedby={formErrors.phone ? "phone-error" : undefined}
                      />
                      {formErrors.phone && (
                        <p id="phone-error" className="text-sm text-red-500 mt-1">
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="notes">Order Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Notes about your order, e.g. special delivery instructions"
                      className="resize-none"
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
             
              {/* Payment Method */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="cash" id="cash" />
                        <div>
                          <Label
                            htmlFor="cash"
                            className="font-medium cursor-pointer"
                          >
                            Cash on Delivery
                          </Label>
                          <p className="text-sm text-gray-500">
                            Pay with cash when your order is delivered
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Commented out payment methods - can be enabled when implemented
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="esewa" id="esewa" />
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2">
                            <img 
                              src="/api/placeholder/32/32" 
                              alt="eSewa" 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="esewa"
                              className="font-medium cursor-pointer"
                            >
                              eSewa
                            </Label>
                            <p className="text-sm text-gray-500">
                              Pay securely with your eSewa account
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="khalti" id="khalti" />
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2">
                            <img 
                              src="/api/placeholder/32/32" 
                              alt="Khalti" 
                              className="w-full h-full object-contain" 
                            />
                          </div>
                          <div>
                            <Label
                              htmlFor="khalti"
                              className="font-medium cursor-pointer"
                            >
                              Khalti
                            </Label>
                            <p className="text-sm text-gray-500">
                              Pay securely with your Khalti wallet
                            </p>
                          </div>
                        </div>
                      </div>
                    </div> */}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="pb-3">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="pb-0">
                  <div className="max-h-64 overflow-y-auto mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-start">
                          <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 border border-gray-200 mr-3">
                            <img
                              src={item.product.image_url || (item.product.media && item.product.media[0]?.file)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity} * {item.product.finalprice}</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                          {currencySymbol} {(item.product.finalprice * item.quantity).toFixed(2)}
                          {parseFloat(item.product.discount) > 0 && (
                            <span className='mx-1 items-center'>
                        
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Info size={16} className="text-blue-500" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Discount: {item.product.discount}%</p>
                                    <p>You each save: {currencySymbol} {(parseFloat(item.product.price) - item.product.finalprice).toFixed(2)}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </span>
                          )}
                        </div>
                         
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{currencySymbol} {subtotal.toFixed(2)}</span>
                    </div>
                    
                 
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {selectedDeliveryMethod?.price === 0 
                          ? 'Free' 
                          : selectedDeliveryMethod 
                            ? `${currencySymbol} ${selectedDeliveryMethod.price.toFixed(2)}` 
                            : '-'
                        }
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-lg">{currencySymbol} {calculatedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isPlacingOrder || isLoading}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              {submitAttempted && Object.keys(formErrors).length > 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please fix the highlighted errors before placing your order.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;
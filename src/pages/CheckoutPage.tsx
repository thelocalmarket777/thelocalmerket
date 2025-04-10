import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { DeliveryMethod, FormData } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { mockDeliveryMethods } from '@/lib/api';
import RemoteServices from '@/RemoteService/Remoteservice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>(mockDeliveryMethods || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    address: user?.address || '',
    city: '',
    zipCode: '',
    phone: user?.phone_number || '',
    deliveryMethod: '',
    notes: '',
    paymentMethod: 'cash', // Default payment method
  });


  const currencySymbol = 'NPR';

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    if (!user || !token) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    // Fetch delivery methods
    const fetchDeliveryMethods = async () => {
      try {
        setIsLoading(true);
        const methods = mockDeliveryMethods;
        setDeliveryMethods(methods);
        // Set default delivery method
        if (methods.length > 0) {
          setFormData(prev => ({ ...prev, deliveryMethod: methods[0].id }));
        }
      } catch (error) {
        console.error('Error fetching delivery methods:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load delivery methods',
          description: 'Please try refreshing the page',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryMethods();
  }, [items.length, user, navigate, toast]);

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
    const requiredFields = [
      { key: 'address', label: 'Street Address' },
      { key: 'city', label: 'City' },
      { key: 'phone', label: 'Phone Number' },
      { key: 'deliveryMethod', label: 'Delivery Method' }
    ];

    requiredFields.forEach(field => {
      if (!formData[field.key as keyof typeof formData]) {
        errors[field.key] = `${field.label} is required`;
      }
    });

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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);

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

    // Format the order data with only required fields
    const orderData = {
      user_id: user.id,
      items: items.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        category: item.product.category,
        name: item.product.name
      })),
      shipping_address: `${formData.address}, ${formData.city}, ${formData.zipCode}`,
      delivery_method: formData.deliveryMethod,
      subtotal: subtotal,
      shipping_cost: selectedDeliveryMethod?.price || 0,
      total_amount: calculatedTotal,
      payment_method: 'cash' // Only cash payment is supported now
    };

    // Place the order
    try {
      const res = await RemoteServices.orderPlaced(orderData);
      const order = res.data;
      console.log('res', res);
      
      // Clear the cart
      clearCart();
      localStorage.setItem('orderconform', JSON.stringify(order));

      // Show success notification
      toast({
        title: 'Order Placed Successfully',
        description: `Your order #${order.id} has been confirmed`,
      });

      // Redirect to order confirmation
      navigate(`/orderConfirmation/${order.id}`, { state: { oderconform: order } });
    } catch (error) {
      console.error('Order placement error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while processing your order';

      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: errorMessage,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

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
                        required
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
                        required
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
                        required
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
                      <Label htmlFor="phone">Phone Number</Label>
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
                        aria-invalid={!!formErrors.deliveryMethod}
                        aria-describedby={formErrors.deliveryMethod ? "deliveryMethod-error" : undefined}
                      >
                        {deliveryMethods.map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => handleDeliveryMethodChange(method.id)}
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value={method.id} id={method.id} />
                              <div>
                                <Label
                                  htmlFor={method.id}
                                  className="font-medium cursor-pointer"
                                >
                                  {method.name}
                                </Label>
                                <p className="text-sm  text-gray-500">
                                  {method.description} ({method.estimated_days})
                                </p>
                              </div>
                            </div>
                            <div className="font-medium">NPR{method.price.toFixed(2)}</div>
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

              {/* Payment Method */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={handlePaymentMethodChange}
                  >
                    <div className="flex items-center justify-between border border-gray-200 rounded-lg p-4 bg-gray-50">
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
                  </RadioGroup>
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
                              src={item.product.imageUrl || (item.product.media && item.product.media[0]?.file)}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium line-clamp-1">{item.product.name}</h4>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="text-sm font-medium">
                        {currencySymbol} &nbsp; {(item.product.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">{currencySymbol} &nbsp;{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {selectedDeliveryMethod ? ` ${currencySymbol} ${selectedDeliveryMethod.price.toFixed(2)}` : '-'}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-lg">{currencySymbol} &nbsp;{calculatedTotal.toFixed(2)}</span>
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
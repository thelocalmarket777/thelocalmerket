
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
import { api } from '@/lib/api';
import { DeliveryMethod } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
 
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const token = localStorage.getItem('token') 
  const user = JSON.stringify(localStorage.getItem('user')) 
  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    city: '',
    zipCode: '',
    phone: user?.phone_number || '',
    deliveryMethod: '',
    notes: ''
  });

  useEffect(() => {
    // Redirect if no items in cart
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    
    // Fetch delivery methods
    const fetchDeliveryMethods = async () => {
      try {
        setIsLoading(true);
        const methods = await api.delivery.getMethods();
        setDeliveryMethods(methods);
        // Set default delivery method
        if (methods.length > 0) {
          setFormData(prev => ({ ...prev, deliveryMethod: methods[0].id }));
        }
      } catch (error) {
        console.error('Error fetching delivery methods:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDeliveryMethods();
  }, [items.length, user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryMethodChange = (value: string) => {
    setFormData(prev => ({ ...prev, deliveryMethod: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        variant: 'destructive',
        title: 'Login Required',
        description: 'Please log in to complete your purchase',
      });
      return;
    }
    
    // Validate form
    const requiredFields = ['name', 'email', 'address', 'city', 'zipCode', 'phone', 'deliveryMethod'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill in all required fields',
      });
      return;
    }
    
    try {
      setIsPlacingOrder(true);
      
      // Format the address
      const fullAddress = `${formData.address}, ${formData.city}, ${formData.zipCode}`;
      
      // Place the order
      const order = await api.orders.create(formData.deliveryMethod, fullAddress);
      
      // Clear the cart
      clearCart();
      
      // Show success notification
      toast({
        title: 'Order Placed Successfully',
        description: `Your order #${order.id} has been placed`,
      });
      
      // Redirect to order confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: errorMessage,
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const selectedDeliveryMethod = deliveryMethods.find(
    method => method.id === formData.deliveryMethod
  );
  
  const calculatedTotal = subtotal + (selectedDeliveryMethod?.price || 0);

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
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
                    />
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
                    />
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
                    />
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
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Method */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Delivery Method</h2>

                {isLoading ? (
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="h-16 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <RadioGroup
                    value={formData.deliveryMethod}
                    onValueChange={handleDeliveryMethodChange}
                    className="space-y-4"
                  >
                    {deliveryMethods.map((method) => (
                      <div 
                        key={method.id}
                        className="flex items-center justify-between border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
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
                            <p className="text-sm text-gray-500">
                              {method.description} ({method.estimated_days})
                            </p>
                          </div>
                        </div>
                        <div className="font-medium">${method.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              </div>

              {/* Order Notes */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-6">Additional Information</h2>
                
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
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
                
                <div className="max-h-64 overflow-y-auto mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between py-3 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-start">
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <h4 className="text-sm font-medium">{item.product.name}</h4>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {selectedDeliveryMethod ? `$${selectedDeliveryMethod.price.toFixed(2)}` : '-'}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold">${calculatedTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                  disabled={isPlacingOrder || isLoading}
                >
                  {isPlacingOrder ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default CheckoutPage;

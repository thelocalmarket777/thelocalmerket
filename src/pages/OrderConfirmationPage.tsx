
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { CheckCircle, ArrowRight } from 'lucide-react';

const OrderConfirmationPage = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const orderId = parseInt(id);
        const fetchedOrder = await api.orders.getById(orderId);
        
        if (fetchedOrder) {
          setOrder(fetchedOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-100 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-24 bg-gray-100 rounded"></div>
              <div className="h-12 bg-gray-100 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!order) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="mb-6">The order you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Format date
  const formattedDate = new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Your order has been placed and will be shipped soon.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                <p className="text-gray-500">Placed on {formattedDate}</p>
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Delivery Information</h3>
              <p className="text-gray-700">{order.delivery_address}</p>
              <p className="text-gray-700 mt-2">
                Delivery Method: {order.delivery_method.charAt(0).toUpperCase() + order.delivery_method.slice(1)} Shipping
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <img 
                      src={item.product.imageUrl} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.quantity * item.price).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span>${(order.total - 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <Button asChild>
              <Link to="/orders" className="flex items-center justify-center gap-2">
                View All Orders
                <ArrowRight size={16} />
              </Link>
            </Button>
            <div>
              <Link to="/" className="text-brand-blue hover:underline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrderConfirmationPage;

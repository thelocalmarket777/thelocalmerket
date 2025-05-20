import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { CheckCircle, ArrowRight, ImageIcon } from 'lucide-react';

// Utility functions
const formatCurrency = (amount: number | string | undefined): string => {
  const value = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `NPR ${(value || 0).toFixed(2)}`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const capitalizeFirstLetter = (str?: string, fallback = ''): string => {
  if (!str) return fallback;
  return str.charAt(0).toUpperCase() + str.slice(1);
};



const OrderPurchase= () => {
      const { state } = useLocation();
      const order=state.oderconform

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
        {/* Order confirmation header */}
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
          {/* Order details header */}
          <div className="flex justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Order #{order.id}</h2>
              <p className="text-gray-500">Placed on {formatDate(order.created_at)}</p>
            </div>
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {capitalizeFirstLetter(order.status, 'Processing')}
              </span>
            </div>
          </div>

          {/* Delivery information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-2">Delivery Information</h3>
            <p className="text-gray-700">{order?.delivery_address || 'Address not provided'}</p>
            <p className="text-gray-700 mt-2">
              Delivery Method: {capitalizeFirstLetter(order?.delivery_method, 'Standard')} Shipping
            </p>
          </div>

          {/* Order items */}
          <div className="mb-6">
            <h3 className="font-medium mb-4">Order Items</h3>
            <div className="space-y-4">
              {order?.order_items?.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                <img src={import.meta.env.VITE_BASE_URL + item?.product_img} alt={item?.product_name} className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="font-medium">{item?.product_name}</h4>
                    <p className="text-sm text-gray-500">
                      Qty: {item?.quantity || 0} × {formatCurrency(item?.price)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      {formatCurrency((item?.quantity) * parseFloat(item?.price))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order summary */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Shipping</span>
              <span>{formatCurrency(order.shipping_cost)}</span>
            </div>
            {order.tax && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Tax</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
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
  );
};

export default OrderPurchase;
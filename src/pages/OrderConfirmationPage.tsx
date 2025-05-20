import React from 'react';
import { CheckCircle, ArrowRight, Import, ImageIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useFcmToken } from '@/hooks/useFcmToken';

// Utility functions from the original component
const formatCurrency = (amount) => {
  return `NPR ${(amount || 0).toFixed(2)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const capitalizeFirstLetter = (str, fallback = '') => {
  if (!str) return fallback;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getProductImage = (item) => {
  if (!item?.product_img) {
    return null;
  }

  try {
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}${item.product_img}`;
  } catch (error) {
    console.error('Error constructing image URL:', error);
    return null;
  }
};

export default function OrderConfirmation() {
  
  // The order data provided in the JSON
  const {state}=useLocation()
  const order =state.oderconform
  
   
  

  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
          {/* Order confirmation header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center bg-green-100 rounded-full w-16 h-16 mb-4">
              <CheckCircle className="text-green-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Your order has been placed and will be processed soon.
            </p>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            {/* Order details header */}
            <div className="flex justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.id.substring(0, 8)}...</h2>
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
              <p className="text-gray-700">{order.delivery_address || 'Address not provided'}</p>
              <p className="text-gray-700 mt-2">
                Delivery Method: {capitalizeFirstLetter(order.delivery_method, 'Standard')} 
              </p>
              <p className="text-gray-700 mt-2">
                Contact: {order.ReceiverContact || 'Not provided'}
              </p>
            </div>

            {/* Order items */}
            <div className="mb-6">
              <h3 className="font-medium mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      {getProductImage(item) ? (
                        <img 
                          src={getProductImage(item)} 
                          alt={item?.product_name} 
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-gray-200">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity} × {formatCurrency(parseFloat(item.price))}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.quantity * parseFloat(item.price))}
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
                <span>{formatCurrency(order.sub_total)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span>{formatCurrency(order.shipping_cost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="text-center space-y-4">
            <a href='/orders' className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center justify-center gap-2 mx-auto">
              View All Orders
              <ArrowRight size={16} />
            </a>
            <div>
              <a href="/" className="text-blue-600 hover:underline">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
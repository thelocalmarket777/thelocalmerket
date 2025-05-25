import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { OrderDetails, OrderState, OrderItem } from '@/types';
import { Package, User as UserIcon, ExternalLink, ImageIcon, AlertCircle, ChevronDown, ChevronUp, Gift } from 'lucide-react';
import RemoteServices from '@/RemoteService/Remoteservice';

const OrdersPage = () => {
  const [state, setState] = useState<OrderState>({
    orders: [],
    isLoading: true,
    error: null,
    expandedOrders: {}
  });

  const { orders, isLoading, error, expandedOrders } = state;
  
  const token = localStorage.getItem('token') !== null;
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await RemoteServices.orderPlacedAllDetails();
      const ordersData = response.data || [];
      
      // Initialize expanded state for all orders
      const initialExpandedState = ordersData.reduce((acc, order, index) => ({
        ...acc,
        [order.id]: index === 0
      }), {});

      setState({
        orders: ordersData,
        isLoading: false,
        error: null,
        expandedOrders: initialExpandedState
      });
    } catch (err) {
      console.error('Error fetching orders:', err);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load your orders. Please try again later.'
      }));
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user?.id, fetchOrders]);

  const toggleOrderExpansion = (orderId: string) => {
    setState(prev => ({
      ...prev,
      expandedOrders: {
        ...prev.expandedOrders,
        [orderId]: !prev.expandedOrders[orderId]
      }
    }));
  };

  if (!token) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto bg-white rounded-lg border border-gray-200 p-8">
            <div className="inline-flex items-center justify-center bg-red-100 rounded-full w-16 h-16 mb-4">
              <AlertCircle className="text-red-600" size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-6">Please log in to view your orders.</p>
            <Button asChild>
              <Link to="/login">Login</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProductImage = (item) => {
    if (item?.product?.media && item.product.media.length > 0) {
      return item.product.media[0].file;
    }
    return item?.product?.imageUrl || '';
  };
const currencysymbol = 'Rs.';
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mb-4">
                    <UserIcon size={48} className="text-gray-500" />
                  </div>
                  <h2 className="text-xl font-semibold">{user?.name || 'User'}</h2>
                  <p className="text-gray-500 text-sm mt-1">{user?.email || 'No email available'}</p>
                </div>
              </div>
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/profile" 
                      className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      <UserIcon size={18} />
                      <span>Profile</span>
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/orders" 
                      className="flex items-center gap-3 px-4 py-2 text-brand-blue font-medium rounded-md bg-blue-50"
                    >
                      <Package size={18} />
                      <span>Orders</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold">Order History</h2>
              </div>

              {isLoading ? (
                <div className="p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="h-24 bg-gray-100 rounded"></div>
                    ))}
                  </div>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Something went wrong</h3>
                  <p className="text-gray-500 mb-6">{error}</p>
                  <Button onClick={fetchOrders}>Try Again</Button>
                </div>
              ) : orders?.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <div key={order?.id} className="p-6">
                      {/* Order Header - Always visible */}
                      <div 
                        className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 cursor-pointer"
                        onClick={() => toggleOrderExpansion(order.id)}
                      >
                        <div className="flex items-center">
                          {expandedOrders[order.id] ? (
                            <ChevronUp size={20} className="text-gray-500 mr-2" />
                          ) : (
                            <ChevronDown size={20} className="text-gray-500 mr-2" />
                          )}
                          <div>
                            <h3 className="text-lg font-medium">Order #{order?.id}</h3>
                            <p className="text-sm text-gray-500">
                              Placed on {formatDate(order?.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order?.status)}`}>
                            {order?.status}
                          </span>
                   
                        </div>
                      </div>

                      {/* Order Details - Conditionally visible */}
                      {expandedOrders[order.id] && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {/* Order Summary */}
                          <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Delivery Method</h4>
                              <p className="text-sm font-medium">{order.delivery_method || 'N/A'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h4>
                              <p className="text-sm font-medium">{order.payment_method || 'N/A'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Shipping Address</h4>
                              <p className="text-sm font-medium">{order.shipping_address || 'N/A'}</p>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-500 mb-1">Order Date</h4>
                              <p className="text-sm font-medium">{formatDate(order?.created_at)}</p>
                            </div>
                          </div>

                          {/* Order Items List */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium mb-3">Order Items</h4>
                            <div className="space-y-4">
                              {order?.order_items?.map((item, index) => (
                                <div key={index} className="flex items-center">
                                  <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                               <img src={item?.image} alt={item?.product_name} className="w-full h-full object-cover rounded" />
                                  </div>
                                  <div className="ml-4 flex-1">
                                  <div className="font-medium">
                                    {item?.product_name || 'Unknown Product'}
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    {item?.category && <span>Category: {item.category}</span>}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Qty: {item?.quantity || 0}
                                  </p>
                                  </div>
                                  <div className="text-right">
                                  <p className="font-medium">
                                    {currencysymbol} {((parseFloat(item?.price) || 0) * (item?.quantity || 0)).toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {currencysymbol} {parseFloat(item?.price || 0).toFixed(2)} each
                                  </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Summary */}
                            <div className="mt-4 bg-gray-50 rounded-lg p-4">
                       
                                 <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-semibold">
                                  <span className="text-gray-600">Subtotal</span>
                              <div className="flex items-center gap-1">
                              <span>{currencysymbol} {parseFloat(order?.subtotal || 0).toFixed(2)}</span>
                              {/* <div className="relative group">
                                <Gift size={16} className="text-red-900 cursor-help" />
                                <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block bg-black text-white text-xs py-1 px-2 rounded">
                                Including discount 4%
                                </div>
                              </div> */}
                              </div>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-gray-600">Shipping</span>
                              <span>{currencysymbol} {parseFloat(order?.shipping_cost || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-200 font-semibold">
                              <span>Total</span>
                              <div className="flex items-center gap-1">
                              <span>{currencysymbol} {parseFloat(order?.total_amount || 0).toFixed(2)}</span>
                          
                              </div>
                            </div>
                            </div>

                          {order.notes && (
                            <div className="mt-4 bg-blue-50 rounded-lg p-4 text-sm">
                              <h4 className="font-medium mb-1">Order Notes</h4>
                              <p>{order.notes}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Orders Yet</h3>
                  <p className="text-gray-500 mb-6">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button asChild>
                    <Link to="/">Browse Products</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OrdersPage;
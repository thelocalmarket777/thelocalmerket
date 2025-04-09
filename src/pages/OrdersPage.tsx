import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Order } from '@/types';
import { Package, User as UserIcon, ExternalLink, ImageIcon, AlertCircle } from 'lucide-react';
import RemoteServices from '@/RemoteService/Remoteservice';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const token = localStorage.getItem('token') !== null;
  const user = token ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  const fetchOrders = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await RemoteServices.orderPlacedAllDetails();
      setOrders(response.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load your orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    } else {
      setIsLoading(false);
    }
  }, [user?.id, fetchOrders]);

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

  const formatDate = (dateString: string) => {
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

  const getStatusBadgeClass = (status: string) => {
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
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <div>
                          <h3 className="text-lg font-medium">Order #{order?.id}</h3>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order?.created_at)}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order?.status)}`}>
                            {order?.status}
                          </span>
                          <Link 
                            to={`/order-confirmation/${order?.id}`}
                            state={{ orderConfirm: order }}
                            className="ml-4 text-brand-blue hover:text-brand-blue/80 inline-flex items-center"
                          >
                            <span className="mr-1">View</span>
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order?.items?.map((item) => (
                          <div key={item?.id} className="flex items-center">
                            {getProductImage(item) ? (
                              <img 
                                src={getProductImage(item)}
                                alt={item?.product?.name}
                                className="w-16 h-16 object-cover rounded"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/path/to/fallback-image.jpg';
                                  (e.target as HTMLImageElement).onerror = null;
                                }}
                              /> 
                            ) : (
                              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                                <ImageIcon className="text-gray-400" size={24} />
                              </div>
                            )}
                            <div className="ml-4 flex-1">
                              <Link 
                                to={`/product/${item?.product?.id}`}
                                className="font-medium hover:text-brand-blue"
                              >
                                {item?.product?.name || 'Unknown Product'}
                              </Link>
                              <p className="text-sm text-gray-500">
                                Qty: {item?.quantity || 0}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                NPR &nsbp;{((parseFloat(item?.price) || 0) * (item?.quantity || 0)).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-right">
                        <p className="font-semibold">Total: NPR{(order?.total_amount )}</p>
                      </div>
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
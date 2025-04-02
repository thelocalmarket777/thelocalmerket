
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Package, User as UserIcon, ExternalLink } from 'lucide-react';

const OrdersPage = () => {

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
    const token =localStorage.getItem('token') !== null 
    const user =JSON.stringify(localStorage.getItem('user'))
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const userOrders = await api.orders.getAll();
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (!token) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-6">Please log in to view your orders.</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
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
                  <h2 className="text-xl font-semibold">{user.name || 'User'}</h2>
                  <p className="text-gray-500 text-sm mt-1">{user.email}</p>
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
              ) : orders.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                        <div>
                          <h3 className="text-lg font-medium">Order #{order.id}</h3>
                          <p className="text-sm text-gray-500">
                            Placed on {formatDate(order.created_at)}
                          </p>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                          <Link 
                            to={`/order-confirmation/${order.id}`} 
                            className="ml-4 text-brand-blue hover:text-brand-blue/80 inline-flex items-center"
                          >
                            <span className="mr-1">View</span>
                            <ExternalLink size={14} />
                          </Link>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center">
                            <img 
                              src={item.product.imageUrl}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div className="ml-4 flex-1">
                              <Link 
                                to={`/product/${item.product.id}`}
                                className="font-medium hover:text-brand-blue"
                              >
                                {item.product.name}
                              </Link>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 text-right">
                        <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
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

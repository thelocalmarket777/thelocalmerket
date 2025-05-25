import { useEffect, useState, useMemo } from "react";
import { Bell, ShoppingBag, Truck, Tag, Clock, CheckCircle, X, ShieldAlert, Image as ImageIcon } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import RemoteServices from "@/RemoteService/Remoteservice";

export default function NotificationPage() {
  const [activeTab, setActiveTab] = useState<"all" | "order" | "promotion" | "system">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  interface OrderItem {
    product_id: string;
    quantity: number;
    price: string;
    category: string;
    product_name: string;
    product_img: string | null;
  }

  interface Notification {
    id: number;
    type: 'order' | 'promotion' | 'system';
    title: string;
    message: string;
    time: string;
    read: boolean;
    status?: string;
    order_items?: OrderItem[];
    total_amount?: string;
    address?: string;
  }

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    checklogin();
  
    setLoading(true);
    RemoteServices.getnotificationHistory()
      .then((response) => {
        const { unread_count, notifications: grouped } = response.data;
        setUnreadCount(unread_count);

        const orders = grouped.order.map((n: any) => ({
          id: n.id,
          type: 'order' as const,
          title: n.title,
          message: n.message,
          time: n.time,
          read: n.read,
          status: n.status,
          order_items: n.orders_items,
          total_amount: n.total_amount,
          address: n.address,
          order_id: n.order_id,
        }));
        const promotions = grouped.promotion.map((n: any) => ({ ...n, type: 'promotion' as const }));
        const systems = grouped.system.map((n: any) => ({ ...n, type: 'system' as const }));

        const all = [...orders, ...promotions, ...systems].sort(
          (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );
        setNotifications(all);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch notifications");
      })
      .finally(() => setLoading(false));
  }, []);



  const markAllAsRead = () => {
    RemoteServices.postnoficationread().then((response) => {
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
      setUnreadCount(0);
    });
  };

  const filteredNotifications = useMemo(
    () =>
      activeTab === "all"
        ? notifications
        : notifications.filter((n) => n.type === activeTab),
    [notifications, activeTab]
  );

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-white";
    switch (status.toLowerCase()) {
      case 'cancelled':
        return "bg-red-50 border-red-100";
      case 'pending':
        return "bg-yellow-50 border-yellow-100";
      case 'delivered':
        return "bg-green-50 border-green-100";
      case 'shipped':
        return "bg-blue-50 border-blue-100";
      case 'processing':
        return "bg-blue-50 border-blue-100";
      default:
        return "bg-white";
    }
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <Bell className="text-gray-500" size={20} />;
    switch (status.toLowerCase()) {
      case 'cancelled':
        return <X className="text-red-500" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-500" size={20} />;
      case 'delivered':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'shipped':
        return <Truck className="text-blue-500" size={20} />;
      default:
        return <Bell className="text-gray-500" size={20} />;
    }
  };

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="text-blue-500" size={20} />;
      case 'promotion':
        return <Tag className="text-purple-500" size={20} />;
      case 'system':
        return <ShieldAlert className="text-green-500" size={20} />;
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="h-full flex flex-col items-center justify-center p-6">
          <div className="p-3 rounded-full bg-red-100 mb-4">
            <X className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-medium text-red-600">Error</h3>
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </MainLayout>
    );
  }
  
const checklogin=()=>{
    const token = localStorage.getItem('token');
  if(!token)return (

    <MainLayout>
      <div className="h-full flex items-center justify-center p-6">
        <div className="p-3 rounded-full bg-yellow-100 mb-4">
          <ShieldAlert className="text-yellow-600" size={24} />
        </div>
        <h3 className="text-lg font-medium text-yellow-600">Unauthorized</h3>
        <p className="text-yellow-500 text-center">Please log in to view notifications.</p>
      </div>
    </MainLayout>
  );
}
  const  currencysymbol ='Rs'

  return (
    <MainLayout>
      <div className="min-h-full bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-start gap-1 items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 ml-4"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div className="mb-6 flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {['all', 'order', 'promotion', 'system'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 px-6 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'all' && unreadCount > 0 && (
                  <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map(notification => {
                const bgColor = notification.status
                  ? getStatusColor(notification.status)
                  : notification.read
                  ? 'bg-white'
                  : 'bg-blue-50 border-blue-100';
                return (
                  <div
                    key={notification.id}
                    className={`relative p-4 rounded-lg border shadow-sm hover:shadow transition-all ${bgColor}`}
              
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-2 rounded-full bg-white shadow-sm">
                        {notification.status
                          ? getStatusIcon(notification.status)
                          : getTypeIcon(notification.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <p
                              className={`text-sm font-medium ${
                                notification.status === 'cancelled'
                                  ? 'text-red-800'
                                  : notification.read
                                  ? 'text-gray-800'
                                  : 'text-gray-900'
                              }`}
                            >
                              {notification.title}
                            </p>
                            {notification.order_id && (
                              <p className="text-xs text-gray-500 mt-1">
                                Order #{notification.order_id.slice(0, 8)}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                            {formatTime(notification.time)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{notification.message}</p>
                        {notification.order_items && (
                          <div className="mt-3 space-y-3">
                            {notification.order_items.map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center p-2 bg-white rounded-lg border border-gray-100"
                              >
                                <div className="h-14 w-14 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-50">
                                  {item.product_img ? (
                                    <img
                                      src={item.product_img}
                                      alt={item.product_name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex flex-col items-center justify-center h-full w-full bg-gray-100">
                                      <ImageIcon
                                        size={20}
                                        className="text-gray-400"
                                      />
                                      <span className="text-xs text-gray-400 mt-1">No image</span>
                                    </div>
                                  )}
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium text-gray-700">
                                      {item.product_name}
                                    </span>
                                    <span className="text-sm font-medium text-gray-900">
                                      {currencysymbol}{parseFloat(item.price).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between mt-1">
                                    <span className="text-xs text-gray-500">
                                      {item.category}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      Qty: {item.quantity}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {notification.total_amount && (
                              <div className="flex justify-end mt-2">
                                <span className="text-sm font-semibold text-gray-900">
                                  Total: {currencysymbol}{parseFloat(notification.total_amount).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {notification.address && (
                          <div className="mt-3 flex items-center">
                            <Truck size={16} className="text-gray-400" />
                            <p className="ml-2 text-xs text-gray-500">
                              {notification.address}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    {notification.status && (
                      <div className="mt-3 flex justify-end">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            notification.status.toLowerCase() === 'cancelled'
                              ? 'bg-red-100 text-red-800'
                              : notification.status.toLowerCase() === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : notification.status.toLowerCase() === 'delivered'
                              ? 'bg-green-100 text-green-800'
                              : notification.status.toLowerCase() === 'shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {notification.status}
                        </span>
                      </div>
                    )}
                    {!notification.read && (
                      <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-100 shadow-sm">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100">
                  <Bell className="text-gray-400" size={28} />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No notifications
                </h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  You don't have any {activeTab !== 'all' ? activeTab : ''} notifications at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

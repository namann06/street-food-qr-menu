import { useState, useEffect } from 'react';

interface OrderItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderId: string;
  items: OrderItem[];
  total: number;
  tableNumber: string;
  paymentMethod: 'upi' | 'counter';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

interface OrdersListProps {
  shopId: string;
}

export default function OrdersList({ shopId }: OrdersListProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders/${shopId}`);
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError('Error loading orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // Set up polling to check for new orders every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [shopId]);

  const updateOrderStatus = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const res = await fetch(`/api/orders/${shopId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update order');
      
      // Refresh orders list
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const filterOrdersByDate = (orders: Order[], date: string) => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
      return orderDate === date;
    });
  };

  if (loading) return <div className="text-gray-400">Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const completedOrders = filterOrdersByDate(
    orders.filter(order => order.status === 'completed'),
    selectedDate
  );

  return (
    <div className="space-y-6">
      {/* Pending Orders */}
      <div>
        <h3 className="text-xl font-semibold mb-4 text-yellow-500">Pending Orders</h3>
        <div className="space-y-4">
          {pendingOrders.length === 0 ? (
            <p className="text-gray-400">No pending orders</p>
          ) : (
            pendingOrders.map((order) => (
              <div key={order._id} className="bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-yellow-500 font-medium">
                      Table {order.tableNumber}
                    </span>
                    <span className="ml-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                    <div className="text-sm text-blue-400 mt-1">
                      Order ID: {order.orderId}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateOrderStatus(order._id, 'completed')}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm"
                    >
                      Complete
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, 'cancelled')}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-2 border-t border-gray-700 flex justify-between items-center">
                  <div>
                    <span className="text-blue-400">Total: ₹{order.total}</span>
                    <span className="ml-4 px-2 py-1 rounded bg-gray-700 text-xs">
                      {order.paymentMethod === 'upi' ? 'Pay by UPI' : 'Pay at Counter'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Completed Orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-green-500">Completed Orders</h3>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-1 bg-gray-800 rounded border border-gray-700 focus:outline-none focus:border-blue-500 text-white"
          />
        </div>
        <div className="space-y-4">
          {completedOrders.length === 0 ? (
            <p className="text-gray-400">No completed orders for selected date</p>
          ) : (
            completedOrders.map((order) => (
              <div key={order._id} className="bg-gray-800 p-4 rounded-lg opacity-75">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-green-500 font-medium">
                      Table {order.tableNumber}
                    </span>
                    <span className="ml-4 text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </span>
                    <div className="text-sm text-blue-400 mt-1">
                      Order ID: {order.orderId}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item._id} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span className="text-gray-400">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-2 border-t border-gray-700">
                  <span className="text-blue-400">Total: ₹{order.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

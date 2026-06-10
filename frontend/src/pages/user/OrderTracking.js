import { Eye, Search, Trash2 } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { getMyOrders, cancelOrderApi } from '../../api/orderService';
import { useEffect, useState, useMemo } from 'react';
import { getStatusColor, STATUS_MAP } from '../../utils/statusColors';
import OrderDetailsModal from '../../components/user/OrderDetailsModal';
import OrderCancelledModal from '../../components/user/OrderCancelledModal';
import { formatOrderId, formatPrice,formatDate } from '../../utils/formatters';

export default function OrderTracking() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await getMyOrders();
        if (response.success) {
          setOrders(response.data);
        } else {
          setError(response.message || "Failed to fetch orders");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchMyOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await cancelOrderApi(orderId);
      if (response.success) {
        setOrders(prevOrders => prevOrders.map(order =>
          order.id === orderId ? { ...order, status: 'cancelled' } : order
        ));
        setCancelOrderId(null);
      } else {
        setError(response.message || "Failed to cancel order");
      }
    } catch (err) {
      setError("An error occurred while canceling the order.");
    }
  };

  const filteredOrders = useMemo(() =>
    Array.isArray(orders)
      ? orders.filter(o => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return String(o.id).includes(query) || formatOrderId(o.id).toLowerCase().includes(query);
      })
      : []
    , [orders, searchQuery]);

  return (
    <div className="min-h-screen bg-ui-mainBg font-sans pb-20">
      <Navbar />

      <main>
        <section className="max-w-6xl mx-auto px-4 md:px-8 mt-12 md:mt-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-content-paragraph mb-4 tracking-tighter">
                Track Your Orders
              </h1>
              <p className="text-content-subtitle max-w-xl leading-relaxed text-sm md:text-base">
                Monitor your active and previous orders in one place.
              </p>
            </div>

            <div className="relative group max-w-xs w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Order ID..."
                className="w-full bg-ui-card py-4 pl-12 pr-4 rounded-2xl text-sm outline-none border border-ui-border focus:border-brand-primary transition-all"
              />
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
          <div className="bg-ui-white rounded-2xl  border border-ui-border overflow-hidden">

            <div className="flex justify-between items-center px-8 py-8 border-b border-ui-mainBg">
              <h2 className="text-xl font-bold text-content-paragraph">Recent Orders</h2>
            </div>

            <section className='mx-10'>
              <div className="overflow-x-auto rounded-2xl">
                <table className="w-full text-center min-w-[900px]">
                  <thead className="bg-brand-primary text-white text-center text-sm font-bold uppercase">
                    <tr>
                      <th className="py-5 px-6">Order ID</th>
                      <th className="py-5 px-6">Date</th>
                      <th className="py-5 px-6">Items</th>
                      <th className="py-5 px-6">Total</th>
                      <th className="py-5 px-6">Status</th>
                      <th className="py-5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gray-400 text-sm font-medium">Loading orders...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td colSpan="7" className="text-center py-16">
                          <div className="flex flex-col items-center gap-3">
                            <span className="text-red-500 font-bold bg-red-50 px-6 py-3 rounded-xl border border-red-200">
                              {error}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 && searchQuery ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-content-subtitle">
                          <p className="text-content-paragraph text-lg">No orders match your search <span className="text-brand-primary font-bold">({searchQuery})</span></p>
                        </td>
                      </tr>
                    ) : filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-8 text-content-subtitle">
                          <p className="text-content-paragraph text-lg">No orders found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-ui-border text-center hover:bg-ui-mainBg transition-all">
                          <td className="px-6 py-5 text-content-subtitle text-sm font-medium">{formatOrderId(order.id)}</td>
                          <td className="px-6 py-5 text-content-subtitle text-sm">{formatDate(order.created_at)}</td>
                          <td className="px-6 py-5 font-bold text-content-paragraph">
                            <span className="bg-ui-mainBg px-3 py-1.5 rounded-lg border border-ui-border">{order.items_count || 0} items</span>
                          </td>
                          <td className="px-6 py-5 font-bold text-brand-primary">{formatPrice(order.total_amount)}</td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1.5 mx-auto rounded-lg text-xs font-bold flex items-center justify-center gap-2 w-fit border ${getStatusColor(order.status)}`}>
                              {STATUS_MAP[order.status]}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className='flex items-center justify-center gap-2'>
                              <button
                                className='cursor-pointer hover:text-brand-primary transition-colors duration-200'
                                title='View Order'
                                onClick={() => setSelectedOrder(order.id)}
                              >
                                <Eye size={20} />
                              </button>
                              {order.status === 'pending' && (
                                <button
                                  className='cursor-pointer hover:text-red-500 transition-colors duration-200'
                                  title='Cancel Order'
                                  onClick={() => setCancelOrderId(order.id)}
                                >
                                  <Trash2 size={20} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </section >
      </main >
      <OrderDetailsModal isOpen={!!selectedOrder} onClose={() => setSelectedOrder(null)} orderId={selectedOrder} />
      <OrderCancelledModal isOpen={!!cancelOrderId} onClose={() => setCancelOrderId(null)} orderId={cancelOrderId} onCancel={handleCancelOrder} />
    </div >
  );
}
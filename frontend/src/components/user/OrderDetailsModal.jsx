import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { getOrderByIdApi } from "../../api/orderService";
import { formatOrderId, formatPrice } from "../../utils/formatters";

export default function OrderDetailsModal({ isOpen, onClose, orderId }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      setError(null);

      const fetchOrder = async () => {
        try {
          const response = await getOrderByIdApi(orderId);
          if (response.success) {
            setOrder(response.data);
          } else {
            setError(response.message || "Failed to fetch order details");
          }
        } catch (err) {
          setError("An error occurred while fetching order details");
        } finally {
          setLoading(false);
        }
      };

      fetchOrder();
    }
  }, [isOpen, orderId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-2xl p-5 shadow-2xl my-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Order Details</h2>
            <p className="text-gray-400 text-sm mt-1">
              Order {formatOrderId(orderId)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors duration-300"
          >
            <X size={22} />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-400 text-sm font-medium">Loading order details...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <span className="text-red-500 font-bold bg-red-50 px-6 py-3 rounded-xl border border-red-200">
              {error}
            </span>
          </div>
        ) : order ? (
          <div className="space-y-6">
            <div>
              {order.items && order.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-brand-primary text-white text-xs font-bold uppercase">
                      <tr>
                        <th className="py-3 px-4 rounded-tl-xl">Item</th>
                        <th className="py-3 px-4 text-center">Qty</th>
                        <th className="py-3 px-4 text-right">Price</th>
                        <th className="py-3 px-4 text-right rounded-tr-xl">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-800">{item.menu_item_name}</td>
                          <td className="py-3 px-4 text-center text-gray-600">{item.quantity}</td>
                          <td className="py-3 px-4 text-right text-gray-600">{formatPrice(item.unit_price)}</td>
                          <td className="py-3 px-4 text-right font-bold text-brand-primary">{formatPrice(item.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-200">
                        <td colSpan={3} className="py-3 px-4 text-right font-bold text-gray-600">Total</td>
                        <td className="py-3 px-4 text-right font-bold text-lg text-brand-primary">
                          {formatPrice(order.total_amount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p className="text-gray-400 text-sm text-center py-4">No items found</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

import { ShoppingCart, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import OrderRow from "../../components/admin/OrderRow";
import OrdersCard from "../../components/admin/OrdersCard";
import Pagination from "../../components/common/Pagination";
import { useOrders } from "../../hooks/useOrders";

import { STATUS_STYLES, STATUS_MAP } from "../../utils/statusColors";
import { formatOrderId, formatPrice,formatDate } from "../../utils/formatters";

const TABLE_HEADERS = ["Order ID", "Customer", "Amount", "Status", "Date", "Actions"];

const CARDS_CONFIG = [
  { icon: <ShoppingCart size={20} />, title: "Total Orders", color: "text-blue-600 bg-blue-50 border-blue-200", key: "total" },
  { icon: <Clock size={20} />, title: "Pending", color: STATUS_STYLES.pending, key: "pending" },
  { icon: <CheckCircle2 size={20} />, title: "Delivered", color: STATUS_STYLES.delivered, key: "delivered" },
  { icon: <XCircle size={20} />, title: "Cancelled", color: STATUS_STYLES.cancelled, key: "cancelled" },
];

export default function OrdersManagement() {
  const limit = 20;
  const {
    orders,
    isLoading,
    currentPage,
    setCurrentPage,
    meta,
    updatingId,
    ordersError,
    refetchOrders,
    handleStatusChange,
    handleConfirmPayment,
    confirmingPaymentId
  } = useOrders(limit);

  const totalPages = meta.total ? Math.ceil(meta.total / (meta.limit || limit)) : 1;

  const orderCounts = orders.reduce((acc, o) => {
    acc.total = (acc.total || 0) + 1;
    const key = o.status;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const cardValues = {
    total: meta.total || orderCounts.total || 0,
    pending: orderCounts.pending || 0,
    delivered: orderCounts.delivered || 0,
    cancelled: orderCounts.cancelled || 0,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-content-paragraph">
          Orders Management
        </h1>
        <p className="text-content-subtitle text-sm mt-2">
          Monitor and process incoming customer requests. Manage delivery logistics
          and kitchen preparation status in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {CARDS_CONFIG.map((card, index) => (
          <OrdersCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={cardValues[card.key] ?? 0}
            color={card.color}
          />
        ))}
      </div>

      <div className="bg-ui-white rounded-2xl border border-ui-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-brand-primary text-white text-sm text-center font-bold uppercase">
              <tr>
                {TABLE_HEADERS.map((th, index) => (
                  <th key={index} className="py-5 px-6">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400 text-sm font-medium">Loading orders...</span>
                    </div>
                  </td>
                </tr>
              ) : ordersError ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-red-50 p-3 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <span className="text-red-500 text-sm font-medium">{ordersError}</span>
                      <button
                        onClick={() => refetchOrders(currentPage)}
                        className="flex items-center gap-2 mt-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm font-medium">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    OrderID={formatOrderId(order.id)}
                    Customer={order.user_name}
                    Amount={formatPrice(order.total_amount)}
                    Status={STATUS_MAP[order.status] || order.status}
                    statusKey={order.status}
                    Date={formatDate(order.created_at)}
                    updating={updatingId === order.id}
                    onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                    isConfirmingPayment={confirmingPaymentId === order.id}
                    onConfirmPayment={() => handleConfirmPayment(order.id, order.total_amount)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {orders.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={meta.total || orders.length}
            itemsPerPage={meta.limit || limit}
            itemName="orders"
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}

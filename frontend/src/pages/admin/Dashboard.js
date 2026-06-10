import { ShoppingBag, LayoutDashboard, Users, UtensilsCrossed, Plus, AlertCircle, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../components/admin/DashboardCard"
import DashboardRow from "../../components/admin/DashboardRow"
import { useDashboard } from "../../hooks/useDashboard";
import { formatOrderId, formatPrice } from "../../utils/formatters";
import { STATUS_MAP } from "../../utils/statusColors";

export default function Dashboard() {
  const navigate = useNavigate();
  const { data, isLoading, dashboardError, refetchDashboard } = useDashboard();

  const counters = data?.counters || {};
  const revenue = data?.revenue || {};
  const recentOrders = data?.recent_orders || [];

  const dashboardCards = [
    {
      icon: <ShoppingBag size={20} />,
      title: "Total Orders",
      number: counters.total_orders || 0,
      color: "orange",
    },
    {
      icon: <LayoutDashboard size={20} />,
      title: "Total Revenue",
      number: Math.round(revenue.total || 0),
      color: "purple",
    },
    {
      icon: <Users size={20} />,
      title: "Total Users",
      number: counters.total_users || 0,
      color: "blue",
    },
    {
      icon: <UtensilsCrossed size={20} />,
      title: "Active Products",
      number: counters.total_available_items || 0,
      color: "gray",
    },
  ];

  return (
    <div>
      <main>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              icon={card.icon}
              title={card.title}
              number={card.number}
              color={card.color}
            />
          ))}
        </section>

        <div className="flex flex-col xl:flex-row gap-8 md:gap-10">
          <section className="flex-[2] overflow-x-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-content-paragraph">Recent Orders</h2>
              <button onClick={() => navigate("/orders-management")} className="text-brand-hover text-sm font-bold hover:text-brand-hover hover:underline transition-all">
                View All
              </button>
            </div>
            <div className="bg-ui-white rounded-2xl border border-ui-border overflow-hidden min-w-[600px] md:min-w-full">
              <table className="w-full text-center">
                <thead className="bg-brand-primary text-white text-sm font-bold uppercase">
                  <tr>
                    <th className="py-5 px-4">Order ID</th>
                    <th className="py-5 px-4">Customer</th>
                    <th className="py-5 px-4">Amount</th>
                    <th className="py-5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-16">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-400 text-sm font-medium">Loading recent orders...</span>
                        </div>
                      </td>
                    </tr>
                  ) : dashboardError ? (
                    <tr>
                      <td colSpan={4} className="text-center py-16">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="bg-red-50 p-3 rounded-full">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                          </div>
                          <span className="text-red-500 text-sm font-medium">{dashboardError}</span>
                          <button
                            onClick={refetchDashboard}
                            className="flex items-center gap-2 mt-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Retry
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-16 text-gray-400 text-sm font-medium">
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <DashboardRow
                        key={order.id}
                        OrderID={formatOrderId(order.id)}
                        Customer={order.user_name}
                        Amount={formatPrice(order.total_amount)}
                        Status={STATUS_MAP[order.status] || order.status}
                        statusKey={order.status}
                      />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-content-paragraph mb-6">Quick Actions</h2>
            <button onClick={() => navigate("/manage-menu", { state: { openAddModal: true } })} className="w-full h-32 bg-brand-primary text-white rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:bg-brand-hover">
              <div className="bg-ui-white/20 p-3 rounded-2xl">
                <Plus size={28} />
              </div>
              <span className="font-bold text-sm md:text-base">
                New Product
              </span>
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}

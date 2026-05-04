import { Plus } from "lucide-react";
import { DashboardCards, OrdersData, TheadTabels } from "../../data/mockData";
import DashboardCard from "../../components/admin/DashboardCard"
import DashboardRow from "../../components/admin/DashboardRow"
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <main>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12">
          {DashboardCards.map((Card, index) => (
            <DashboardCard
              key={index}
              icon={Card.icon}
              title={Card.title}
              number={Card.number}
              rate={Card.rate}
              color={Card.color}
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
            <div className="bg-ui-white rounded-2xl  border border-ui-border overflow-hidden min-w-[600px] md:min-w-full">
              <table className="w-full text-center">
                <thead className="bg-brand-primary text-white text-sm font-bold uppercase">
                  <tr>
                    {TheadTabels.DashboardOrders.map((th, index) => (
                      <th key={index} className="py-5 px-4">{th}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {OrdersData.map((order, index) =>
                    <DashboardRow
                      key={index}
                      OrderID={order.id}
                      Customer={order.customer}
                      Amount={order.amount}
                      Status={order.status}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="flex-1">
            <h2 className="text-xl md:text-2xl font-bold text-content-paragraph mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 xl:grid-cols-1 gap-4">
              <button onClick={() => navigate("/manage-menu")} className="w-full h-32 bg-brand-primary text-white rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:bg-brand-hover">
                <div className="bg-ui-white/20 p-3 rounded-2xl">
                  <Plus size={28} />
                </div>
                <span className="font-bold text-sm md:text-base">
                  New Product
                </span>
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

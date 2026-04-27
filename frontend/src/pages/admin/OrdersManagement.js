import { OrdersCards, OrdersData, TheadTabels } from "../../data/mockData";
import OrderRow from "../../components/admin/OrderRow";
import OrdersCard from "../../components/admin/OrdersCard";
import Pagination from "../../components/common/Pagination";

export default function OrdersManagement() {

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
        {OrdersCards.map((card, index) => (
          <OrdersCard
            key={index}
            icon={card.icon}
            title={card.title}
            value={card.value}
            color={card.color}
          />
        ))}
      </div>

      <div className="bg-ui-white rounded-2xl  border border-ui-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-brand-primary text-white text-sm text-center font-bold uppercase">
              <tr>
                {TheadTabels.Orders.map((th, index) => (
                  <th key={index} className="py-5 px-6">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {OrdersData.map((order, index) =>
                <OrderRow
                  key={index}
                  OrderID={order.id}
                  Customer={order.customer}
                  Amount={order.amount}
                  Status={order.status}
                  Date={order.date}
                />
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={1} totalPages={6} totalItems={24} itemsPerPage={4} itemName="orders" />
      </div>
    </div>
  );
}

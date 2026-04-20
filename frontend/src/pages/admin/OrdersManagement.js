import OrderRow from "../../components/admin/OrderRow";
import OrdersCard from "../../components/admin/OrdersCard";

export default function OrdersManagement() {
  return (
    <>
      <header>
        <h1>Orders Management</h1>
        <p>
          Monitor and process incoming customer requests. Manage delivery logistics
          and kitchen preparation status in real-time.
        </p>
      </header>

      <section>
        <OrdersCard title="Total Orders" number={12000} rate={10} />
        <OrdersCard title="Pending Orders" number={12000} rate={10} />
        <OrdersCard title="Completed Orders" number={12000} rate={10} />
        <OrdersCard title="Cancelled Orders" number={12000} rate={10} />
      </section>

      <section>
        <div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Change Status</th>
              </tr>
            </thead>
            <tbody>
              <OrderRow OrderID={1} Customer="John Doe" Amount={12000} Status="Pending" Date="2022-01-01" />
              <OrderRow OrderID={2} Customer="John Doe" Amount={12000} Status="Pending" Date="2022-01-01" />
              <OrderRow OrderID={3} Customer="John Doe" Amount={12000} Status="Pending" Date="2022-01-01" />
              <OrderRow OrderID={4} Customer="John Doe" Amount={12000} Status="Pending" Date="2022-01-01" />
              <OrderRow OrderID={5} Customer="John Doe" Amount={12000} Status="Pending" Date="2022-01-01" />
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

import { Plus } from "lucide-react";
import DashboardCard from "../../components/admin/DashboardCard"
import DashboardRow from "../../components/admin/DashboardRow"

export default function Dashboard() {
  return (
    <>
      <div>
        <DashboardCard icon={Plus} title={"Total Revenue"} number={12000} rate={10} />
        <DashboardCard icon={Plus} title={"Total Orders"} number={12000} rate={10} />
        <DashboardCard icon={Plus} title={"Total Products"} number={12000} rate={10} />
        <DashboardCard icon={Plus} title={"Total Users"} number={12000} rate={10} />
      </div>

      <div>
        <section>
          <div>
            <h2>Recent Orders</h2>
            <button>
              View All
            </button>
          </div>

          <div>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <DashboardRow OrderID={1} Customer="John Doe" Amount={12000} Status="Pending" />
                <DashboardRow OrderID={2} Customer="John Doe" Amount={12000} Status="Pending" />
                <DashboardRow OrderID={3} Customer="John Doe" Amount={12000} Status="Pending" />
                <DashboardRow OrderID={4} Customer="John Doe" Amount={12000} Status="Pending" />
                <DashboardRow OrderID={5} Customer="John Doe" Amount={12000} Status="Pending" />
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2>Quick Actions</h2>
          <div>
            <button>
              <div>
                <Plus size={28} />
              </div>
              <span>
                New Product
              </span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

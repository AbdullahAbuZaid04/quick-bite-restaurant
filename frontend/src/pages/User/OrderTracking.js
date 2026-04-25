import { SlidersHorizontal } from 'lucide-react';
import Navbar from '../../components/common/Navbar';

export default function OrderTracking() {
  return (
    <main>
      <Navbar />

      <section>
        {/* Hero Section */}
        <div>
          <h1>Track Your Orders</h1>
          <p>
            Monitor your active and previous orders in one place. We ensure your culinary
            experience is seamless from kitchen to doorstep.
          </p>
        </div>

        {/* Table Section */}
        <div>
          <div>
            <h2>Recent Orders</h2>
            <div>
              <span>Last 30 Days</span>
              <SlidersHorizontal size={14} className="cursor-pointer" />
            </div>
          </div>

          {/* Actual Table */}
          <div>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Items Count</th>
                  <th>Total Price</th>
                  <th>Status</th>
                  <th>Est. Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#12345</td>
                  <td>25-04-2026</td>
                  <td>2</td>
                  <td>$12.99</td>
                  <td>
                    <span>
                      CONFIRMED
                    </span>
                  </td>
                  <td>25-35 min</td>
                  <td>
                    Track Order
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer of Table */}
          <div>
            <button>
              Load more order history
            </button>
          </div>
        </div>
      </section>
    </main >
  );
};


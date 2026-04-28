import { SlidersHorizontal, Search, ChevronRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { OrderTrackingData } from '../../data/mockData';

export default function OrderTracking() {
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
                Monitor your active and previous orders in one place. We ensure your culinary
                experience is seamless from kitchen to doorstep.
              </p>
            </div>

            <div className="relative group max-w-xs w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={20} />
              <input
                type="text"
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
              <button className="flex items-center gap-2 px-4 py-2 bg-ui-mainBg rounded-xl text-[11px] text-content-paragraph font-bold border border-ui-border hover:bg-gray-100 transition-colors">
                <span>Filter: Last 30 Days</span>
                <SlidersHorizontal size={14} />
              </button>
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
                      <th className="py-5 px-6">Arrival</th>
                      <th className="py-5 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {OrderTrackingData.map((order, idx) => (
                      <tr key={idx} className="border-b border-ui-border text-center hover:bg-ui-mainBg transition-all">
                        <td className="px-6 py-5 font-black text-content-paragraph">{order.id}</td>
                        <td className="px-6 py-5 text-content-subtitle font-medium">{order.date}</td>
                        <td className="px-6 py-5 font-bold text-content-paragraph">
                          <span className="bg-ui-mainBg px-3 py-1.5 rounded-lg border border-ui-border">{order.items} items</span>
                        </td>
                        <td className="px-6 py-5 font-black text-brand-primary text-base">{order.total}</td>
                        <td className="px-6 py-5">
                          <span className={`px-4 py-1.5 mx-auto rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 w-fit border ${order.statusColor}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold text-content-paragraph">
                          {order.estTime}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button className="relative mx-auto text-brand-primary font-bold group">
                            {order.action}
                            <span className="absolute bottom-0 left-0 w-0 h-[2px] group-hover:w-full bg-brand-primary rounded-xl transition-all duration-300"></span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="p-8 text-center bg-gray-50/30 border-t border-ui-mainBg">
              <button className="text-xs font-bold text-content-subtitle hover:text-brand-primary transition-colors flex items-center gap-2 mx-auto">
                View All Order History
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
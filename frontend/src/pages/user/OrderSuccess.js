import { Check, Home, ArrowRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../../context/cartContext';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { cartTotalTime, clearCart, cartItems, cartTotal } = useCart()

  if (!cartItems) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-ui-mainBg pb-20">
      <Navbar />

      <main className="max-w-xl mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center text-center">

        <div className="mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="text-white" size={32} strokeWidth={4} />
            </div>
          </div>
        </div>

        {/* Text Header */}
        <h1 className="text-4xl font-bold text-content-paragraph mb-3">
          Order Placed!
        </h1>
        <p className="text-content-subtitle text-sm">
          Your food is being prepared with love. Order <span className="text-brand-primary font-bold">#QB-{Math.floor(Math.random() * 10000)}</span> is on the way.
        </p>

        {/* Info Card */}
        <div className="w-full mt-12 bg-ui-white rounded-2xl border border-ui-border overflow-hidden">

          {/* Top Row: Total & Delivery */}
          <div className="flex justify-between px-8 py-8 border-b border-ui-mainBg bg-gray-50/50">
            <div className="text-left">
              <span className="text-[10px] font-bold text-content-paragraph uppercase tracking-[0.2em] block mb-1">Total Paid</span>
              <span className="text-2xl font-black text-brand-primary">${cartTotal?.toFixed(2)}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-content-paragraph uppercase tracking-[0.2em] block mb-1">Est. Arrival</span>
              <span className="text-xl font-black text-brand-primary">{cartTotalTime} mins</span>
            </div>
          </div>

          {/* Items List */}
          <div className="p-6 space-y-3">
            <h3 className="text-[10px] font-bold text-content-subtitle uppercase tracking-widest text-left px-2 mb-4">Order Details</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover " />
                    <span className="absolute -top-2 -right-2 bg-brand-primary text-ui-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-ui-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="text-sm font-bold text-content-title">{item.name}</h4>
                    <span className="text-xs text-content-subtitle">Extra spicy • No onions</span>
                  </div>
                </div>
                <span className="text-xs uppercase font-black text-status-delivered bg-status-delivered/10 px-3 py-1.5 rounded-lg border border-status-delivered/20">
                  confirmed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          <button onClick={() => { clearCart(); navigate("/") }} className="flex items-center justify-center gap-2 bg-ui-white text-content-paragraph border-2 border-content-paragraph px-10 py-4 rounded-2xl font-bold hover:bg-content-paragraph hover:text-white transition-all active:scale-95">
            <Home size={18} />
            Back to Home
          </button>

          <button onClick={() => { clearCart(); navigate("/order-tracking") }} className="flex items-center justify-center gap-2 bg-brand-primary text-ui-white py-5 rounded-2xl font-bold text-sm hover:bg-brand-hover transition-all transform active:scale-95 group">
            Track My Order
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </main>
    </div>
  );
}


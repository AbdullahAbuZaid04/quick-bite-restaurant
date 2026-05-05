import { ArrowRight, CheckCircle2, ArrowLeftRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/cartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

export default function Checkout() {
  const { cartItems, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else {
      navigate('/order-success');
    }
  }


  return (
    <div className="min-h-screen bg-ui-mainBg pb-12">
      <Navbar />

      <main className="max-w-xl mx-auto mt-8 md:mt-12 px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-content-paragraph mb-10 tracking-tight">
          Checkout
        </h1>

        <section className="bg-ui-white rounded-2xl p-8 mb-6 border border-ui-border">
          <h2 className="text-xs font-black text-content-subtitle uppercase tracking-[0.2em] mb-4">Payment Method</h2>
          <div className="flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer border-brand-primary bg-white">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-ui-mainBg rounded-xl"><ArrowLeftRight size={20} className="text-content-paragraph" /></div>
              <p className="text-sm font-bold text-content-paragraph">Bank Transfer</p>
            </div>
            <CheckCircle2 size={22} className="text-brand-primary" />
          </div>
        </section>

        <section className="bg-ui-white rounded-2xl p-8 border border-ui-border">
          <h2 className="text-xs font-black text-content-subtitle uppercase tracking-[0.2em] mb-8">Order Summary</h2>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="relative">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-2xl object-cover border border-ui-border" />
                    <span className="absolute -top-2 -right-2 bg-brand-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-content-paragraph">{item.name}</h4>
                    <span className="text-xs text-brand-primary font-medium"> Quantity: {item.quantity}</span>
                  </div>
                </div>
                <span className="text-sm font-bold text-content-paragraph">${(item.price * item.quantity).toFixed(2)}</span>

              </div>
            ))}
          </div>

          <div className="border-t border-content-paragraph mt-8 pt-6 flex justify-between items-center">
            <span className="text-sm font-bold text-content-paragraph uppercase tracking-wider">Total Amount</span>
            <span className="text-3xl font-black text-brand-primary">${cartTotal.toFixed(2)}</span>
          </div>
        </section>

        <button onClick={handlePlaceOrder} className="w-full mt-10 bg-brand-primary text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-brand-hover transition-all transform active:scale-95 cursor-pointer">
          Place Order
          <ArrowRight size={22} />
        </button>
      </main>
    </div>
  );
}
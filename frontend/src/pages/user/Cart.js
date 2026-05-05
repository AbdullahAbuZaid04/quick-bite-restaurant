import { Trash2, ArrowRight, Minus, Plus, Clock, ChevronLeft } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/cartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, clearItemFromCart, cartTotal, addToCart, removeFromCart, cartTotalTime } = useCart();
  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-ui-mainBg">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <section className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-ui-white rounded-xl border border-ui-border hover:bg-brand-primary transition-all duration-300 group">
            <ChevronLeft size={20} className="text-content-paragraph group-hover:text-white" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-content-paragraph">Your Cart</h1>
            <p className="text-content-subtitle text-sm">You have {cartItems.length} items in your tray</p>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <section className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <div className='w-full p-20 flex flex-col justify-center items-center gap-3 bg-white rounded-2xl border border-ui-border'>
                <h1 className='text-3xl font-bold text-content-paragraph'>Your cart is empty</h1>
                <p className='text-content-subtitle'>Add items to your cart to checkout</p>
                <button onClick={() => navigate('/menu')} className='bg-brand-primary text-ui-white px-4 py-2 rounded-full hover:bg-brand-hover active:scale-95 transition-all duration-300'>Add Items</button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="group relative flex items-center gap-4 p-4 rounded-2xl bg-ui-white border border-ui-border hover:border-brand-primary/50 transition-all">

                  <div className="relative overflow-hidden rounded-2xl w-24 h-24">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-content-paragraph mb-1">{item.name}</h3>
                        <p className="text-xs text-content-subtitle mb-3">Extra sauce, no onions</p>
                      </div>
                      <button onClick={() => clearItemFromCart(item)} className="text-content-subtitle hover:text-red-500 transition-colors duration-200 p-1">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-auto">
                      <div className="flex items-center gap-3 bg-ui-mainBg border border-ui-border rounded-xl p-1">
                        <button onClick={() => removeFromCart({ ...item, quantity: item.quantity - 1 })} className="w-7 h-7 flex items-center justify-center bg-ui-white rounded-lg border border-ui-border text-content-paragraph hover:bg-brand-primary hover:text-ui-white transition-all cursor-pointer duration-300">
                          {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                        </button>
                        <span className="text-sm font-bold w-6 text-center text-content-paragraph">{item.quantity}</span>
                        <button onClick={() => addToCart({ ...item, quantity: item.quantity + 1 })} className="w-7 h-7 flex items-center justify-center bg-ui-white rounded-lg border border-ui-border text-content-paragraph hover:bg-brand-primary hover:text-ui-white transition-all cursor-pointer duration-300">
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="text-brand-primary font-bold text-lg">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="lg:col-span-1">
            <div className="sticky top-24 bg-ui-white border border-ui-border rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-content-paragraph mb-6">Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="pt-4 border-t border-ui-mainBg flex justify-between items-end">
                  <div>
                    <p className="text-xs font-bold text-brand-primary uppercase tracking-[0.2em] mb-1">Total to pay</p>
                    <p className="text-4xl font-black text-content-paragraph">${(cartTotal).toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-ui-mainBg rounded-2xl mb-8 border border-ui-border/50">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-content-subtitle uppercase tracking-wider">Estimated Time</p>
                  <p className="text-sm font-bold text-content-paragraph">{cartTotalTime} mins</p>
                </div>
              </div>

              {cartItems.length > 0 &&
                <button onClick={() => navigate('/checkout')} className="w-full bg-brand-primary text-ui-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-brand-hover transition-all active:scale-95 group disabled:bg-brand-disabled">
                  Checkout Now
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              }
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}
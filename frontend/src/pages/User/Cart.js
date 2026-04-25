import { Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import img1 from '../../assets/ManageMenu1.png';

export default function Cart() {

  return (
    <main>
      <Navbar />
      <section>
        <h1>Your Cart</h1>
        <p>Review your selections before checkout</p>

        <div>
          <div key={1}>
            <div>
              <img src={img1} alt="name" />
              <div>
                <h3>Classic Burger</h3>
                <div>
                  <button><Minus size={12} /></button>
                  <span>1</span>
                  <button><Plus size={12} /></button>
                </div>
              </div>
            </div>

            <div>
              <span>$12.99</span>
              <button>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <h2>Order Summary</h2>

          <div>
            <span>Subtotal</span>
            <span>$12.99</span>
          </div>

          <div>
            <div>
              <span>Total Amount</span>
              <div>$12.99</div>
            </div>
            <div>
              <span>Estimated delivery</span>
              <span>25-35 min</span>
            </div>
          </div>
        </div>

        <button>
          Proceed to Checkout
          <ArrowRight size={20} />
        </button>
      </section>
    </main>
  );
};


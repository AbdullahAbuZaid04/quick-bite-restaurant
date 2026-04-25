import { CreditCard, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import img1 from '../../assets/ManageMenu1.png';

export default function Checkout() {

  return (
    <main >
      <Navbar />

      <section>
        <h1>Checkout</h1>

        <section>
          <h2>Payment Method</h2>
          <div>
            <div>
              <div>
                <div><CreditCard size={18} /></div>
                <div>
                  <p>Credit Card</p>
                  <p>**** **** **** 4582</p>
                </div>
              </div>
              <CheckCircle2 size={20} className="text-orange-500" />
            </div>

            <div>
              <div>
                <div><Wallet size={18} /></div>
                <p>BOP Pay</p>
              </div>
              <CheckCircle2 size={20} className="text-orange-500" />
            </div>
          </div>
        </section>

        <section>
          <h2>Order Summary</h2>

          <div>
            <div key={1}>
              <div>
                <img src={img1} alt="name" />
                <div>
                  <h4>Classic Burger</h4>
                  <span>Quantity: 1</span>
                </div>
              </div>
              <span>$12.99</span>
            </div>
          </div>

          <div>
            <span>Total</span>
            <span>$12.99</span>
          </div>
        </section>

        <button>
          Place Order
          <ArrowRight size={20} />
        </button>
      </section>
    </main>
  );
};


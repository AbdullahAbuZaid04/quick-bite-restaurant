import { Check } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import img1 from '../../assets/ManageMenu1.png';

export default function OrderSuccess() {

  return (
    <main>
      <Navbar />

      <section>
        <div>
          <div>
            <Check size={28} />
          </div>
        </div>

        <h1>Order Placed Successfully!</h1>
        <p>
          Thank you for your purchase. Your order <span>#12345</span> is being processed.
        </p>
        <div>
          <div>
            <div>
              <span>Order Total</span>
              <span>$49.50</span>
            </div>
            <div>
              <span>Est. Delivery</span>
              <span>25-35 mins</span>
            </div>
          </div>

          <div>
            <div key={1}>
              <div>
                <img src={img1} alt="food" />
                <div>
                  <h4>Classic Burger</h4>
                  <span>Quantity: 1</span>
                </div>
              </div>
              <span>
                CONFIRMED
              </span>
            </div>
          </div>
        </div>

        <div>
          <button>
            Track Order
          </button>
          <button>
            Back to Home
          </button>
        </div>
      </section>
    </main>
  );
};


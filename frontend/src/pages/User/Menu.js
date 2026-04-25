import { Search, Plus, ArrowRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import img1 from '../../assets/ManageMenu1.png';

export default function Menu() {

  return (
    <main>
      <Navbar />

      <header>
        <div>
          <h1>Our Culinary Selection</h1>
          <p>
            Curated dishes prepared with seasonal ingredients by our master chefs.
          </p>
        </div>
        <div>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search your cravings..."
          />
        </div>
      </header>

      <div>
        <button>
          All
        </button>
        <button>
          Burgers
        </button>
        <button>
          Pizza
        </button>
        <button>
          Pasta
        </button>
        <button>
          Desserts
        </button>
      </div>

      <main>
        <div>
          <div>
            <img src={img1} alt="Classic Burger" />
          </div>

          <div>
            <div>
              <span>Burgers</span>
              <span>$12.99</span>
            </div>
            <h3>Classic Burger</h3>
            <p>
              A timeless classic with premium beef, fresh lettuce, tomatoes, and our secret sauce.
            </p>

            <div>
              <button>
                View Details <ArrowRight size={14} />
              </button>
              <button>
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </main>
  );
};
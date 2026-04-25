import Navbar from "../../components/common/Navbar";
import pizzaImg from "../../assets/Pizza.png";

export default function Home() {
  return (
    <main>
      <Navbar />

      <section>
        <div>
          <h1>
            <span>Quick Bite,</span> <br />
            Fast Food, <br />
            Faster Ordering
          </h1>

          <p>
            A smart restaurant ordering system that lets users browse menus,
            place orders, and track deliveries in real time with ease.
          </p>

          <div>
            <button>
              Order Now
            </button>
            <button>
              Explore Menu
            </button>
          </div>
        </div>

        {/* Right Side: Image with Styled Background */}
        <div>
          <img
            src={pizzaImg}
            alt="Delicious Pizza"
          />
        </div>
      </section>
    </main>
  );
};


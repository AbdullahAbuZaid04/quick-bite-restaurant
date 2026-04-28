import Navbar from "../../components/common/Navbar";
import pizzaImg from "../../assets/home.png";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-ui-mainBg">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">

        <section className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-content-paragraph tracking-tighter">
            <span className="text-brand-primary">Quick Bite,</span><br />Fast Food,<br />Faster Ordering
          </h1>

          <p className="text-content-paragraph text-base md:text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
            A smart restaurant ordering system that lets users browse menus, place orders, and track deliveries in real-time with ease.
          </p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <Link to="/menu" className="w-full sm:w-auto bg-brand-primary text-white px-10 py-4 rounded-2xl font-bold hover:bg-brand-hover transition-all active:scale-95 cursor-pointer">
              Order Now
            </Link>
            <Link to="/menu" className="w-full sm:w-auto border-2 border-content-paragraph text-content-paragraph px-10 py-4 rounded-2xl font-bold hover:bg-content-paragraph hover:text-white transition-all active:scale-95 cursor-pointer">
              Explore Menu
            </Link>
          </div>
        </section>

        <section className="hidden lg:flex flex-1">
          <img
            src={pizzaImg}
            alt="Delicious Pizza"
            className="w-full h-full object-contain rotate-1 hover:-rotate-2 transition-transform duration-500"
          />
        </section>

      </main>
    </div>
  );
}
import { ShoppingCart, Utensils, Menu } from "lucide-react";

export default function Navbar() {

  return (
    <header className="flex justify-between bg-ui-white items-center py-4 px-4 md:px-12 relative z-50">
      <div className="flex items-center gap-2">
        <Utensils className="text-brand-primary" size={26} strokeWidth={2.5} />
        <button to="/" className="text-brand-primary text-xl md:text-2xl font-extrabold tracking-tight">
          Quick Bite
        </button>
      </div>

      <nav className="hidden md:block">
        <ul className="flex gap-8">
          <li>
            <button to="/" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
              Home
            </button>
          </li>
          <li>
            <button to="/menu" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
              Menu
            </button>
          </li>
          <li>
            <button to="/order-tracking" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
              Track Order
            </button>
          </li>
          <li>
            <button to="/dashboard" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
              Dashboard
            </button>
          </li>
        </ul>
      </nav>

      <div className="hidden md:flex justify-center items-center gap-4">
        <button>
          <ShoppingCart className="text-content-paragraph hover:text-brand-hover transition-colors cursor-pointer" />
        </button>

        <button
          className="bg-brand-primary text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-brand-hover transition-colors"
        >
          Logout
        </button>
        <p className="flex flex-col text-content-paragraph text-sm font-semibold">
          Hello <span className="text-brand-primary">{"name"}</span>
        </p>

      </div>

      <div className="md:hidden flex items-center gap-4">
        <button>
          <ShoppingCart className="text-gray-600 hover:text-orange-500 transition-colors cursor-pointer" size={22} />
        </button>
        <p className="flex flex-col text-gray-600 text-sm font-semibold">
          Hello <span className="text-orange-500">{"name"}</span>
        </p>
        <button className="text-gray-600">
          <Menu size={26} />
        </button>
      </div>
    </header>
  );
}

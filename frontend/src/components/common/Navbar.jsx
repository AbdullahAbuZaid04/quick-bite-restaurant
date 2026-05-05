import { ShoppingCart, Utensils, Menu, LogOut, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";
import { useAuth } from "../../context/authContext";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, clearCart } = useCart();
  const { user, logout, isLoggedIn } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/login");
  };

  return (
    <header className="flex justify-between bg-ui-white items-center py-4 px-4 md:px-12 relative z-50">
      <div className="flex items-center gap-2">
        <Utensils className="text-brand-primary" size={26} strokeWidth={2.5} />
        <Link to="/" className="text-brand-primary text-xl md:text-2xl font-extrabold tracking-tight">
          Quick Bite
        </Link>
      </div>

      <nav className="hidden md:block">
        <ul className="flex gap-8">
          <li>
            <Link to="/" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link to="/menu" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
              Menu
            </Link>
          </li>
          <li>
            <Link to="/order-tracking" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
              Track Order
            </Link>
          </li>
        </ul>
      </nav>

      <div className="hidden md:flex justify-center items-center gap-4">
        <div className="relative top-2">
          <button onClick={() => navigate('/cart')}>
            <ShoppingCart className="text-content-paragraph hover:text-brand-hover transition-colors cursor-pointer" />
          </button>
          <span className="absolute -top-3 -right-0 rounded-full bg-brand-primary text-ui-white text-xs px-1">
            {cartCount}
          </span>
        </div>

        {isLoggedIn ? (
          <>
            <p className="flex flex-col text-content-paragraph text-center text-sm font-semibold">
              Hello <span className="text-brand-primary">{user?.name || "User"}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-brand-primary text-white text-sm font-semibold px-2 py-2 rounded-full hover:bg-brand-hover transition-colors"
            >
              <LogOut />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-brand-primary text-white text-sm font-semibold px-2 py-2 rounded-full hover:bg-brand-hover transition-colors"
          >
            <LogIn />
          </button>
        )}
      </div>

      <div className="md:hidden flex items-center gap-4">
        <div className="relative">
          <button onClick={() => navigate('/cart')}>
            <ShoppingCart className="text-content-paragraph hover:text-brand-hover transition-colors cursor-pointer" />
          </button>
          <span className="absolute -top-3 -right-0 rounded-full bg-brand-primary text-ui-white text-xs px-1">
            {cartCount}
          </span>
        </div>

        {isLoggedIn && (
          <p className="flex flex-col text-gray-600 text-sm font-semibold">
            Hello <span className="text-orange-500">{user?.name || "User"}</span>
          </p>
        )}
        <button onClick={toggleMenu} className="text-gray-600">
          <Menu size={26} />
        </button>
        <div className="md:hidden flex gap-4">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-brand-primary text-white text-sm font-semibold px-2 py-2 rounded-full hover:bg-brand-hover transition-colors"
            >
              <LogOut />
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-brand-primary text-white text-sm font-semibold px-2 py-2 rounded-full hover:bg-brand-hover transition-colors"
            >
              <LogIn />
            </button>
          )}
        </div>
        <div className={isMenuOpen ? "absolute top-20 left-0 w-full bg-white shadow-lg p-6 transition-all duration-300 ease-in-out transform origin-top scale-y-100" : "absolute top-20 left-0 w-full bg-white shadow-lg p-6 transition-all duration-300 ease-in-out transform origin-top scale-y-0"}>
          <ul className="flex flex-col gap-4">
            <li>
              <Link to="/" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/menu" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/order-tracking" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
                Track Order
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}


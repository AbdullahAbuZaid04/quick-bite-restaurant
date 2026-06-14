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
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:font-bold">
        Skip to main content
      </a>
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
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <li>
              <Link to="/dashboard" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
                Dashboard
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="hidden md:flex justify-center items-center gap-4">
        <div className="relative top-2">
          <button onClick={() => navigate('/cart')} aria-label={`Shopping cart with ${cartCount} items`}>
            <ShoppingCart className="text-content-paragraph hover:text-brand-hover transition-colors cursor-pointer" />
          </button>
          <span aria-live="polite" aria-atomic="true" className="absolute -top-3 -right-0 rounded-full bg-brand-primary text-ui-white text-xs px-1">
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
              aria-label="Logout"
              className="bg-brand-primary text-white text-sm font-semibold px-2 py-2 rounded-full hover:bg-brand-hover transition-colors"
            >
              <LogOut />
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            aria-label="Login"
            className="bg-brand-primary text-white text-sm font-semibold px-2 py-2 rounded-full hover:bg-brand-hover transition-colors"
          >
            <LogIn />
          </button>
        )}
      </div>

      <div className="md:hidden flex items-center gap-4">
        <div className="relative">
          <button onClick={() => navigate('/cart')} aria-label={`Shopping cart with ${cartCount} items`}>
            <ShoppingCart className="text-content-paragraph hover:text-brand-hover transition-colors cursor-pointer" />
          </button>
          <span aria-live="polite" aria-atomic="true" className="absolute -top-3 -right-0 rounded-full bg-brand-primary text-ui-white text-xs px-1">
            {cartCount}
          </span>
        </div>

        {isLoggedIn && (
          <p className="flex flex-col text-content-paragraph text-sm font-semibold">
            Hello <span className="text-brand-primary">{user?.name || "User"}</span>
          </p>
        )}
        <button onClick={toggleMenu} className="text-content-paragraph" aria-expanded={isMenuOpen} aria-label="Toggle navigation menu">
          <Menu size={26} />
        </button>
        <div id="mobile-menu" className={isMenuOpen ? "absolute top-20 left-0 w-full bg-white shadow-lg p-6 transition-all duration-300 ease-in-out transform origin-top scale-y-100" : "absolute top-20 left-0 w-full bg-white shadow-lg p-6 transition-all duration-300 ease-in-out transform origin-top scale-y-0"}>
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
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <li>
                <Link to="/dashboard" className="text-content-paragraph text-sm font-semibold hover:text-brand-hover transition-colors">
                  Dashboard
                </Link>
              </li>
            )}
            <li className="border-t border-ui-border pt-4 mt-2">
              {isLoggedIn ? (
                <button
                  onClick={() => { toggleMenu(); handleLogout(); }}
                  className="flex items-center gap-3 text-red-500 text-sm font-bold hover:text-red-600 transition-colors w-full"
                >
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <button
                  onClick={() => { toggleMenu(); navigate("/login"); }}
                  className="flex items-center gap-3 text-brand-primary text-sm font-bold hover:text-brand-hover transition-colors w-full"
                >
                  <LogIn size={18} /> Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </header>
    </>
  );
}


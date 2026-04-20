import { ShoppingCart, Utensils } from "lucide-react";

export default function Navbar() {
  return (
    <header>
      <div>
        <Utensils size={26} strokeWidth={2.5} />
        <strong>Quick Bite</strong>
      </div>
      <nav>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#menu">Menu</a></li>
          <li><a href="#track">Track Order</a></li>
          <li><a href="#dashboard">Dashboard</a></li>
        </ul>
      </nav>

      <div>
        <button type="button" aria-label="Cart">
          <ShoppingCart size={22} />
        </button>
        <button type="button">
          Login
        </button>
      </div>
    </header>
  );
}

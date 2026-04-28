import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function NavItem({ icon, label, link }) {
  const location = useLocation();
  const active = location.pathname.includes(link);

  return (
    <Link
      to={`/${link}`}
      className={`flex items-center gap-3 w-44 text-sm font-medium rounded-xl p-4 transition-all duration-200 ${active
        ? "bg-brand-primary text-white"
        : "text-content-subtitle hover:bg-brand-light hover:text-brand-primary"
        }`}
    >
      {icon} <span className="font-bold text-sm">{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }) {

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", link: "dashboard", active: true },
    { icon: <UtensilsCrossed size={20} />, label: "Manage Menu", link: "manage-menu", active: false },
    { icon: <ShoppingBag size={20} />, label: "Orders", link: "orders-management", active: false },
    { icon: <Users size={20} />, label: "Users", link: "users-management", active: false },
  ];

  return (
    <div className="min-h-screen bg-ui-mainBg">

      <aside className="fixed inset-y-0 left-0 z-50 w-72 bg-ui-white border-r border-ui-border p-6 flex flex-col transition-all duration-300 ease-in-out">
        <div className="hidden md:flex items-center gap-3 text-content-paragraph font-bold text-xl mb-12 border-b border-ui-border py-4">
          <div className="bg-brand-primary p-2 rounded-xl text-white">
            <UtensilsCrossed size={22} />
          </div>
          Quick Bite
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              link={item.link}
              active={item.active}
            />
          ))}
        </nav>
      </aside>

      <main className="ml-72 flex-1 flex flex-col min-h-screen pt-20 md:pt-0 overflow-x-hidden">
        <div className="flex-1 p-4 sm:p-8 md:p-10 w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

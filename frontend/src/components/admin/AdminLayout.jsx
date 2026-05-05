import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, LogOut, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { useState } from "react";

function NavItem({ icon, label, link, onClick }) {
  const location = useLocation();
  const active = location.pathname === `/${link}`;

  return (
    <Link
      to={`/${link}`}
      onClick={onClick}
      className={`flex items-center gap-3 w-full text-sm font-bold rounded-2xl px-5 py-4 transition-all duration-300 ${active
        ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-[1.02]"
        : "text-content-subtitle hover:bg-brand-light hover:text-brand-primary"
        }`}
    >
      <span className={`${active ? "text-white" : "text-brand-primary"}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", link: "dashboard" },
    { icon: <UtensilsCrossed size={20} />, label: "Manage Menu", link: "manage-menu" },
    { icon: <ShoppingBag size={20} />, label: "Orders", link: "orders-management" },
    { icon: <Users size={20} />, label: "Users", link: "users-management" },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-ui-mainBg flex overflow-x-hidden">
      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-ui-white border-r border-ui-border p-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between mb-10 pb-6 border-b border-ui-border">
          <div className="flex items-center gap-3 text-content-paragraph font-black text-xl">
            <div className="bg-brand-primary p-2 rounded-xl text-white shadow-lg shadow-brand-primary/20">
              <UtensilsCrossed size={22} />
            </div>
            Quick Bite
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-content-paragraph p-2 hover:bg-ui-mainBg rounded-xl transition-colors">
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              link={item.link}
              onClick={() => setIsSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="pt-6 border-t border-ui-border mt-auto">
          <div className="bg-ui-mainBg p-4 rounded-2xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-content-paragraph truncate max-w-[120px]">{user?.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-brand-primary text-white p-2.5 rounded-xl hover:bg-brand-hover transition-all shadow-md shadow-brand-primary/10 active:scale-95"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72 w-full max-w-full overflow-x-hidden transition-all duration-300">
        {/* Header for Mobile */}
        <header className="lg:hidden bg-ui-white h-20 border-b border-ui-border flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-3 text-content-paragraph font-black text-lg">
            <div className="bg-brand-primary p-1.5 rounded-lg text-white">
              <UtensilsCrossed size={18} />
            </div>
            Quick Bite
          </div>
          <button onClick={toggleSidebar} className="p-2 bg-ui-mainBg rounded-xl text-content-paragraph transition-all active:scale-90">
            <Menu size={24} />
          </button>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>

  );
}


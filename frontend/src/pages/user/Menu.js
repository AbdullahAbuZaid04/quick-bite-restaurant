import { useState } from 'react';
import { Search, Plus, ArrowRight } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { MenuProducts, MenuCategories } from '../../data/mockData';
import { useCart } from '../../context/cartContext';

export default function Menu() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");

  const filteredProducts = activeTab === "All"
    ? MenuProducts.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
    : MenuProducts.filter(p => p.category === activeTab && p.name.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <div className="min-h-screen bg-ui-mainBg pb-20">
      <Navbar />

      <main>
        <section className="max-w-7xl mx-auto px-6 md:px-10 mt-8 md:mt-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-content-paragraph mb-3 tracking-tight">
              Our <span className="text-brand-primary">Menu</span>
            </h1>
            <p className="text-content-paragraph text-lg leading-relaxed">
              Curated dishes prepared with seasonal ingredients by our master chefs.
            </p>
          </div>
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-content-subtitle group-focus-within:text-brand-primary transition-colors" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search your cravings..."
              className="w-full bg-ui-card py-4 pl-12 pr-4 rounded-2xl text-sm outline-none border border-ui-border focus:border-brand-primary transition-all"
            />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-10 mt-8 md:mt-10 flex gap-4 overflow-x-auto pb-4">
          {MenuCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-8 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border border-ui-border ${activeTab === cat
                ? "bg-brand-primary text-white"
                : "bg-ui-white text-content-paragraph hover:bg-brand-light hover:text-brand-primary"
                }`}
            >
              {cat}
            </button>
          ))}
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? filteredProducts.map((item) => (
            <div key={item.id} className="group relative bg-ui-white p-3 rounded-2xl border border-ui-border transition-all duration-300">
              <div className="overflow-hidden rounded-2xl mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="px-2 pb-2 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-brand-primary font-black">{item.category}</span>
                <div className="flex justify-between">
                  <h3 className="text-lg font-bold text-content-title line-clamp-1">{item.name}</h3>
                  <span className="text-brand-primary font-bold text-sm">${item.price}</span>
                </div>
                <p className="text-xs text-content-subtitle line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex justify-between items-center pt-4">
                  <button className="flex items-center gap-1 text-[11px] font-bold text-content-paragraph hover:text-brand-hover transition">
                    View Details <ArrowRight size={14} />
                  </button>
                  <button onClick={() => addToCart({ ...item, quantity: 1 })} className="bg-brand-primary text-white p-2 rounded-xl hover:bg-brand-hover transition active:scale-95">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-12 bg-ui-white rounded-2xl border border-ui-border">
              <p className="text-content-paragraph text-lg">No products found matching <span className="text-brand-primary font-bold">({searchText || activeTab})</span></p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
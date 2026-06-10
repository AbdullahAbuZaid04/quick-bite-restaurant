import { useEffect, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import { useCart } from '../../context/cartContext';
import { getAllMenu } from '../../api/menuService';
import { getAllCategories } from '../../api/categoryService';
import ProductCard from '../../components/user/ProductCard';

export default function Menu() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [menuProducts, setMenuProducts] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await getAllMenu();
        setMenuProducts(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Failed to fetch menu", err);
        setMenuProducts([]);
      }
    };
    fetchMenu();

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        const categories = Array.isArray(response.data) ? response.data : [];
        setAllCategories([{ id: 0, name: "All" }, ...categories]);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setAllCategories([{ id: 0, name: "All" }]);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!isLoading) return;
    if (menuProducts.length > 0 || allCategories.length > 0) {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuProducts, allCategories]);

  const filteredProducts = useMemo(() =>
    activeTab === "All"
      ? menuProducts.filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()))
      : menuProducts.filter(p => p.category_name === activeTab && p.name.toLowerCase().includes(searchText.toLowerCase()))
  , [menuProducts, activeTab, searchText]);

  return (
    <div className="min-h-screen bg-ui-mainBg pb-20">
      <Navbar />

      <main id="main-content">
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
              aria-label="Search menu items"
              className="w-full bg-ui-card py-4 pl-12 pr-4 rounded-2xl text-sm outline-none border border-ui-border focus:border-brand-primary transition-all"
            />
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-10 mt-8 md:mt-10 flex gap-4 overflow-x-auto pb-4">
          {allCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.name)}
              className={`px-8 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 border border-ui-border ${activeTab === cat.name
                ? "bg-brand-primary text-white"
                : "bg-ui-white text-content-paragraph hover:bg-brand-light hover:text-brand-primary"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-10 mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-ui-white p-3 rounded-2xl border border-ui-border animate-pulse">
                <div className="rounded-xl mb-3 aspect-[4/3] bg-gray-200" />
                <div className="px-1 space-y-3">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="flex justify-between">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-10 bg-gray-200 rounded" />
                  </div>
                  <div className="h-3 w-full bg-gray-200 rounded" />
                  <div className="h-3 w-3/4 bg-gray-200 rounded" />
                </div>
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-ui-border/60 px-1">
                  <div className="h-3 w-14 bg-gray-200 rounded" />
                  <div className="h-9 w-9 bg-gray-200 rounded-xl" />
                </div>
              </div>
            ))
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((item) => (
              <ProductCard key={item.id} item={item} addToCart={addToCart} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-ui-white rounded-2xl border border-ui-border">
              <p className="text-content-paragraph text-lg">No products match your search <span className="text-brand-primary font-bold">({searchText || activeTab})</span></p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
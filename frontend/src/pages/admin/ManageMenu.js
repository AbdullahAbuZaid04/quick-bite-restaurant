import { Plus } from "lucide-react";
import { MenuData, TheadTabels } from "../../data/mockData";
import MenuRow from "../../components/admin/MenuRow";
import Pagination from "../../components/common/Pagination";

export default function ManageMenu() {

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-content-paragraph">Manage Menu</h1>
          <p className="text-content-subtitle text-sm mt-2 max-w-xl">
            Manage all restaurant products, categories, pricing, and availability.
          </p>
        </div>
        <button className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-hover transition-all duration-200 text-sm">
          <Plus size={20} /> Add Product
        </button>
      </div >

      <div className="bg-ui-white rounded-2xl  border border-ui-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-brand-primary text-white text-center text-sm font-bold uppercase">
              <tr>
                {TheadTabels.Menu.map((th, index) => (
                  <th key={index} className="py-5 px-6">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MenuData.map((item, index) => (
                <MenuRow
                  key={index}
                  image={item.image}
                  name={item.name}
                  category={item.category}
                  price={item.price}
                  prepTime={item.prepTime}
                />
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={1} totalPages={6} totalItems={24} itemsPerPage={4} itemName="products" />
      </div>
    </div>
  );
}

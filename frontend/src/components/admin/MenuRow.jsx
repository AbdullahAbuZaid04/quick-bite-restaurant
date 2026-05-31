import { memo } from "react";
import { Pencil, Trash2 } from "lucide-react";

const MenuRow = memo(function MenuRow({ image, name, categoryName, price, prepTime, handleEdit, handleDelete }) {

  return (
    <tr className="border-b border-ui-border text-center hover:bg-ui-mainBg transition-colors">
      <td className="py-4 px-6">
        <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-ui-border bg-ui-mainBg">
          <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
        </div>
      </td>

      <td className="py-4 px-6 font-bold text-sm text-content-paragraph">
        {name}
      </td>

      <td className="py-4 px-6">
        <span className="bg-ui-border text-content-paragraph text-xs font-bold px-3 py-1 rounded-lg uppercase">
          {categoryName}
        </span>
      </td>

      <td className="py-4 px-6 font-bold text-brand-primary">${price}</td>

      <td className="py-4 px-6 text-content-paragraph font-medium">{prepTime} min</td>

      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={handleEdit}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
});

export default MenuRow;

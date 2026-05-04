import { PencilLine, Trash2 } from "lucide-react";

export default function MenuRow({ image, name, category, price, prepTime, handleEdit, handleDelete }) {
  return (
    <tr className="border-b border-ui-border text-center hover:bg-ui-mainBg transition-colors">
      <td className="py-4 px-6">
        <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden border border-ui-border bg-ui-mainBg">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
      </td>

      <td className="py-4 px-6 font-bold text-sm text-content-paragraph">
        {name}
      </td>

      <td className="py-4 px-6">
        <span className="bg-ui-border text-content-paragraph text-xs font-bold px-3 py-1 rounded-lg uppercase">
          {category}
        </span>
      </td>

      <td className="py-4 px-6 font-bold text-content-paragraph">${price.toFixed(2)}</td>

      <td className="py-4 px-6 text-content-paragraph font-medium">{prepTime} min</td>

      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-3 text-content-paragraph">
          <button onClick={handleEdit} className="hover:text-blue-500 transition-colors">
            <PencilLine size={18} />
          </button>
          <button onClick={handleDelete} className="hover:text-status-cancelled transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
}

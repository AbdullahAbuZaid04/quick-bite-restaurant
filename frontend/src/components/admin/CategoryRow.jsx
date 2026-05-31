import { Pencil, Trash2 } from "lucide-react";

export default function CategoryRow({ cat, handleClickEditCategory, handleClickDeleteCategory }) {
  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-center text-sm font-medium text-gray-600">
      <td className="py-4 px-6">{cat.id}</td>
      <td className="py-4 px-6 font-bold text-gray-800">{cat.name}</td>
      <td className="py-4 px-6">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => { handleClickEditCategory(cat); }}
            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => handleClickDeleteCategory(cat)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  )
}
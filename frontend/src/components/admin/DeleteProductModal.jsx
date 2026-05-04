import { X } from "lucide-react";

export default function DeleteProductModal({
  isOpen,
  onClose,
  product,
  onDelete,
}) {
  if (!product) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-2xl p-5 shadow-2xl my-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Delete Product</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors duration-300"
          >
            <X size={22} />
          </button>
        </div>
        <div>
          <p className="text-lg">
            Are you sure you want to delete{" "}
            <span className="font-bold text-red-500">({product?.name})</span>?
          </p>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-8 py-3 text-gray-500 font-bold bg-gray-200 hover:bg-gray-300 rounded-2xl transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onDelete(product?.id)}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all duration-300"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";

export default function ProductModal({
  isOpen,
  onClose,
  type = "add", // "add" or "edit"
  product,      // used if type is "edit"
  onSubmit,     // single onSubmit handler that receives (data) for add, or (id, data) for edit
  categories = [],
  isLoadingCategories
}) {
  const [formData, setFormData] = useState({
    name: "",
    category_id: 0,
    description: "",
    price: 0,
    prepare_time: 0,
    image_url: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && product) {
        setFormData({
          name: product.name || "",
          category_id: product.category_id || 0,
          description: product.description || "",
          price: product.price || 0,
          prepare_time: product.prepare_time || 0,
          image_url: product.image_url || ""
        });
      } else {
        // Reset to default for add
        setFormData({
          name: "",
          category_id: 0,
          description: "",
          price: 0,
          prepare_time: 0,
          image_url: ""
        });
      }
    }
  }, [isOpen, type, product]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (type === "edit") {
        await onSubmit(product.id, formData);
      } else {
        await onSubmit(formData);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = type === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-2xl p-5 shadow-2xl my-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{isEdit ? "Edit Product" : "Add New Product"}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {isEdit ? "Fill in the information below to edit the dish." : "Fill in the information below to add a new dish."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors duration-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Truffle Mushroom Risotto"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-orange-500 transition-all duration-300 placeholder:text-gray-300"
                required
              />
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Category
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.category_id}
                  disabled={isLoadingCategories}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: Number(e.target.value) })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none appearance-none focus:border-orange-500 transition-all duration-300 text-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={0} disabled>
                    {isLoadingCategories ? 'Loading categories...' : 'Select category'}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={18}
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Description
              </label>
              <textarea
                rows="2"
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe your dish..."
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-orange-500 transition-all duration-300 placeholder:text-gray-300 resize-none"
              ></textarea>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-orange-500 transition-all duration-300 placeholder:text-gray-300"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Prep Time (min)
              </label>
              <input
                type="number"
                step="1"
                value={formData.prepare_time || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prepare_time: Number(e.target.value),
                  })
                }
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-orange-500 transition-all duration-300 placeholder:text-gray-300"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Product Image URL
              </label>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
                placeholder="https://example.com/image.jpg"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-orange-500 transition-all duration-300 placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-3 text-gray-500 font-bold bg-gray-200 hover:bg-gray-300 rounded-2xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all duration-300 flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Product' : 'Save Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

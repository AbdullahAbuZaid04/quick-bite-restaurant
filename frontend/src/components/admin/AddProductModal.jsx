import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function AddProductModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    prepTime: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  if (!isOpen) return null;

  const handelSubmit = (e) => {
    e.preventDefault();
    const newProduct = { ...formData };
    if (image) {
      newProduct.image = URL.createObjectURL(image);
    }
    onAdd(newProduct);
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      prepTime: "",
    });
    setImage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-2xl rounded-2xl p-5 shadow-2xl my-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Add New Product</h2>
            <p className="text-gray-400 text-sm mt-1">
              Fill in the information below to add a new dish.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors duration-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handelSubmit}>
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
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none appearance-none focus:border-orange-500 transition-all duration-300 text-gray-500 cursor-pointer"
                >
                  <option value="">Select category</option>
                  <option value="burgers">Burgers</option>
                  <option value="pizza">Pizza</option>
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
                value={formData.price}
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
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  value={formData.prepTime}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      prepTime: Number(e.target.value),
                    })
                  }
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-orange-500 transition-all duration-300 placeholder:text-gray-300"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <ImageUpload image={image} setImage={setImage} />
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
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all duration-300"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CategoryModal({ isOpen, onClose, type = "add", category, onSubmit }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (type === "edit" && category) {
        setName(category.name || "");
      } else {
        setName("");
      }
    }
  }, [isOpen, type, category]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      if (type === "edit") {
        await onSubmit(category.id, { name });
      } else {
        await onSubmit({ name });
      }
      onClose();
    } catch (error) {
      console.error(`Failed to ${type} category:`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEdit = type === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto bg-black/40 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose}></div>

      <div className="relative bg-white w-full max-w-lg rounded-2xl p-5 shadow-2xl my-auto z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{isEdit ? "Edit Category" : "Add New Category"}</h2>
            <p className="text-gray-400 text-sm mt-1">
              {isEdit ? "Fill in the information below to edit the category." : "Create a new category for your menu items."}
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
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Category Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pizza"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-3.5 px-4 outline-none focus:border-orange-500 transition-all duration-300 placeholder:text-gray-300"
              autoFocus
            />
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
              disabled={isSubmitting || !name.trim()}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all duration-300 flex items-center gap-2"
            >
              {isSubmitting && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {isSubmitting ? (isEdit ? 'Updating...' : 'Saving...') : (isEdit ? 'Update Category' : 'Save Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

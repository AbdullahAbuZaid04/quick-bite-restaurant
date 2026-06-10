import { Plus, Pencil, Trash2, AlertCircle, RefreshCw } from "lucide-react";
import CategoryModal from "../../components/admin/CategoryModal";
import { useCategories } from "../../hooks/useCategories";
import DeleteModal from "../../components/admin/DeleteModal";

export default function CategoriesManagement() {
  const { isAddCategoryModalOpen, setIsAddCategoryModalOpen, isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen, isCategoryEditModalOpen, setIsCategoryEditModalOpen, selectedCategory, categories, isLoadingCategories, categoriesError, handleAddCategory, handleEditCategory, handleClickEditCategory, handleClickDeleteCategory, handleDeleteCategory, refetchCategories } = useCategories();

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-content-paragraph">Manage Categories</h1>
          <p className="text-content-subtitle text-sm mt-2 max-w-xl">
            Manage your menu categories to organize your products efficiently.
          </p>
        </div>
        <button onClick={() => setIsAddCategoryModalOpen(true)} className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-hover transition-all duration-200 text-sm">
          <Plus size={20} /> Add Category
        </button>
      </div>

      <div className="bg-ui-white rounded-2xl border border-ui-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-brand-primary text-white text-center text-sm font-bold uppercase">
              <tr>
                <th className="py-5 px-6">ID</th>
                <th className="py-5 px-6">Name</th>
                <th className="py-5 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingCategories ? (
                <tr>
                  <td colSpan={3} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400 text-sm font-medium">Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categoriesError ? (
                <tr>
                  <td colSpan={3} className="text-center py-16">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="bg-red-50 p-3 rounded-full">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <span className="text-red-500 text-sm font-medium">{categoriesError}</span>
                      <button
                        onClick={refetchCategories}
                        className="flex items-center gap-2 mt-2 px-4 py-2 bg-gray-800 text-white hover:bg-gray-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                      </button>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-16 text-gray-400 text-sm font-medium">
                    No categories found
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-ui-border hover:bg-ui-mainBg transition-colors text-center text-sm">
                    <td className="py-4 px-6 text-content-subtitle">{cat.id}</td>
                    <td className="py-4 px-6 font-bold text-content-paragraph">{cat.name}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleClickEditCategory(cat)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal isOpen={isAddCategoryModalOpen} onClose={() => setIsAddCategoryModalOpen(false)} type="add" onSubmit={handleAddCategory} />
      <CategoryModal isOpen={isCategoryEditModalOpen} onClose={() => setIsCategoryEditModalOpen(false)} type="edit" category={selectedCategory} onSubmit={handleEditCategory} />
      <DeleteModal isOpen={isCategoryDeleteModalOpen} onClose={() => setIsCategoryDeleteModalOpen(false)} itemSelected={selectedCategory} onDelete={handleDeleteCategory} type="category" />
    </div>
  );
}

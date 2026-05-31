import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import MenuRow from "../../components/admin/MenuRow";
import Pagination from "../../components/common/Pagination";
import ProductModal from "../../components/admin/ProductModal";
import { useMenu } from "../../hooks/useMenu";
import DeleteModal from "../../components/admin/DeleteModal";

const TABLE_HEADERS = ["Product Image", "Product Name", "Category", "Price", "Prep Time", "Action"];

export default function MenuManagement() {
  const { isAddModalOpen, categories, setIsAddModalOpen, isEditModalOpen, setIsEditModalOpen, isProductDeleteModalOpen, setIsProductDeleteModalOpen, selectedProduct, isLoadingProducts, isLoadingCategories, products, handleAddProduct, handleClickEdit, handleEdit, handleClickDeleteProduct, handleDeleteProduct } = useMenu();

  const productList = Array.isArray(products) ? products : [];
  const meta = productList?.meta || {};

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => { setCurrentPage(1); }, [products.length]);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil((meta.total || productList.length) / pageSize));

  const paginatedProducts = productList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-content-paragraph">Manage Menu</h1>
          <p className="text-content-subtitle text-sm mt-2 max-w-xl">
            Manage all restaurant products, categories, pricing, and availability.
          </p>
        </div>
        <button onClick={() => setIsAddModalOpen(true)} className="bg-brand-primary text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-hover transition-all duration-200 text-sm">
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-ui-white rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-brand-primary text-white text-center text-sm font-bold uppercase">
              <tr>
                {TABLE_HEADERS.map((th, index) => (
                  <th key={index} className="py-5 px-6">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoadingProducts ? (
                <tr>
                  <td colSpan={6} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-400 text-sm font-medium">Loading products...</span>
                    </div>
                  </td>
                </tr>
              ) : !Array.isArray(products) ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm font-medium">
                    Invalid products data
                  </td>
                </tr>
              ) : productList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400 text-sm font-medium">
                    No products found
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((item, index) => (
                  <MenuRow
                    key={item.id || index}
                    image={item.image_url}
                    name={item.name}
                    categoryName={item.category_name}
                    price={item.price}
                    prepTime={item.prepare_time}
                    handleEdit={() => handleClickEdit(item)}
                    handleDelete={() => handleClickDeleteProduct(item)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {productList.length > 0 && !isLoadingProducts && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={meta.total || productList.length}
            itemsPerPage={pageSize}
            itemName="products"
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} type="add" onSubmit={handleAddProduct} categories={categories} isLoadingCategories={isLoadingCategories} />
      <ProductModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} type="edit" product={selectedProduct} onSubmit={handleEdit} categories={categories} isLoadingCategories={isLoadingCategories} />
      <DeleteModal isOpen={isProductDeleteModalOpen} onClose={() => setIsProductDeleteModalOpen(false)} itemSelected={selectedProduct} onDelete={handleDeleteProduct} type="product" />
    </div>
  );
}

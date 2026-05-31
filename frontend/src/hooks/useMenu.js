import { useState, useEffect } from "react";
import { createMenuItem, getAllMenu, updateMenuItem, deleteMenuItem } from "../api/menuService";
import { getAllCategories } from "../api/categoryService";
import toast from 'react-hot-toast';

export function useMenu() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const result = await getAllMenu();
      if (result.success) {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    try {
      const result = await getAllCategories();
      if (result.success) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleAddProduct = async (newProduct) => {
    try {
      const result = await createMenuItem(newProduct);
      if (result.success) {
        toast.success("Product added successfully");
        setProducts(prevProducts => [...prevProducts, result.data]);
        setIsAddModalOpen(false);
      } else {
        toast.error(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error(error.message);
    }
  };

  const handleClickEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEdit = async (id, updatedProduct) => {
    try {
      const result = await updateMenuItem(id, updatedProduct);
      if (result.success) {
        toast.success("Product updated successfully");
        setProducts(prevProducts => prevProducts.map(p => p.id === id ? { ...p, ...result.data } : p));
        setIsEditModalOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error(result.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error(error.message);
    }
  };

  const handleClickDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsProductDeleteModalOpen(true);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const result = await deleteMenuItem(id);
      if (result.success) {
        toast.success("Product deleted successfully");
        setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
        setIsProductDeleteModalOpen(false);
        setSelectedProduct(null);
      } else {
        toast.error(result.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  return {
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isProductDeleteModalOpen,
    setIsProductDeleteModalOpen,
    selectedProduct,
    setSelectedProduct,
    products,
    setProducts,
    categories,
    isLoadingProducts,
    isLoadingCategories,
    handleAddProduct,
    handleClickEdit,
    handleEdit,
    handleClickDeleteProduct,
    handleDeleteProduct,
    refetchProducts: fetchProducts
  };
}

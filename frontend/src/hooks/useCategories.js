import { useState, useEffect } from "react";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../api/categoryService";
import toast from 'react-hot-toast';

export function useCategories() {
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isCategoryDeleteModalOpen, setIsCategoryDeleteModalOpen] = useState(false);
  const [isCategoryEditModalOpen, setIsCategoryEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const fetchCategories = async () => {
    setCategoriesError(null);
    setIsLoadingCategories(true);
    try {
      const result = await getAllCategories();
      if (result.success) {
        setCategories(result.data || []);
      } else {
        setCategoriesError(result.message || 'Failed to load categories');
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategoriesError(error.message);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (newCategory) => {
    try {
      const result = await createCategory(newCategory.name);
      if (result.success) {
        toast.success("Category added successfully");
        setCategories(prevCategories => [...prevCategories, result.data]);
        setIsAddCategoryModalOpen(false);
      } else {
        toast.error(result.message || 'Unknown error occurred');
      }
    } catch (error) {
      console.error('Failed to add category:', error);
      toast.error(error.message);
    }
  };

  const handleClickEditCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoryEditModalOpen(true);
  };

  const handleEditCategory = async (id, updatedCategory) => {
    try {
      const result = await updateCategory(id, updatedCategory.name);
      if (result.success) {
        toast.success("Category updated successfully");
        setCategories(prevCategories => prevCategories.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
        setIsCategoryEditModalOpen(false);
        setSelectedCategory(null);
      } else {
        toast.error(result.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error(error.message);
    }
  };

  const handleClickDeleteCategory = (category) => {
    setSelectedCategory(category);
    setIsCategoryDeleteModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const result = await deleteCategory(id);
      if (result.success) {
        toast.success("Category deleted successfully");
        setCategories(prevCategories => prevCategories.filter(c => c.id !== id));
        setIsCategoryDeleteModalOpen(false);
        setSelectedCategory(null);
      } else {
        toast.error(result.message || 'Failed to delete category');
        console.error(result.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(error.message || 'Failed to delete category');
    }
  };

  return {
    isAddCategoryModalOpen,
    setIsAddCategoryModalOpen,
    isCategoryDeleteModalOpen,
    setIsCategoryDeleteModalOpen,
    isCategoryEditModalOpen,
    setIsCategoryEditModalOpen,
    selectedCategory,
    categories,
    isLoadingCategories,
    categoriesError,
    handleAddCategory,
    handleEditCategory,
    handleClickEditCategory,
    handleClickDeleteCategory,
    handleDeleteCategory,
    refetchCategories: fetchCategories
  };
}

import { useState } from "react";
import { MenuData, UserData } from "../data/mockData";

export function useAdmin() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] = useState(false);
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [products, setProducts] = useState(MenuData);
  const [users, setUsers] = useState(UserData);

  const handleAddProduct = (newProduct) => {
    setProducts(prevProducts => [...prevProducts, newProduct]);
    setIsAddModalOpen(false);
  }

  const handleClickEdit = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  }

  const handleEdit = (updatedProduct) => {
    setProducts(prevProducts => prevProducts.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  }

  const handleClickDeleteProduct = (product) => {
    setSelectedProduct(product);
    setIsProductDeleteModalOpen(true);
  }

  const handleClickDeleteUser = (user) => {
    setSelectedUser(user);
    setIsUserDeleteModalOpen(true);
  }

  const handleDeleteProduct = (id) => {
    setProducts(prevProducts => prevProducts.filter(p => p.id !== id));
    setIsProductDeleteModalOpen(false);
    setSelectedProduct(null);
  }

  const handleDeleteUser = (id) => {
    setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
    setIsUserDeleteModalOpen(false);
    setSelectedUser(null);
  }

  return {
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isProductDeleteModalOpen,
    setIsProductDeleteModalOpen,
    isUserDeleteModalOpen,
    setIsUserDeleteModalOpen,
    selectedProduct,
    setSelectedProduct,
    selectedUser,
    setSelectedUser,
    products,
    setProducts,
    users,
    setUsers,
    handleAddProduct,
    handleClickEdit,
    handleEdit,
    handleClickDeleteProduct,
    handleClickDeleteUser,
    handleDeleteProduct,
    handleDeleteUser,
  };
}
import { useState, useEffect } from "react";
import { getAllUsersApi, deleteUserApi } from "../api/userService";
import toast from 'react-hot-toast';

export function useUsers() {
  const [isUserDeleteModalOpen, setIsUserDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState(null);

  const fetchUsers = async (page = 1) => {
    setUsersError(null);
    setIsLoadingUsers(true);
    try {
      const result = await getAllUsersApi(page);
      if (result.success) {
        const data = result.data || [];
        data.meta = result.meta || {};
        setUsers(data);
      } else {
        setUsersError(result.message || 'Failed to load users');
      }
    } catch (error) {
      setUsersError(error.message);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleClickDeleteUser = (user) => {
    setSelectedUser(user);
    setIsUserDeleteModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    try {
      const result = await deleteUserApi(id);
      if (result.success) {
        toast.success("User deleted successfully");
        setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
        setIsUserDeleteModalOpen(false);
        setSelectedUser(null);
      } else {
        toast.error(result.message || 'Failed to delete user');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  return {
    isUserDeleteModalOpen,
    setIsUserDeleteModalOpen,
    selectedUser,
    users,
    isLoadingUsers,
    usersError,
    handleClickDeleteUser,
    handleDeleteUser,
    refetchUsers: fetchUsers
  };
}
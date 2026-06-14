import { apiClient } from './apiClient';

export const getAllUsersApi = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const response = await apiClient(`/api/users?offset=${offset}&limit=${limit}`, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const updateUserApi = async (id, data) => {
  try {
    const response = await apiClient(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const deleteUserApi = async (id) => {
  try {
    await apiClient(`/api/users/${id}`, {
      method: 'DELETE',
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

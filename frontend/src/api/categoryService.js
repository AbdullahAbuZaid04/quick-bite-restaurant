import { apiClient } from './apiClient';

export const createCategory = async (name) => {
  try {
    const response = await apiClient('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const updateCategory = async (id, name) => {
  try {
    const response = await apiClient(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const deleteCategory = async (id) => {
  try {
    await apiClient(`/api/categories/${id}`, {
      method: 'DELETE',
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const getAllCategories = async () => {
  try {
    const response = await apiClient('/api/categories', {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

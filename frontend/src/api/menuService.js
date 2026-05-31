import { apiClient } from './apiClient';

export const createMenuItem = async (formData) => {
  try {
    const response = await apiClient('/api/menu', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const getAllMenu = async () => {
  try {
    const response = await apiClient('/api/menu', {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const updateMenuItem = async (id, data) => {
  try {
    const response = await apiClient(`/api/menu/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const deleteMenuItem = async (id) => {
  try {
    await apiClient(`/api/menu/${id}`, {
      method: 'DELETE',
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

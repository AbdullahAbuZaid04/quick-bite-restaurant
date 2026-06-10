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

export const getAllMenu = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.limit) query.set('limit', params.limit);
    if (params.offset) query.set('offset', params.offset);
    const qs = query.toString();
    const response = await apiClient(`/api/menu${qs ? `?${qs}` : ''}`, {
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

import { apiClient } from './apiClient';

export const getDashboardApi = async () => {
  try {
    const response = await apiClient('/api/admin/dashboard', {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

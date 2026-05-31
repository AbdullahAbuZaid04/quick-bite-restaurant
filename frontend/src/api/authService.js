import { apiClient } from './apiClient';

export const loginApi = async (email, password) => {
  try {
    const response = await apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const registerApi = async (formData) => {
  try {
    const response = await apiClient('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    return response;
  } catch (error) {
    throw error;
  }
};
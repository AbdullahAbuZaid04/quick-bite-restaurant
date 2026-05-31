import { apiClient } from './apiClient';

export const getAllOrdersApi = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.limit) query.set('limit', params.limit);
    if (params.offset) query.set('offset', params.offset);
    const qs = query.toString();

    const response = await apiClient(`/api/orders${qs ? `?${qs}` : ''}`, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const updateOrderStatusApi = async (id, status) => {
  try {
    const response = await apiClient(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const createOrderApi = async (order) => {
  try {
    const response = await apiClient('/api/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
}

export const getMyOrders = async () => {
  try {
    const response = await apiClient('/api/orders', {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const cancelOrderApi = async (id) => {
  try {
    const response = await apiClient(`/api/orders/${id}/cancel`, {
      method: 'POST',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};

export const getOrderByIdApi = async (id) => {
  try {
    const response = await apiClient(`/api/orders/${id}`, {
      method: 'GET',
    });

    return response;
  } catch (error) {
    return { success: false, message: error.message || "Network error" };
  }
};
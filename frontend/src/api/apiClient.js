const API_URL = process.env.REACT_APP_API_URL;
const TIMEOUT_MS = 25000;

export const apiClient = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const config = {
      ...options,
      headers,
      signal: controller.signal,
    };

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errMsg = errorData?.error?.message || errorData?.message || 'Server error';
      if (errorData?.error?.details && errorData.error.details.length > 0) {
        errMsg += ' - ' + errorData.error.details.map(d => `${d.path}: ${d.message}`).join(', ');
      }
      throw new Error(errMsg);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. The server may be starting up, please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

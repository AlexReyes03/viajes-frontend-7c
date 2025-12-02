import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/notifications`
  : 'http://localhost:8080/api/notifications';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const notificationAPI = {
  getAll: async () => {
    const response = await axios.get(API_URL, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getUnread: async () => {
    const response = await axios.get(`${API_URL}/unread`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await axios.get(`${API_URL}/unread/count`, {
      headers: getAuthHeader()
    });
    return response.data.count;
  },

  markAsRead: async (notificationId) => {
    const response = await axios.put(
      `${API_URL}/${notificationId}/read`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await axios.put(
      `${API_URL}/read-all`,
      {},
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  delete: async (notificationId) => {
    const response = await axios.delete(`${API_URL}/${notificationId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};

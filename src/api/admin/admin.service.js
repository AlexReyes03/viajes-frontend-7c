import request from '../fetch-wrapper';

// Get dashboard statistics
export const getDashboardStats = async () => {
  return request('/admin/stats/dashboard');
};

// Tariff management
export const getCurrentTariff = async () => {
  return request('/tariff/current');
};

export const updateTariff = async (data) => {
  return request('/tariff/update', {
    method: 'PUT',
    body: data,
  });
};

import request from '../fetch-wrapper';

// Get dashboard statistics
export const getDashboardStats = async () => {
  return request('/admin/stats/dashboard');
};

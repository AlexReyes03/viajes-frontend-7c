import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../api/admin/admin.service';

// Hook for fetching admin dashboard statistics
export default function useAdminStats() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard stats from API
  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getDashboardStats();

      if (response && response.data) {
        setStats({
          totalUsers: response.data.totalUsers || 0,
          totalClients: response.data.totalClients || 0,
          totalDrivers: response.data.totalDrivers || 0,
          activeDrivers: response.data.activeDrivers || 0,
          pendingDrivers: response.data.pendingDrivers || 0,
          totalTrips: response.data.totalTrips || 0,
          completedTrips: response.data.completedTrips || 0,
          activeTrips: response.data.activeTrips || 0,
          cancelledTrips: response.data.cancelledTrips || 0,
          totalIncome: response.data.totalIncome || 0,
        });
        setChartData(response.data.chartData || []);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar estadísticas');
      setStats(null);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load stats on mount
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    chartData,
    loading,
    error,
    refetch: fetchStats,
  };
}


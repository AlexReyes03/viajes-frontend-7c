import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import Icon from '@mdi/react';
import { mdiAccountGroup, mdiCarConnected, mdiCheckCircleOutline, mdiCurrencyUsd } from '@mdi/js';
import StatCard from '../components/StatCard';
import AdminPieChart from '../components/AdminPieChart';
import useAdminStats from '../../../hooks/useAdminStats';

// Admin statistics dashboard view with real API connection
export default function Statistics() {
  const { stats, chartData, loading, error, refetch } = useAdminStats();

  // Render loading state
  if (loading) {
    return (
      <div className="container py-3">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="container py-3">
        <div className="alert alert-danger" role="alert">
          <strong>Error:</strong> {error}
          <button className="btn btn-link" onClick={refetch}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  return (
    <div className="container py-3">
      {/* Statistics Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Usuarios" value={(stats?.totalUsers || 0).toLocaleString('es-MX')} icon={mdiAccountGroup} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Conductores Activos" value={(stats?.activeDrivers || 0).toLocaleString('es-MX')} icon={mdiCarConnected} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Viajes Completados" value={(stats?.completedTrips || 0).toLocaleString('es-MX')} icon={mdiCheckCircleOutline} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Ingresos Totales" value={formatCurrency(stats?.totalIncome)} icon={mdiCurrencyUsd} />
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="row mb-4">
        <div className="col-12 col-lg-6 offset-lg-3">
          <AdminPieChart
            data={chartData}
            height={380}
            title="Distribución del Sistema"
            showLegend={true}
            enableArcLinkLabels={true}
            innerRadius={0.5}
          />
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="row g-3">
        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h6 className="text-muted small mb-2">Desglose de Usuarios</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Clientes</span>
                <strong>{(stats?.totalClients || 0).toLocaleString('es-MX')}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Conductores</span>
                <strong>{(stats?.totalDrivers || 0).toLocaleString('es-MX')}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Conductores Pendientes</span>
                <strong className="text-warning">{(stats?.pendingDrivers || 0).toLocaleString('es-MX')}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h6 className="text-muted small mb-2">Estado de Viajes</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Total Viajes</span>
                <strong>{(stats?.totalTrips || 0).toLocaleString('es-MX')}</strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Activos</span>
                <strong className="text-primary">{(stats?.activeTrips || 0).toLocaleString('es-MX')}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Cancelados</span>
                <strong className="text-danger">{(stats?.cancelledTrips || 0).toLocaleString('es-MX')}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-body p-3">
              <h6 className="text-muted small mb-2">Métricas de Rendimiento</h6>
              <div className="d-flex justify-content-between mb-2">
                <span>Tasa de Completado</span>
                <strong>
                  {stats?.totalTrips > 0
                    ? Math.round((stats.completedTrips / stats.totalTrips) * 100)
                    : 0}%
                </strong>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Ingreso Promedio</span>
                <strong>
                  {formatCurrency(stats?.completedTrips > 0 ? stats.totalIncome / stats.completedTrips : 0)}
                </strong>
              </div>
              <div className="d-flex justify-content-between">
                <span>Viajes por Conductor</span>
                <strong>
                  {stats?.activeDrivers > 0
                    ? Math.round(stats.totalTrips / stats.activeDrivers)
                    : 0}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

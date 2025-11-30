import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import Icon from '@mdi/react';
import { mdiAccountGroup, mdiCarConnected, mdiCheckCircleOutline, mdiCurrencyUsd } from '@mdi/js';
import StatCard from '../components/StatCard';

// Admin statistics dashboard view
export default function Statistics() {
  // Mock data for statistics cards
  const stats = {
    totalUsers: 2847,
    activeDrivers: 485,
    completedTrips: 2847,
    totalIncome: 2847,
  };

  // Mock data for pie chart
  const chartData = [
    { name: 'Clientes', value: 1850, color: 'var(--color-cyan-tint-1)' },
    { name: 'Conductores', value: 485, color: 'var(--color-lime-tint-1)' },
    { name: 'Viajes Activos', value: 312, color: 'var(--color-purple-tint-1)' },
    { name: 'Ingresos', value: 200, color: 'var(--color-teal-tint-1)' },
  ];

  // Colors for pie chart cells
  const COLORS = ['#0eafd8', '#a8bf30', '#c25cff', '#089b8f'];

  return (
    <div className="container py-3">
      {/* Statistics Cards Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Usuarios" value={stats.totalUsers.toLocaleString('es-MX')} icon={mdiAccountGroup} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Conductores Activos" value={stats.activeDrivers.toLocaleString('es-MX')} icon={mdiCarConnected} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Viajes Completados" value={stats.completedTrips.toLocaleString('es-MX')} icon={mdiCheckCircleOutline} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Ingresos Totales" value={stats.totalIncome.toLocaleString('es-MX')} icon={mdiCurrencyUsd} />
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="row">
        <div className="col-12 col-lg-6 offset-lg-3">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <div style={{ width: '100%', height: '350px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="45%" innerRadius={0} outerRadius={120} paddingAngle={2} dataKey="value">
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} formatter={(value) => <span style={{ color: '#333', fontWeight: '500' }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <h5 className="text-center fw-semibold mt-2 mb-0">Métricas</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

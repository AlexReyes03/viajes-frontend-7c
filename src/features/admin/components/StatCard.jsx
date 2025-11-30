import React from 'react';
import Icon from '@mdi/react';

// Reusable stat card with icon for admin dashboard
export default function StatCard({ title, value, icon, iconBgColor = '#E7E0EB' }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body p-3 d-flex align-items-center gap-3">
        <div
          className="d-flex align-items-center justify-content-center flex-shrink-0"
          style={{
            backgroundColor: iconBgColor,
            width: '50px',
            height: '50px',
            borderRadius: '12px',
          }}
        >
          <Icon path={icon} size={1.2} className="text-dark" />
        </div>
        <div className="flex-grow-1">
          <p className="text-muted small mb-1">{title}</p>
          <h3 className="fw-bold mb-0">{value}</h3>
        </div>
      </div>
    </div>
  );
}


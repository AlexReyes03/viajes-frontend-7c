import React from 'react';

// Badge component to display user status
export default function StatusBadge({ status, className = '' }) {
  const isActive = status === 'Activo';

  const badgeStyle = {
    backgroundColor: isActive ? 'var(--color-lime-tint-1)' : 'var(--color-red-tint-1)',
    color: 'var(--color-white)',
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
    display: 'inline-block',
    minWidth: '80px',
    textAlign: 'center',
  };

  return (
    <span style={badgeStyle} className={className}>
      {status}
    </span>
  );
}


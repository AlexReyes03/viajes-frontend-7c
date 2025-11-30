import React from 'react';
import { Button } from 'primereact/button';
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiSwapHorizontal } from '@mdi/js';
import StatusBadge from './StatusBadge';

// Data table component for displaying user list
export default function DataTable({ data, onEdit, onToggleStatus }) {
  const headerStyle = {
    backgroundColor: 'var(--color-blue-tint-6)',
    color: 'var(--color-blue-shade-2)',
    fontWeight: '600',
    padding: '1rem',
    textAlign: 'center',
    borderBottom: '2px solid var(--color-blue-tint-4)',
  };

  const cellStyle = {
    padding: '1rem',
    textAlign: 'center',
    verticalAlign: 'middle',
    borderBottom: '1px solid #dee2e6',
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th style={headerStyle}>Nombre</th>
                <th style={headerStyle}>Correo</th>
                <th style={headerStyle}>Tipo</th>
                <th style={headerStyle}>Estado</th>
                <th style={headerStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td style={cellStyle}>{user.name}</td>
                  <td style={cellStyle}>{user.email}</td>
                  <td style={cellStyle}>{user.type}</td>
                  <td style={cellStyle}>
                    <StatusBadge status={user.status} />
                  </td>
                  <td style={cellStyle}>
                    <div className="d-flex justify-content-center gap-2">
                      <Button
                        icon={<Icon path={mdiPencilOutline} size={0.9} />}
                        className="p-button-outlined p-button-info"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderColor: 'var(--color-cyan-tint-1)',
                          color: 'var(--color-cyan-tint-1)',
                        }}
                        onClick={() => onEdit(user)}
                        tooltip="Editar"
                        tooltipOptions={{ position: 'top' }}
                      />
                      <Button
                        icon={<Icon path={mdiSwapHorizontal} size={0.9} />}
                        className="p-button-outlined p-button-danger"
                        style={{
                          width: '40px',
                          height: '40px',
                          borderColor: 'var(--color-red-tint-1)',
                          color: 'var(--color-red-tint-1)',
                        }}
                        onClick={() => onToggleStatus(user)}
                        tooltip="Cambiar estado"
                        tooltipOptions={{ position: 'top' }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


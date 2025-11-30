import React from 'react';
import { Button } from 'primereact/button';
import Icon from '@mdi/react';
import { mdiPencilOutline, mdiTrashCanOutline, mdiNavigation } from '@mdi/js';

// Card component for displaying tariff information
export default function TarifaCard({ tarifa, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm mb-3" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between">
          {/* Left section with route info */}
          <div className="d-flex flex-column">
            <div className="d-flex align-items-center gap-3 mb-2">
              <h5 className="fw-bold mb-0">{tarifa.name}</h5>
              <span
                className="fw-bold fs-4"
                style={{ color: 'var(--color-blue-shade-3)' }}
              >
                ${tarifa.price}
              </span>
            </div>
            <div className="d-flex align-items-center gap-2 text-secondary">
              <Icon path={mdiNavigation} size={0.9} style={{ color: 'var(--color-cyan-tint-1)' }} />
              <span className="small">{tarifa.route}</span>
            </div>
          </div>

          {/* Right section with action buttons - Same colors as Users table */}
          <div className="d-flex gap-2">
            <Button
              icon={<Icon path={mdiPencilOutline} size={0.9} />}
              className="p-button-outlined p-button-info"
              style={{
                width: '45px',
                height: '45px',
                borderColor: 'var(--color-cyan-tint-1)',
                color: 'var(--color-cyan-tint-1)',
                backgroundColor: 'transparent',
              }}
              onClick={() => onEdit(tarifa)}
              tooltip="Editar"
              tooltipOptions={{ position: 'top' }}
            />
            <Button
              icon={<Icon path={mdiTrashCanOutline} size={0.9} />}
              className="p-button-outlined p-button-danger"
              style={{
                width: '45px',
                height: '45px',
                borderColor: 'var(--color-red-tint-1)',
                color: 'var(--color-red-tint-1)',
                backgroundColor: 'transparent',
              }}
              onClick={() => onDelete(tarifa)}
              tooltip="Eliminar"
              tooltipOptions={{ position: 'top' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

// Filter bar component with dropdowns and search input
export default function FilterBar({ filters, onFilterChange }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body p-3">
        <h5 className="fw-bold mb-3">Filtros</h5>
        <div className="row g-3 align-items-end">
          {/* User type filter */}
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-secondary">
              Tipo de usuario
            </label>
            <Dropdown
              value={filters.userType}
              options={[
                { label: 'Seleccionar', value: '' },
                { label: 'Cliente', value: 'Cliente' },
                { label: 'Conductor', value: 'Conductor' },
              ]}
              onChange={(e) => onFilterChange('userType', e.value)}
              placeholder="Seleccionar"
              className="w-100"
            />
          </div>

          {/* Status filter */}
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-secondary">
              Tipo de usuario
            </label>
            <Dropdown
              value={filters.status}
              options={[
                { label: 'Seleccionar', value: '' },
                { label: 'Activo', value: 'Activo' },
                { label: 'Inactivo', value: 'Inactivo' },
              ]}
              onChange={(e) => onFilterChange('status', e.value)}
              placeholder="Seleccionar"
              className="w-100"
            />
          </div>

          {/* Search input */}
          <div className="col-12 col-md-4">
            <label className="form-label small fw-semibold text-secondary">
              Tipo de usuario
            </label>
            <InputText
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              placeholder="Nombre o Correo"
              className="w-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}


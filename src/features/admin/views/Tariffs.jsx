/*
 * ARCHIVO DESACTIVADO - Ya no se usa gestión de múltiples tarifas
 * Ahora se maneja una tarifa única desde Statistics.jsx con TariffConfigCard
 * Conservado para referencia histórica
 * Fecha de desactivación: 2025-12-02
 */

import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import TarifaCard from '../components/TarifaCard';

// Admin tariffs management view
export default function Tariffs() {
  // Dialog state
  const [showDialog, setShowDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [selectedTarifa, setSelectedTarifa] = useState(null);

  // Confirm delete dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tarifaToDelete, setTarifaToDelete] = useState(null);

  // Mock data for tariffs
  const [tarifas] = useState([
    { id: 1, name: 'Ruta Centro', price: 120, route: 'Centro - Universidad' },
    { id: 2, name: 'Ruta Norte', price: 120, route: 'Centro - Zona Norte' },
    { id: 3, name: 'Ruta Aeropuerto', price: 120, route: 'Centro - Aeropuerto' },
    { id: 4, name: 'Ruta Sur', price: 120, route: 'Centro - Zona Sur' },
  ]);

  // Form state for new/edit tariff
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    route: '',
  });

  // Handle open create dialog
  const handleCreate = () => {
    setDialogMode('create');
    setFormData({ name: '', price: 0, route: '' });
    setShowDialog(true);
  };

  // Handle open edit dialog
  const handleEdit = (tarifa) => {
    setDialogMode('edit');
    setSelectedTarifa(tarifa);
    setFormData({
      name: tarifa.name,
      price: tarifa.price,
      route: tarifa.route,
    });
    setShowDialog(true);
  };

  // Handle delete confirmation
  const handleDelete = (tarifa) => {
    setTarifaToDelete(tarifa);
    setShowDeleteDialog(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    console.log('Deleting tarifa:', tarifaToDelete);
    setShowDeleteDialog(false);
    setTarifaToDelete(null);
  };

  // Handle save tariff
  const handleSave = () => {
    if (dialogMode === 'create') {
      console.log('Creating new tarifa:', formData);
    } else {
      console.log('Updating tarifa:', selectedTarifa.id, formData);
    }
    setShowDialog(false);
    setSelectedTarifa(null);
  };

  // Handle form input change
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container py-3">
      {/* Header with title and create button */}
      <div className="card shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="fw-bold mb-0">Tarifas por Ruta</h4>
            <Button label="Nueva Tarifa" icon={<Icon path={mdiPlus} size={0.9} className="me-2" />} className="btn-lime" onClick={handleCreate} />
          </div>
        </div>
      </div>

      {/* Tariffs List */}
      <div>
        {tarifas.map((tarifa) => (
          <TarifaCard key={tarifa.id} tarifa={tarifa} onEdit={handleEdit} onDelete={handleDelete} />
        ))}
      </div>

      {/* Create/Edit Tariff Dialog */}
      <Dialog
        header={dialogMode === 'create' ? 'Nueva Tarifa' : 'Editar Tarifa'}
        visible={showDialog}
        onHide={() => setShowDialog(false)}
        style={{ width: '90vw', maxWidth: '450px' }}
        draggable={false}
        resizable={false}
        className="border-0 shadow"
        headerClassName="border-0 pb-0 fw-bold"
        contentClassName="pt-4"
      >
        <div className="d-flex flex-column gap-3">
          <div>
            <label className="form-label small fw-semibold text-secondary">Nombre de la ruta</label>
            <InputText value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} placeholder="Ej: Ruta Centro" className="w-100" />
          </div>

          <div>
            <label className="form-label small fw-semibold text-secondary">Descripción del recorrido</label>
            <InputText value={formData.route} onChange={(e) => handleInputChange('route', e.target.value)} placeholder="Ej: Centro - Universidad" className="w-100" />
          </div>

          <div>
            <label className="form-label small fw-semibold text-secondary">Precio</label>
            <InputNumber value={formData.price} onValueChange={(e) => handleInputChange('price', e.value)} mode="currency" currency="MXN" locale="es-MX" className="w-100" />
          </div>

          <div className="d-flex justify-content-end gap-2 pt-3">
            <Button
              label="Cancelar"
              className="p-button-outlined fw-bold"
              style={{
                color: 'var(--color-secondary)',
                borderColor: 'var(--color-secondary)',
              }}
              onClick={() => setShowDialog(false)}
            />
            <Button label={dialogMode === 'create' ? 'Crear' : 'Guardar'} className="btn-lime" onClick={handleSave} />
          </div>
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        header="Confirmar eliminación"
        visible={showDeleteDialog}
        onHide={() => setShowDeleteDialog(false)}
        style={{ width: '90vw', maxWidth: '400px' }}
        draggable={false}
        resizable={false}
        className="border-0 shadow"
        headerClassName="border-0 pb-0 fw-bold"
        contentClassName="pt-4"
      >
        <p className="mb-4">
          ¿Estás seguro de que deseas eliminar la tarifa <strong>{tarifaToDelete?.name}</strong>?
        </p>
        <div className="d-flex justify-content-end gap-2">
          <Button
            label="Cancelar"
            className="p-button-outlined fw-bold"
            style={{
              color: 'var(--color-secondary)',
              borderColor: 'var(--color-secondary)',
            }}
            onClick={() => setShowDeleteDialog(false)}
          />
          <Button label="Eliminar" className="p-button-danger" onClick={handleConfirmDelete} />
        </div>
      </Dialog>
    </div>
  );
}

/*
 * FIN DEL ARCHIVO DESACTIVADO
 */

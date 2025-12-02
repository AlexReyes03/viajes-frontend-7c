import React, { useState, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';
import Icon from '@mdi/react';
import { mdiCurrencyUsd, mdiPencilOutline } from '@mdi/js';
import { useAuth } from '../../../contexts/AuthContext';
import useTariff from '../../../hooks/useTariff';

/**
 * Componente para mostrar y gestionar la tarifa global del sistema.
 *
 * Permite a los administradores ver la tarifa actual y actualizarla
 * a través de un diálogo modal. Mantiene historial de cambios.
 */
export default function TariffConfigCard() {
  const { user } = useAuth();
  const { tariff, loading, error, updateTariff: updateTariffApi } = useTariff();
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({ value: 0, reason: '' });
  const [updating, setUpdating] = useState(false);
  const toast = useRef(null);

  /**
   * Formatea un número como moneda MXN.
   */
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  /**
   * Formatea una fecha en formato legible en español.
   */
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Abre el diálogo de actualización con los datos actuales.
   */
  const handleOpenDialog = () => {
    setFormData({ value: tariff?.tariffValue || 0, reason: '' });
    setShowDialog(true);
  };

  /**
   * Maneja la actualización de la tarifa.
   */
  const handleUpdate = async () => {
    // Validación de razón del cambio
    if (!formData.reason || formData.reason.trim().length < 10) {
      toast.current.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'La razón del cambio debe tener al menos 10 caracteres',
        life: 3000,
      });
      return;
    }

    // Validación de valor de tarifa
    if (!formData.value || formData.value <= 0) {
      toast.current.show({
        severity: 'warn',
        summary: 'Validación',
        detail: 'El valor de la tarifa debe ser mayor a 0',
        life: 3000,
      });
      return;
    }

    setUpdating(true);

    // Construir nombre completo del usuario
    const modifierName = user?.surname
      ? `${user.name} ${user.surname}${user.lastname ? ' ' + user.lastname : ''}`
      : user?.name || 'Administrador';

    const result = await updateTariffApi({
      tariffValue: formData.value,
      modifierName: modifierName,
      changeReason: formData.reason.trim(),
    });

    setUpdating(false);

    if (result.success) {
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Tarifa actualizada correctamente',
        life: 3000,
      });
      setShowDialog(false);
      setFormData({ value: 0, reason: '' });
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Error',
        detail: result.error || 'Error al actualizar tarifa',
        life: 5000,
      });
    }
  };

  // Renderizado en estado de carga
  if (loading) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-body p-4 d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
          <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="4" />
        </div>
      </div>
    );
  }

  // Renderizado en estado de error
  if (error) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-body p-4">
          <div className="alert alert-danger mb-0" role="alert">
            <strong>Error:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toast ref={toast} />

      <div className="card shadow-sm h-100">
        <div className="card-body p-4 d-flex flex-column">
          {/* Encabezado con título e ícono */}
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 className="fw-bold mb-1">Tarifa por Viaje</h5>
              <p className="text-muted small mb-0">Tarifa general del sistema</p>
            </div>
            <div
              className="d-flex align-items-center justify-content-center"
              style={{
                backgroundColor: '#E7E0EB',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
              }}
            >
              <Icon path={mdiCurrencyUsd} size={1.2} className="text-dark" />
            </div>
          </div>

          {/* Valor actual de la tarifa */}
          <div className="mb-3">
            <h2 className="fw-bold mb-0" style={{ color: 'var(--color-cyan-tint-1)' }}>
              {formatCurrency(tariff?.tariffValue)}
            </h2>
          </div>

          {/* Información de última actualización */}
          <div className="mb-3">
            <p className="text-muted small mb-1">Última actualización:</p>
            <p className="small mb-0">
              <strong>{formatDate(tariff?.modificationDate)}</strong>
            </p>
            <p className="small text-muted mb-0">por {tariff?.modifierName}</p>
          </div>

          {/* Razón del último cambio */}
          {tariff?.changeReason && (
            <div className="mb-3">
              <p className="text-muted small mb-1">Razón del cambio:</p>
              <p className="small mb-0" style={{ fontStyle: 'italic' }}>
                "{tariff.changeReason}"
              </p>
            </div>
          )}

          {/* Botón para modificar */}
          <div className="mt-auto">
            <Button
              label="Modificar Tarifa"
              icon={<Icon path={mdiPencilOutline} size={0.8} className="me-2" />}
              className="btn-lime w-100"
              onClick={handleOpenDialog}
            />
          </div>
        </div>
      </div>

      {/* Diálogo de actualización */}
      <Dialog
        header="Modificar Tarifa del Sistema"
        visible={showDialog}
        onHide={() => !updating && setShowDialog(false)}
        style={{ width: '90vw', maxWidth: '500px' }}
        draggable={false}
        resizable={false}
        className="border-0 shadow"
        headerClassName="border-0 pb-0 fw-bold"
        contentClassName="pt-4"
      >
        <div className="d-flex flex-column gap-3">
          {/* Campo de nuevo valor */}
          <div>
            <label className="form-label small fw-semibold text-secondary">
              Nuevo valor de la tarifa
            </label>
            <InputNumber
              value={formData.value}
              onValueChange={(e) => setFormData((prev) => ({ ...prev, value: e.value }))}
              mode="currency"
              currency="MXN"
              locale="es-MX"
              className="w-100"
              min={1}
              max={10000}
              disabled={updating}
            />
          </div>

          {/* Campo de razón del cambio */}
          <div>
            <label className="form-label small fw-semibold text-secondary">
              Razón del cambio (mínimo 10 caracteres)
            </label>
            <InputTextarea
              value={formData.reason}
              onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
              placeholder="Ej: Ajuste por incremento en costos operativos"
              rows={4}
              className="w-100"
              disabled={updating}
              maxLength={500}
            />
            <small className="text-muted">
              {formData.reason.length}/500 caracteres
            </small>
          </div>

          {/* Información del modificador */}
          <div>
            <label className="form-label small fw-semibold text-secondary">Modificado por</label>
            <p className="small mb-0 fw-medium">
              {user?.surname
                ? `${user.name} ${user.surname}${user.lastname ? ' ' + user.lastname : ''}`
                : user?.name || 'Administrador'}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="d-flex justify-content-end gap-2 pt-3">
            <Button
              label="Cancelar"
              className="p-button-outlined fw-bold"
              style={{
                color: 'var(--color-secondary)',
                borderColor: 'var(--color-secondary)',
              }}
              onClick={() => setShowDialog(false)}
              disabled={updating}
            />
            <Button
              label={updating ? 'Actualizando...' : 'Actualizar'}
              className="btn-lime"
              onClick={handleUpdate}
              disabled={updating}
              loading={updating}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}

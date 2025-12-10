import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputTextarea } from 'primereact/inputtextarea';

export default function CancelTripModal({
  visible,
  onHide,
  onConfirm,
  loading = false
}) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const MIN_LENGTH = 10;
  const MAX_LENGTH = 500;

  useEffect(() => {
    if (!visible) {
      setReason('');
      setError('');
    }
  }, [visible]);

  const handleReasonChange = (e) => {
    const value = e.target.value;
    if (value.length <= MAX_LENGTH) {
      setReason(value);
      setError('');
    }
  };

  const handleConfirm = () => {
    if (reason.trim().length < MIN_LENGTH) {
      setError(`El motivo debe tener al menos ${MIN_LENGTH} caracteres`);
      return;
    }
    onConfirm(reason.trim());
  };

  const isValid = reason.trim().length >= MIN_LENGTH && reason.trim().length <= MAX_LENGTH;
  const charCount = reason.length;
  const charCountColor = charCount > MAX_LENGTH * 0.9 ? 'text-danger' : 'text-muted';

  return (
    <Dialog
      header="Cancelar viaje"
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '500px' }}
      modal
      dismissableMask
      draggable={false}
    >
      <div className="p-3">
        <p className="text-muted mb-3">
          Por favor, indícanos el motivo de la cancelación. Esta información nos ayuda a mejorar nuestro servicio.
        </p>

        <div className="mb-3">
          <label htmlFor="cancel-reason" className="form-label fw-semibold">
            Motivo de cancelación
          </label>
          <InputTextarea
            id="cancel-reason"
            value={reason}
            onChange={handleReasonChange}
            rows={5}
            placeholder="Escribe aquí el motivo de la cancelación..."
            className={`w-100 ${error ? 'p-invalid' : ''}`}
            disabled={loading}
            autoFocus
          />
          <div className="d-flex justify-content-between align-items-center mt-1">
            <small className="text-danger">{error}</small>
            <small className={charCountColor}>
              {charCount}/{MAX_LENGTH}
            </small>
          </div>
        </div>

        <div className="d-flex gap-2 justify-content-end">
          <Button
            label="Volver"
            className="p-button-outlined p-button-secondary"
            onClick={onHide}
            disabled={loading}
          />
          <Button
            label="Confirmar cancelación"
            className="p-button-danger"
            onClick={handleConfirm}
            disabled={!isValid || loading}
            loading={loading}
          />
        </div>
      </div>
    </Dialog>
  );
}

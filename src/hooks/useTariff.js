import { useState, useEffect, useCallback } from 'react';
import * as adminService from '../api/admin/admin.service';

/**
 * Hook personalizado para gestionar la tarifa del sistema.
 *
 * Proporciona funcionalidad para:
 * - Obtener la tarifa activa actual
 * - Actualizar la tarifa
 * - Manejar estados de carga y error
 * - Refrescar datos cuando sea necesario
 *
 * @returns {Object} Estado y funciones relacionadas con la tarifa
 */
export default function useTariff() {
  const [tariff, setTariff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Obtiene la tarifa actual del backend.
   */
  const fetchTariff = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.getCurrentTariff();
      if (response && response.data) {
        setTariff(response.data);
      }
    } catch (err) {
      setError(err.message || 'Error al cargar tarifa');
      setTariff(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza la tarifa en el backend.
   *
   * @param {Object} data - Datos de la nueva tarifa
   * @param {number} data.tariffValue - Nuevo valor de la tarifa
   * @param {string} data.modifierName - Nombre de quien modifica
   * @param {string} data.changeReason - Razón del cambio
   * @returns {Object} Resultado de la operación {success, error}
   */
  const updateTariff = async (data) => {
    try {
      const response = await adminService.updateTariff(data);
      if (response && response.data) {
        setTariff(response.data);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Cargar tarifa al montar el componente
  useEffect(() => {
    fetchTariff();
  }, [fetchTariff]);

  return {
    tariff,
    loading,
    error,
    refetch: fetchTariff,
    updateTariff,
  };
}

// Driver service for admin document management

import request from '../fetch-wrapper';
import { BASE_URL } from '../common-url';

// Get full driver info including documents
export const getDriverFullInfo = async (userId) => {
  return request(`/drivers/admin/${userId}/full`);
};

// Fetch document as blob and open in new tab
export const openDocumentInNewTab = async (documentId) => {
  const token = localStorage.getItem('token');
  const url = `${BASE_URL}/drivers/documents/${documentId}/download`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Error al descargar el documento');
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    
    // Clean up blob URL after delay
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
  } catch (error) {
    console.error('Error opening document:', error);
    throw error;
  }
};

// Document type labels in Spanish
export const DOCUMENT_TYPE_LABELS = {
  NO_CRIMINAL_RECORD: 'Constancia de No Antecedentes Penales',
  LICENSE_FRONT: 'Licencia de Conducir (Frente)',
  LICENSE_BACK: 'Licencia de Conducir (Reverso)',
  INSURANCE: 'Póliza de Seguro',
  VEHICLE_REGISTRATION: 'Tarjeta de Circulación'
};

// Get label for document type
export const getDocumentTypeLabel = (type) => {
  return DOCUMENT_TYPE_LABELS[type] || type;
};

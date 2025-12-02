import request from '../fetch-wrapper';
import { BASE_URL } from '../common-url';

const ENDPOINT = '/drivers';

const getDriverFullInfo = async (userId) => {
  return await request(`${ENDPOINT}/admin/${userId}/full`);
};

const updateDriverLicense = async (driverProfileId, licenseNumber) => {
  return await request(`${ENDPOINT}/profile/${driverProfileId}/license`, {
    method: 'PUT',
    body: { licenseNumber },
  });
};

const updateVehicle = async (vehicleId, vehicleData) => {
  return await request(`${ENDPOINT}/vehicles/${vehicleId}`, {
    method: 'PUT',
    body: vehicleData,
  });
};

// Fetch document as blob
const downloadDocument = async (documentId) => {
  return await request(`${ENDPOINT}/documents/${documentId}/download`, {
    responseType: 'blob',
  });
};

export const DriverService = {
  getDriverFullInfo,
  updateDriverLicense,
  updateVehicle,
  downloadDocument,
};

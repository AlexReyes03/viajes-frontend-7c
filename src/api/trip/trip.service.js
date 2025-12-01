import request from '../fetch-wrapper';

const ENDPOINT = '/trips';

export const requestTrip = async (tripData) => {
  return await request(ENDPOINT, {
    method: 'POST',
    body: tripData,
  });
};

export const getTripDetails = async (tripId, clientId) => {
  return await request(`${ENDPOINT}/${tripId}/details?clientId=${clientId}`);
};

export const cancelTrip = async (tripId, clientId, reason = '') => {
  return await request(`${ENDPOINT}/${tripId}/cancel?clientId=${clientId}&reason=${reason}`, {
    method: 'PUT',
  });
};

export const rateTrip = async (clientId, ratingData) => {
  return await request(`${ENDPOINT}/rate?clientId=${clientId}`, {
    method: 'POST',
    body: ratingData,
  });
};

export const getClientHistory = async (clientId) => {
  return await request(`${ENDPOINT}/client/${clientId}`);
};

export const getDriverAssignedTrips = async (driverId) => {
  return await request(`${ENDPOINT}/driver/${driverId}/assigned`);
};

export const getAvailableTrips = async () => {
  return await request(`${ENDPOINT}/available`);
};

export const acceptTrip = async (tripId, userId) => {
  return await request(`${ENDPOINT}/${tripId}/accept?userId=${userId}`, {
    method: 'PUT',
  });
};

export const rejectTrip = async (tripId, driverId) => {
  return await request(`${ENDPOINT}/${tripId}/reject?driverId=${driverId}`, {
    method: 'PUT',
  });
};

export const notifyArrival = async (tripId, userId) => {
  return await request(`${ENDPOINT}/${tripId}/arrival?userId=${userId}`, {
    method: 'PUT',
  });
};

export const notifyDropoff = async (tripId, userId) => {
  return await request(`${ENDPOINT}/${tripId}/dropoff?userId=${userId}`, {
    method: 'PUT',
  });
};

export const startTripByDriver = async (tripId, userId) => {
  return await request(`${ENDPOINT}/${tripId}/start/driver?userId=${userId}`, {
    method: 'PUT',
  });
};

export const startTripByClient = async (tripId, clientId) => {
  return await request(`${ENDPOINT}/${tripId}/start/client?clientId=${clientId}`, {
    method: 'PUT',
  });
};

export const updateTripStatus = async (userId, statusData) => {
  return await request(`${ENDPOINT}/status?userId=${userId}`, {
    method: 'PUT',
    body: statusData,
  });
};

export const getDriverHistory = async (driverId) => {
  return await request(`${ENDPOINT}/driver/${driverId}`);
};

export const completeTripByDriver = async (tripId, userId) => {
  return await request(`${ENDPOINT}/${tripId}/complete/driver?userId=${userId}`, {
    method: 'PUT',
  });
};

export const completeTripByClient = async (tripId, clientId) => {
  return await request(`${ENDPOINT}/${tripId}/complete/client?clientId=${clientId}`, {
    method: 'PUT',
  });
};

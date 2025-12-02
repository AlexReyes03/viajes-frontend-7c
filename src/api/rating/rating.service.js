import request from '../fetch-wrapper';

const ENDPOINT = '/ratings';

export const rateDriver = async (clientId, ratingData) => {
  return await request(`${ENDPOINT}/driver?clientId=${clientId}`, {
    method: 'POST',
    body: ratingData,
  });
};

export const rateClient = async (driverId, ratingData) => {
  return await request(`${ENDPOINT}/client?driverId=${driverId}`, {
    method: 'POST',
    body: ratingData,
  });
};

export const getDriverRatings = async (driverId) => {
  return await request(`${ENDPOINT}/driver/${driverId}`);
};

export const getClientRatings = async (clientId) => {
  return await request(`${ENDPOINT}/client/${clientId}`);
};

export const getRatingsByTrip = async (tripId) => {
  return await request(`${ENDPOINT}/trip/${tripId}`);
};

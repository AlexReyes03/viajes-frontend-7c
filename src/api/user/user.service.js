import request from '../fetch-wrapper';

const ENDPOINT = '/users';

const getAllUsers = async () => {
  return await request(ENDPOINT);
};

const getUserById = async (id) => {
  return await request(`${ENDPOINT}/${id}`);
};

const createUser = async (userData) => {
  return await request(ENDPOINT, {
    method: 'POST',
    body: userData,
  });
};

const updateUser = async (userData) => {
  return await request(ENDPOINT, {
    method: 'PUT',
    body: userData,
  });
};

const deleteUser = async (userData) => {
  return await request(ENDPOINT, {
    method: 'DELETE',
    body: userData,
  });
};

export const UserService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};

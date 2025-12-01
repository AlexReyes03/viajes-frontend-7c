import request from '../fetch-wrapper';

export const login = async (credentials) => {
  const payload = await request('/auth/login', {
    method: 'POST',
    body: credentials,
  });
  return payload;
};

export const register = async (data) => {
  const payload = await request('/auth/register', {
    method: 'POST',
    body: data,
  });
  return payload;
};

export const logout = async () => {
  await request('/auth/logout', { method: 'POST' });
  localStorage.removeItem('token');
};

export const googleOAuth2Login = async (idToken) => {
  const payload = await request('/auth/oauth2/google', {
    method: 'POST',
    body: { idToken },
  });
  return payload;
};

export const requestOtp = (email) => request('/auth/forgot-password', { method: 'POST', body: { email } });

export const verifyOtp = (email, code) => request('/auth/verify-code', { method: 'POST', body: { email, code } });

export const resetPassword = (email, code, newPassword) =>
  request('/auth/reset-password', {
    method: 'POST',
    body: { email, code, newPassword },
  });

export const changePassword = async (currentPassword, newPassword) => {
  const sanitizedCurrentPassword = currentPassword?.trim();
  const sanitizedNewPassword = newPassword?.trim();

  const payload = await request('/auth/change-password', {
    method: 'POST',
    body: {
      currentPassword: sanitizedCurrentPassword,
      newPassword: sanitizedNewPassword,
    },
  });

  return payload;
};

/**
 * Complete driver registration with profile, vehicle, and document
 * @param {number} userId - User ID from initial registration
 * @param {string} licenseNumber - Driver's license number
 * @param {object} vehicleData - Vehicle information
 * @param {File} documentFile - PDF file for criminal record
 * @returns {Promise} - Promise that resolves when all steps complete
 */
export const completeDriverRegistration = async (userId, licenseNumber, vehicleData, documentFile) => {
  try {
    // Step 1: Create driver profile
    const profileResponse = await request(`/drivers/profile?userId=${userId}&licenseNumber=${licenseNumber}`, {
      method: 'POST'
    });

    const driverProfileId = profileResponse.data?.driverProfileId;
    if (!driverProfileId) {
      throw new Error('No se pudo obtener el ID del perfil de conductor');
    }

    // Step 2: Add vehicle
    await request(`/drivers/profile/${driverProfileId}/vehicles`, {
      method: 'POST',
      body: vehicleData
    });

    // Step 3: Upload document
    const formData = new FormData();
    formData.append('file', documentFile);
    formData.append('documentType', 'NO_CRIMINAL_RECORD');

    await request(`/drivers/profile/${driverProfileId}/documents/upload`, {
      method: 'POST',
      body: formData,
      isMultipart: true
    });

    return { success: true, message: 'Registro de conductor completado exitosamente' };
  } catch (error) {
    throw error;
  }
};

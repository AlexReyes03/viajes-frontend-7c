import React, { createContext, useState, useEffect, useMemo } from 'react';
import { jwtDecode } from 'jwt-decode';
import * as authService from '../api/auth/auth.service';
import { setAuthHandlers } from '../api/fetch-wrapper';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp > currentTime) {
          setUser({
            id: decodedToken.id,
            email: decodedToken.sub,
            roles: decodedToken.roles,
          });
          setIsAuthenticated(true);
        } else {
          // Token expirado
          handleLogout();
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        handleLogout();
      }
    }
    setIsLoading(false);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };
  
  useEffect(() => {
    setAuthHandlers({
      handleAuthError: (status, message, endpoint, hadAuthToken) => {
        if (hadAuthToken) {
          console.warn(`Auth error (${status}) on ${endpoint}: ${message}. Logging out.`);
          handleLogout();
        }
      },
    });
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    if (response && response.token) {
      const { token: newToken } = response;
      localStorage.setItem('token', newToken);
      setToken(newToken);
      const decodedToken = jwtDecode(newToken);
      setUser({
        id: decodedToken.id,
        email: decodedToken.sub,
        roles: decodedToken.roles,
      });
      setIsAuthenticated(true);
      return { success: true };
    }
    // Si el login falla, el fetch-wrapper lanzará un error que puede ser atrapado en el componente del formulario.
    // No es necesario devolver un { success: false } explícitamente a menos que el servicio no lance error.
  };

  const logout = () => {
    // Aquí podrías llamar a un endpoint de logout en el backend si existiera
    // authService.logout(); 
    handleLogout();
  };

  const authContextValue = useMemo(
    () => ({
      user,
      token,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }),
    [user, token, isAuthenticated, isLoading]
  );

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TripProvider } from './contexts/TripContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <TripProvider>
          <AppRouter />
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

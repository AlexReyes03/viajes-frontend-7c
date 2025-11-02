import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './routes/AppRouter';

function App() {
  return (
    <BrowserRouter basename="/app">
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;

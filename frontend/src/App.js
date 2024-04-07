// src/App.js
import React from 'react';
import { AppRoutes } from './routes/Route';
import { AppProvider } from './contexts/AppContext';

export const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};
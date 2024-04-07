// src/routes/Route.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Register } from '../pages/Register/Register';
import { Login } from '../pages/Login/Login';
import { PrivateRoute } from './PrivateRoute';
import { AuthProvider } from '../contexts/AuthContext';

export const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute/>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};
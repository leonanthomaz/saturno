import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Dashboard from '../pages/Dashboard/Dashboard';

export const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // Verificar se o usuário está definido antes de desestruturar
  if (loading) return <div>Carregando...</div>;

  return user ? <Dashboard/> : <Navigate to="/login" />;
};
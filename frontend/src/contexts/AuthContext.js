import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from './AppContext'; // Importe useAppContext

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { dispatch } = useAppContext(); // Use o dispatch do AppContext

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:8080/auth/user', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          dispatch({ type: 'SET_USER', payload: response.data});
          setUser(response.data);
          navigate('/dashboard');
        } catch (error) {
          console.error('Erro ao carregar usuário:', error);
          setUser(null);
          localStorage.removeItem('token'); // Remove o token expirado
          navigate('/login'); // Redireciona para a página de login
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
      logout()
    }
  }, [dispatch, navigate]);
  

  const value = {
    user,
    loading,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

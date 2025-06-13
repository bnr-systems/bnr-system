// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import api from '/src/api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    try {
      const response = await api.post('/login', { email, password });
      const token = response.data.token;

      localStorage.setItem('token', token);
      setToken(token);

      const profile = await api.get('/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(profile.data.data);
    } catch (error) {
      logout(); // limpa estado
      throw error; // deixa o componente tratar a mensagem
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const userPecasRoute = useMemo(() => {
    if (user?.userType === "fornecedor") return "/PecasFornecedor";
    if (user?.userType === "oficina") return "/PecasOficina";
    return "/login";
  }, [user]);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    setToken(storedToken);

    api.get('/profile', {
      headers: { Authorization: `Bearer ${storedToken}` }
    })
      .then(response => {
        setUser(response.data.data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      isLoading,
      userPecasRoute,
      token,
      setUser,
      setToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

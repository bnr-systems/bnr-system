import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '/src/api/api';
import { useAuth } from '/src/context/AuthContext'; // NOVO

const PerfilContext = createContext();

export const usePerfil = () => {
  const context = useContext(PerfilContext);
  if (!context) {
    throw new Error('usePerfil deve ser usado dentro de um PerfilProvider');
  }
  return context;
};

export const PerfilProvider = ({ children }) => {
  const { token } = useAuth(); // NOVO
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    if (!token) {
      setLoading(false);
      setError("Token não encontrado");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get("https://vps55372.publiccloud.com.br/api/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
    } catch (error) {
      console.error("Erro ao buscar perfil:", error.response?.data || error.message);
      setError(error.response?.data?.message || "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData) => {
    if (!token) throw new Error("Token não encontrado");

    try {
      setLoading(true);
      const response = await api.put("https://vps55372.publiccloud.com.br/api/profile", userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error.response?.data || error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearUserProfile = () => {
    setUser(null);
    setError(null);
    setLoading(false);
  };

  const refreshProfile = () => {
    fetchUserProfile();
  };

  useEffect(() => {
    fetchUserProfile();
  }, [token]); // reexecuta se o token mudar

  const value = {
    user,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    clearUserProfile,
    refreshProfile
  };

  return (
    <PerfilContext.Provider value={value}>
      {children}
    </PerfilContext.Provider>
  );
};

export default PerfilContext;

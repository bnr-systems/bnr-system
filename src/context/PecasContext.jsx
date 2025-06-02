import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePerfil } from '/src/context/PerfilContext'; // se ainda estiver usando isso
import { useAuth } from '/src/context/AuthContext'; // agora usando o useAuth
import api from '/src/api/api';

const PecasContext = createContext();

export const usePecas = () => {
  const context = useContext(PecasContext);
  if (!context) {
    throw new Error('usePecas deve ser usado dentro de um PecasProvider');
  }
  return context;
};

export const PecasProvider = ({ children }) => {
  const { token, user } = useAuth(); // pegando token e usuário do AuthContext
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pecas, setPecas] = useState([]);
  const [pecasLoading, setPecasLoading] = useState(false);

  const determineUserType = async () => {
    if (!token) {
      setLoading(false);
      setError("Token não encontrado");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (user && user.userType) {
        setUserType(user.userType);
        setLoading(false);
        return;
      }

      const response = await api.get(
        "https://vps55372.publiccloud.com.br/api/profile",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetchedUserType = response.data?.data?.userType;
      setUserType(fetchedUserType);
    } catch (error) {
      console.error("Erro ao obter tipo de usuário:", error);
      setError("Erro ao carregar tipo de usuário");
    } finally {
      setLoading(false);
    }
  };

  const fetchPecas = async () => {
    if (!token || !userType) return;

    try {
      setPecasLoading(true);

      const endpoint = userType === "fornecedor"
        ? "https://vps55372.publiccloud.com.br/api/pecas/fornecedor"
        : "https://vps55372.publiccloud.com.br/api/pecas/oficina";

      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPecas(response.data?.data || []);
    } catch (error) {
      console.error("Erro ao buscar peças:", error);
      setError("Erro ao carregar peças");
    } finally {
      setPecasLoading(false);
    }
  };

  const addPeca = async (pecaData) => {
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await api.post(
        "https://vps55372.publiccloud.com.br/api/pecas",
        pecaData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPecas(prev => [...prev, response.data.data]);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar peça:", error);
      throw error;
    }
  };

  const updatePeca = async (pecaId, pecaData) => {
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await api.put(
        `https://vps55372.publiccloud.com.br/api/pecas/${pecaId}`,
        pecaData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPecas(prev => prev.map(peca =>
        peca.id === pecaId ? response.data.data : peca
      ));
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar peça:", error);
      throw error;
    }
  };

  const deletePeca = async (pecaId) => {
    if (!token) throw new Error("Token não encontrado");

    try {
      await api.delete(
        `https://vps55372.publiccloud.com.br/api/pecas/${pecaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPecas(prev => prev.filter(peca => peca.id !== pecaId));
    } catch (error) {
      console.error("Erro ao deletar peça:", error);
      throw error;
    }
  };

  const solicitarPeca = async (pecaId, quantidade) => {
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await api.post(
        "https://vps55372.publiccloud.com.br/api/pecas/solicitar",
        { pecaId, quantidade },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao solicitar peça:", error);
      throw error;
    }
  };

  const clearPecasData = () => {
    setUserType(null);
    setPecas([]);
    setError(null);
    setLoading(false);
  };

  const refreshUserType = () => {
    determineUserType();
  };

  useEffect(() => {
    determineUserType();
  }, [user]);

  useEffect(() => {
    if (userType) {
      fetchPecas();
    }
  }, [userType]);

  const value = {
    userType,
    loading,
    error,
    pecas,
    pecasLoading,
    determineUserType,
    fetchPecas,
    addPeca,
    updatePeca,
    deletePeca,
    solicitarPeca,
    clearPecasData,
    refreshUserType,
    isFornecedor: userType === "fornecedor",
    isOficina: userType === "oficina",
  };

  return (
    <PecasContext.Provider value={value}>
      {children}
    </PecasContext.Provider>
  );
};

export default PecasContext;

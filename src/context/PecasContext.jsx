import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePerfil } from '/src/context/PerfilContext'; // assumindo que você já tem o PerfilContext
import api from '/src/api/api';

// Criar o contexto
const PecasContext = createContext();

// Hook personalizado para usar o contexto
export const usePecas = () => {
  const context = useContext(PecasContext);
  if (!context) {
    throw new Error('usePecas deve ser usado dentro de um PecasProvider');
  }
  return context;
};

// Provider do contexto
export const PecasProvider = ({ children }) => {
  const { user } = usePerfil(); // pega o usuário do PerfilContext
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pecas, setPecas] = useState([]);
  const [pecasLoading, setPecasLoading] = useState(false);

  // Função para determinar o tipo de usuário
  const determineUserType = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setError("Token não encontrado");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Se já temos o usuário do PerfilContext, usa ele
      if (user && user.userType) {
        setUserType(user.userType);
        setLoading(false);
        return;
      }

      // Caso contrário, busca o tipo de usuário
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

  // Função para buscar peças baseado no tipo de usuário
  const fetchPecas = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userType) return;

    try {
      setPecasLoading(true);
      
      // Endpoint diferente baseado no tipo de usuário
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

  // Função para adicionar peça (para fornecedores)
  const addPeca = async (pecaData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await api.post(
        "https://vps55372.publiccloud.com.br/api/pecas",
        pecaData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Atualizar a lista local
      setPecas(prev => [...prev, response.data.data]);
      return response.data;
    } catch (error) {
      console.error("Erro ao adicionar peça:", error);
      throw error;
    }
  };

  // Função para atualizar peça
  const updatePeca = async (pecaId, pecaData) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    try {
      const response = await api.put(
        `https://vps55372.publiccloud.com.br/api/pecas/${pecaId}`,
        pecaData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Atualizar a lista local
      setPecas(prev => prev.map(peca => 
        peca.id === pecaId ? response.data.data : peca
      ));
      return response.data;
    } catch (error) {
      console.error("Erro ao atualizar peça:", error);
      throw error;
    }
  };

  // Função para deletar peça
  const deletePeca = async (pecaId) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    try {
      await api.delete(
        `https://vps55372.publiccloud.com.br/api/pecas/${pecaId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remover da lista local
      setPecas(prev => prev.filter(peca => peca.id !== pecaId));
    } catch (error) {
      console.error("Erro ao deletar peça:", error);
      throw error;
    }
  };

  // Função para solicitar peça (para oficinas)
  const solicitarPeca = async (pecaId, quantidade) => {
    const token = localStorage.getItem("token");
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

  // Função para limpar dados
  const clearPecasData = () => {
    setUserType(null);
    setPecas([]);
    setError(null);
    setLoading(false);
  };

  // Função para recarregar tipo de usuário
  const refreshUserType = () => {
    determineUserType();
  };

  // Determinar tipo de usuário quando o contexto é montado ou quando o usuário muda
  useEffect(() => {
    determineUserType();
  }, [user]);

  // Buscar peças quando o tipo de usuário é determinado
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
    // Funções de conveniência para verificar tipo
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
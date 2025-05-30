import React, { useEffect, useState } from "react";
import api from "/src/api/api";
import PecasFornecedor from "./PecasFornecedor";
import PecasOficina from "./PecasOficina";

const PecasRouter = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserType(response.data?.data?.userType);
      } catch (error) {
        console.error("Erro ao obter tipo de usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserType();
  }, [token]);

  if (loading) return <p>Carregando...</p>;

  if (userType === "fornecedor") return <PecasFornecedor />;
  if (userType === "oficina") return <PecasOficina />;

  return <p>Tipo de usuário desconhecido ou não autenticado.</p>;
};

export default PecasRouter;

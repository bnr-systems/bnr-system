import React from "react";
import { usePecas } from "/src/context/PecasContext";
import PecasFornecedor from "./PecasFornecedor";
import PecasOficina from "./PecasOficina";

const PecasRouter = () => {
  const { userType, loading, error, refreshUserType } = usePecas();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={refreshUserType}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Renderizar componente baseado no tipo de usuário
  if (userType === "fornecedor") return <PecasFornecedor />;
  if (userType === "oficina") return <PecasOficina />;

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600 mb-4">Tipo de usuário desconhecido ou não autenticado.</p>
        <button
          onClick={refreshUserType}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Recarregar
        </button>
      </div>
    </div>
  );
};

export default PecasRouter;
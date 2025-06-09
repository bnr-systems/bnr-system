import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePerfil } from "/src/context/PerfilContext"; 
import Menu from "/src/components/Menu";
import userIcon from "/src/assets/images/user-icon.png";
import { useAuth } from "/src/context/AuthContext"; 


function Perfil() {
    const navigate = useNavigate();
    const { user, loading, error, refreshProfile } = usePerfil();
    const { user: authUser, token } = useAuth();

    useEffect(() => {
  if (!authUser) {
    navigate("/login");
  }
}, [authUser]);

    return (
        <div className="container mx-auto p-4">
            <Menu />

            <div className="min-h-screen flex flex-col items-center justify-start p-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Perfil</h2>

                <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md flex flex-col items-center">
                    <img src={userIcon} alt="Usuário" className="w-24 h-24 mb-4" />
                    
                    {loading && (
                        <p className="text-gray-500 text-center">Carregando perfil...</p>
                    )}
                    
                    {error && (
                        <div className="text-center mb-4">
                            <p className="text-red-500 mb-2">{error}</p>
                            <button
                                onClick={refreshProfile}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    )}
                    
                    {user && !loading && (
                        <div className="text-gray-700 text-center">
                            <p className="text-xl font-bold text-gray-800 mb-4 text-center">{user.name}</p>
                            <p><span className="font-semibold">Email:</span> {user.email}</p>
                            <p><span className="font-semibold">Tipo de Usuário:</span> {user.userType || "Não informado"}</p>
                        </div>
                    )}
                    
                    <button
                        onClick={() => navigate("/unidades")}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    >
                        Voltar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Perfil;
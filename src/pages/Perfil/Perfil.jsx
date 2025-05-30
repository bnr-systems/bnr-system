import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePerfil } from "/src/context/PerfilContext"; // ajuste o caminho conforme necessário
import iconMenu from "/src/assets/images/icon-menu.svg";
import userIcon from "/src/assets/images/user-icon.png";

function Perfil() {
    const navigate = useNavigate();
    const { user, loading, error, refreshProfile } = usePerfil();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="container mx-auto p-4">
            {!menuOpen && (
                <button
                    onClick={() => setMenuOpen(true)}
                    className="absolute top-4 left-4 z-50 p-2 rounded text-white"
                >
                    <img src={iconMenu} alt="Menu" className="w-6 h-6" />
                </button>
            )}

            {menuOpen && (
                <div
                    onClick={() => setMenuOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-30"
                />
            )}

            <aside
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform ease-in-out duration-500 z-40 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="p-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center">
                    <span>Menu</span>
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="text-white hover:text-gray-300"
                    >
                        ✕
                    </button>
                </div>
                <button className="p-4 hover:bg-gray-700 text-left w-full" onClick={() => navigate("/unidades")}>
                    Unidades
                </button>
                <button className="p-4 hover:bg-gray-700 text-left w-full" onClick={() => navigate("/pecas")}>
                    Peças
                </button>
                <button className="p-4 hover:bg-gray-700 text-left w-full" onClick={() => navigate("/pecasVinculadas")}>
                    Peças Vinculadas
                </button>
            </aside>

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
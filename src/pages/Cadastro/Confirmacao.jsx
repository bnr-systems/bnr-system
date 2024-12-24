import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Confirmacao() {
    const navigate = useNavigate();

    const handleCadastro = () => {
        navigate("/Login");
    };

    const location = useLocation();
    const email = location.state?.email || "";
  
    const maskedEmail = email.replace(/(?<=.{4})(.*)(?=@)/g, (match) => '*'.repeat(match.length));

    return (
        <div className="flex flex-col h-full items-center justify-center bg-[#E5E5E5] p-4 w-full">
            <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md sm:max-w-lg lg:max-w-xl text-center">
                    <h2 className="text-2xl font-bold mb-6">E-mail enviado!</h2>
                    <p className="text-gray-700 mb-6">
                        Um e-mail foi enviado para {maskedEmail}, por favor confirme seu acesso e confirme seu usuário.
                    </p>
                    <button
                        onClick={handleCadastro}
                        className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded hover:bg-[#fcb645]"
                    >
                        Entrar
                    </button>
                </div>
            </main>
        </div>
    );
}

export default Confirmacao;

import React from "react";
import { useNavigate } from "react-router-dom";

function ValidacaoEmail() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 w-full">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            E-mail Validado com Sucesso!
          </h2>
          <p className="text-gray-600 mb-6">
            Seu e-mail foi confirmado com sucesso. Agora você pode acessar a sua conta.
          </p>
          <button
            onClick={handleGoToLogin}
            className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645] transition-all duration-300"
          >
            Entrar
          </button>
        </div>
      </main>
    </div>
  );
}

export default ValidacaoEmail;

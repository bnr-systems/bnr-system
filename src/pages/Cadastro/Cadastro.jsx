import React from "react";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const navigate = useNavigate();

  const handleConfirmacao = () => {
    navigate("/Confirmacao");
  };

  return (
    <div className="flex flex-col p-0 m-0">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-96">
        <form onSubmit={handleConfirmacao} className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg ">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="nome"
              required
            >
              Nome
            </label>
            <input
              type="text"
              id="nome"
              className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
              required
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tipoUsuario"
              required
            >
              Tipo de Usuário
            </label>
            <select
              id="tipoUsuario"
              className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="oficina">Oficina</option>
              <option value="fornecedor">Fornecedor</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645]"
          >
            Cadastrar
          </button>
        </form>
      </main>
    </div>
  );
}

export default Cadastro;

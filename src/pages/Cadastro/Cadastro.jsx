import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

function Cadastro() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  function onSubmit(data) {
    navigate("/Confirmacao", { state: { email: data.email } });
  }

  function handleKeyDown(e){
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)(); 
    }
  };
  return (
    <div className="flex flex-col p-0 m-0">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-96">
        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
        >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nome">
              Nome
            </label>
            <input
              type="text"
              id="nome"
              className={`${errors?.name ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
              {...register("name", { required: true })}
            />
            {errors?.name?.type === 'required' && <p className="text-red-500 text-xs">Preencha seu nome</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`${errors?.email ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
              {...register("email", { required: true })}
            />
            {errors?.email?.type === 'required' && <p className="text-red-500 text-xs">Preencha seu e-mail</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipoUsuario">
              Tipo de Usuário
            </label>
            <select
              id="tipoUsuario"
              className={`${errors?.user ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
              {...register("user", { validate: (value) => value !== "0" })}
            >
              <option value="0">Selecione seu tipo de usuário...</option>
              <option value="oficina">Oficina</option>
              <option value="fornecedor">Fornecedor</option>
            </select>
            {errors?.user?.type === 'validate' && <p className="text-red-500 text-xs">Preencha o seu tipo de usuário</p>}
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

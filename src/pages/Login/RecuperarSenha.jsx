import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";

function RecuperarSenha() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [emailEnviado, setEmailEnviado] = useState(false);

  function onSubmit(data) {
    setEmailEnviado(true);
    reset();
  }

  useEffect(() => {
    if (emailEnviado) {
      const timer = setTimeout(() => {
        setEmailEnviado(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [emailEnviado]);

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)(); 
    }
  }

  return (
    <div className="flex flex-col p-0 m-0">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-96">
        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Recuperar Senha
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className={`${errors?.email ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
              {...register("email", { 
                required: true, 
                validate: (value => validator.isEmail(value)),
              })}
            />
            {errors?.email?.type === 'required' && <p className="text-red-500 text-xs">Preencha seu e-mail</p>}
            {errors?.email?.type === 'validate' && <p className="text-red-500 text-xs">E-mail inválido</p>}
          </div>

          <button
            type="submit"
            className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645] transition duration-200"
          >
            Enviar link de recuperação
          </button>

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Voltar para a tela de login
            </a>
          </div>
          {emailEnviado && (
            <p className="text-center text-green-500 mt-4">
              Email de recuperação enviado com sucesso!
            </p>
          )}
        </form>
      </main>
    </div>
  );
}

export default RecuperarSenha;

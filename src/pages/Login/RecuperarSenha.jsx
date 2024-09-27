import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

function RecuperarSenha() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [emailEnviado, setEmailEnviado] = useState(false);

  function onSubmit(data) {
    // Simular envio de email
    setEmailEnviado(true);
    setTimeout(() => {
      navigate("/");
    }, 5000); 
  }

  return (
    <div className="flex flex-col p-0 m-0 min-h-screen">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-96">
      <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg"
          onKeyDown={handleKeyDown}
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Recuperar Senha
          </h2>

          {!emailEnviado ? (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={`${errors?.email ? "border-red-500" : "border-gray-300"} border rounded w-full py-2 px-3 text-gray-700`}
                  {...register("email", { required: "Email é obrigatório" })}
                />
                {errors?.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>

              <button
                type="submit"
                className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645] transition duration-200"
              >
                Enviar link de recuperação
              </button>
            </>
          ) : (
            <p className="text-center text-green-500">
              Email de recuperação enviado com sucesso! Redirecionando...
            </p>
          )}

          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-gray-500 hover:text-gray-700">
              Voltar para o login
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

export default RecuperarSenha;

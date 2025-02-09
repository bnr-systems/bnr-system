import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import validator from "validator";
import axios from "axios";

function RecuperarSenha() {
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors }, 
    setError, 
    clearErrors 
  } = useForm();
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [emailValidando, setEmailValidando] = useState(false);
  const [mensagemErro, setMensagemErro] = useState(""); // Mensagem de erro personalizada

  async function validarEmail(email) {
    try {
      setEmailValidando(true);
      setMensagemErro(""); // Reseta qualquer mensagem de erro anterior
      const response = await axios.post(
        "https://vps55372.publiccloud.com.br/api/forgot-password", 
        { email }
      );
      if (response.data.status) {
        setEmailEnviado(true); // Marca como enviado com sucesso
        reset(); // Reseta o formulário
      } else {
        setMensagemErro("E-mail não encontrado no sistema.");
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setMensagemErro("E-mail não encontrado no sistema.");
      } else if (error.response?.status === 500) {
        setMensagemErro("E-mail de redefinição já enviado.");
      } else {
        setMensagemErro("Ocorreu um erro inesperado. Tente novamente.");
      }
    } finally {
      setEmailValidando(false);
    }
  }

  function onSubmit(data) {
    validarEmail(data.email);
  }

  // Reseta os erros ao digitar no campo
  function handleChange() {
    clearErrors("email"); // Limpa os erros do campo "email"
    setMensagemErro(""); // Limpa mensagens de erro específicas
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
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  }

  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#E5E5E5] p-4 w-full">
      <main className="flex flex-col items-center justify-center bg-[#E5E5E5] p-4 w-full">
        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Redefinir Senha
          </h2>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className={`${errors?.email || mensagemErro ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
              {...register("email", {
                required: true,
                validate: (value) => validator.isEmail(value),
              })}
              onChange={handleChange} // Reseta erros ao digitar
            />
            {errors?.email?.type === "required" && (
              <p className="text-red-500 mt-2">Preencha seu e-mail</p>
            )}
            {errors?.email?.type === "validate" && (
              <p className="text-red-500 mt-2">E-mail inválido</p>
            )}
            {mensagemErro && (
              <p className="text-red-500 mt-2">{mensagemErro}</p>
            )}
          </div>

          <button
            type="submit"
            className={`bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full ${emailValidando ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fcb645]"} transition duration-200`}
            disabled={emailValidando}
          >
            {emailValidando ? "Enviando..." : "Enviar"}
          </button>

          <div className="mt-4 text-center">
            <a href="/Login" className="text-sm text-gray-500 hover:text-gray-700">
              Voltar
            </a>
          </div>
          {emailEnviado && (
            <p className="text-center text-green-500 mt-4">
              E-mail de redefinição enviado com sucesso!
            </p>
          )}
        </form>
      </main>
    </div>
  );
}

export default RecuperarSenha;

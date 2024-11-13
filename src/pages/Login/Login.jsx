import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import validator from "validator";
import axios from "axios";
import eyeOn from "/src/assets/images/eye.svg";
import eyeOff from "/src/assets/images/eye-off.svg";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(""); // Novo estado para armazenar o erro da API

  const loginUser = async (data) => {
    try {
      const response = await axios.post("http://vps55372.publiccloud.com.br/api/login", {
        email: data.email,
        password: data.password,
      });

      alert("Cadastro feito com sucesso")
      navigate("/", { state: { email: data.email } });

    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          const errorMessage = error.response.data.message; // Obtém a mensagem de erro do servidor
          setApiError("Usuário não confirmado. Por favor, verifique seu e-mail."); // Define o erro da API para exibir na interface
        } else {
          setApiError("Erro desconhecido ao fazer login. Por favor, tente novamente mais tarde.");
        }
      } else {
        console.error("Erro ao fazer login:", error);
        setApiError("Erro ao se comunicar com o servidor.");
      }
    }
  };

  function onSubmit(data) {
    loginUser(data);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  }

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#E5E5E5] p-4 w-full">
      <main className="flex flex-col items-center justify-center bg-[#E5E5E5] p-4 w-full over">
        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          noValidate
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Login 
          </h2>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className={`${errors?.email ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
              {...register("email", {
                required: true,
                validate: (value) => validator.isEmail(value),
              })}
              onChange={(e) => {
                register("email").onChange(e); // Mantém as validações do React Hook Form
                setApiError(""); // Limpa o erro da API ao alterar o campo
              }}
            />
            {errors?.email?.type === "required" && (
              <p className="text-red-500 text-xs">Preencha seu e-mail</p>
            )}
            {errors?.email?.type === "validate" && (
              <p className="text-red-500 text-xs">E-mail inválido</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`${errors?.password ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
                {...register("password", {
                  required: true,
                  minLength: 7,
                  validate: (value) =>
                    /^[A-Z].*(?=.*\d)/.test(value) ||
                    "A senha deve começar com letra maiúscula e conter pelo menos um número.",
                })}
                onChange={(e) => {
                  register("password").onChange(e); // Mantém as validações do React Hook Form
                  setApiError(""); // Limpa o erro da API ao alterar o campo
                }}
              />
              <img
                src={showPassword ? eyeOff : eyeOn}
                alt="eye-icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPassword}
              />
            </div>
            {errors?.password?.type === "required" && (
              <p className="text-red-500 text-xs">Preencha sua senha</p>
            )}
            {errors?.password?.type === "minLength" && (
              <p className="text-red-500 text-xs">Senha inválida</p>
            )}
            {errors?.password?.type === "validate" && (
              <p className="text-red-500 text-xs">Senha inválida</p>
            )}
          </div>

          {apiError && (
            <p className="text-red-500 text-xs text-center mb-4">{apiError}</p>
          )}

          <button
            type="submit"
            className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645] transition-all duration-300"
          >
            Entrar
          </button>

          <div className="mt-4 text-center">
            <a
              href="/RecuperarSenha"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Esqueceu a senha?
            </a>
            <br />
            <a
              href="/cadastro"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Não possui uma conta? Cadastre-se agora
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;

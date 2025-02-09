import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import validator from "validator";
import { FaSpinner } from "react-icons/fa";
import eyeOn from "/src/assets/images/eye.svg";
import eyeOff from "/src/assets/images/eye-off.svg";
import api from "/src/api/api";

function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const loginUser = async (data) => {
    setLoading(true);
    try {
      const response = await api.post("/login", {
        email: data.email,
        password: data.password,
      });

      // Armazenar ID e Token no localStorage
      const { id, token } = response.data;

      // Verificar se há um usuário diferente logado
      const existingUserId = localStorage.getItem("id");
      if (existingUserId && existingUserId !== id.toString()) {
        localStorage.clear(); // Limpa o localStorage ao trocar de conta
      }

      localStorage.setItem("id", id);
      localStorage.setItem("token", token);

      navigate("/Unidades", { state: { email: data.email } });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setApiError(
            "Usuário não confirmado. Por favor, verifique seu e-mail."
          );
        } else {
          setApiError("E-mail ou senha incorretos");
        }
      } else {
        setApiError("Usuário não registrado. Tente novamente");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data) => {
    setApiError(""); // Limpar erros anteriores
    loginUser(data);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#E5E5E5] p-4 w-full">
      <main className="flex flex-col items-center justify-center bg-[#E5E5E5] p-4 w-full">
        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
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
              className={`${
                errors?.email ? "border-red-500" : "border-gray-400"
              } border rounded w-full py-2 px-3 text-gray-700`}
              {...register("email", {
                required: true,
                validate: (value) => validator.isEmail(value),
              })}
              onChange={(e) => {
                register("email").onChange(e);
                setApiError("");
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
                className={`${
                  errors?.password ? "border-red-500" : "border-gray-400"
                } border rounded w-full py-2 px-3 text-gray-700`}
                {...register("password", {
                  required: true,
                  minLength: 7,
                  validate: (value) =>
                    /^(?=.*[A-Z])(?=.*\d).*$/.test(value) ||
                    "A senha deve conter ao menos uma letra maiúscula e um número.",
                })}
                onChange={(e) => {
                  register("password").onChange(e);
                  setApiError("");
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
              <p className="text-red-500 text-xs mt-2">Preencha sua senha</p>
            )}
            {errors?.password?.type === "minLength" && (
              <p className="text-red-500 text-xs mt-2">Senha muito curta</p>
            )}
            {errors?.password?.type === "validate" && (
              <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>
            )}
          </div>

          {apiError && (
            <p className="text-red-500 text-xs text-center mb-4">{apiError}</p>
          )}

          <button
            type="submit"
            className={`bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645] transition-all duration-300 flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Entrando...
              </>
            ) : (
              "Entrar"
            )}
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

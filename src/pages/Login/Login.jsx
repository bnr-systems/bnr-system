import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import validator from "validator";
import eyeOn from "/src/assets/images/eye.svg";
import eyeOff from "/src/assets/images/eye-off.svg";

function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const password = watch("password");

  function onSubmit(data) {
    navigate("/", { state: { email: data.email } });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      handleSubmit(onSubmit)(); 
    }
  }

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col p-0 m-0">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-96">
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

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={`${errors?.password ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
                {...register("password", { required: true, minLength: 7 })}
              />
              <img
                src={showPassword ? eyeOff : eyeOn}
                alt="eye-icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPassword}
              />
            </div>
            {errors?.password?.type === 'required' && <p className="text-red-500 text-xs">Preencha sua senha</p>}
            {errors?.password?.type === 'minLength' && <p className="text-red-500 text-xs">A senha precisa ter no mínimo 7 caracteres</p>}
          </div>

          <button
            type="submit"
            className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645]"
          >
            Entrar
          </button>

          <div className="mt-4 text-center">
            <a href="/recuperar-senha" className="text-sm text-gray-500 hover:text-gray-700">
              Esqueceu a senha?
            </a><br />
            <a href="/cadastro" className="text-sm text-gray-500 hover:text-gray-700">
              Não possui uma senha? Cadastre-se agora
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;

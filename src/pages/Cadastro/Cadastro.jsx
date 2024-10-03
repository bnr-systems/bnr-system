import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import validator from "validator";
import eyeOn from "/src/assets/images/eye.svg";
import eyeOff from "/src/assets/images/eye-off.svg";

function Cadastro() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const password = watch("password");

  function onSubmit(data) {
    navigate("/Confirmacao", { state: { email: data.email } });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(onSubmit)(); 
    }
  }

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowPasswordConfirmation = () => setShowPasswordConfirmation(!showPasswordConfirmation);

  const passwordValidation = /^(?=.*[A-Z])(?=.*\d).{7,}$/;

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 w-full">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-96 ">

        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg"
          onSubmit={handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          noValidate
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
            Cadastro
          </h2>
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
                {...register("password", { 
                  required: true, 
                  minLength: 7, 
                  validate: value => passwordValidation.test(value) || "A senha deve iniciar com letra maiúscula e conter números "
                })}
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
            {errors?.password?.type === 'validate' && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="passwordConfirmation">
              Confirme sua senha
            </label>
            <div className="relative">
              <input
                type={showPasswordConfirmation ? "text" : "password"}
                id="passwordConfirmation"
                className={`${errors?.passwordConfirmation ? "border-red-500" : "border-gray-400"} border rounded w-full py-2 px-3 text-gray-700`}
                {...register("passwordConfirmation", { 
                  required: true, 
                  validate: value => value === password || "As senhas não coincidem"
                })}
              />
              <img
                src={showPasswordConfirmation ? eyeOff : eyeOn}
                alt="eye-icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPasswordConfirmation}
              />
            </div>
            {errors?.passwordConfirmation?.type === 'required' && <p className="text-red-500 text-xs">Confirme sua senha</p>}
            {errors?.passwordConfirmation?.type === 'validate' && <p className="text-red-500 text-xs">As senhas não coincidem</p>}
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
              <option value="0" selected disabled>Selecione seu tipo de usuário...</option>
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
          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-gray-500 hover:text-gray-700">
              Voltar 
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Cadastro;

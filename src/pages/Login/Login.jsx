import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import eyeOn from "/src/assets/images/eye.svg";
import eyeOff from "/src/assets/images/eye-off.svg";
import { useAuth } from "/src/context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setFormErrors({ ...formErrors, [name]: null });
    setApiError("");
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Preencha seu e-mail";
    } else if (!validator.isEmail(formData.email)) {
      errors.email = "E-mail inválido";
    }

    if (!formData.password) {
      errors.password = "Preencha sua senha";
    } else if (formData.password.length < 7) {
      errors.password = "Senha muito curta";
    } else if (!/^(?=.*[A-Z])(?=.*\d).*$/.test(formData.password)) {
      errors.password = "A senha deve conter ao menos uma letra maiúscula e um número.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

    const loginUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password); // ✅ Usa login do contexto
      navigate("/Unidades", { state: { email: formData.email } });
    } catch (error) {
      if (error.response?.status === 403) {
        setApiError("Usuário não confirmado. Verifique seu e-mail.");
      } else if (error.response?.status === 401) {
        setApiError("Usuário não registrado. Tente novamente.");
      } else {
        setApiError("E-mail ou senha incorretos.");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#E5E5E5] p-4 w-full">
      <main className="flex flex-col items-center justify-center bg-[#E5E5E5] p-4 w-full">
        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            loginUser();
          }}
          noValidate
        >
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Login</h2>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`border rounded w-full py-2 px-3 text-gray-700 ${
                formErrors.email ? "border-red-500" : "border-gray-400"
              }`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`border rounded w-full py-2 px-3 text-gray-700 ${
                  formErrors.password ? "border-red-500" : "border-gray-400"
                }`}
              />
              <img
                src={showPassword ? eyeOff : eyeOn}
                alt="eye-icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPassword}
              />
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
            )}
          </div>

          {apiError && (
            <p className="text-red-500 text-xs text-center mb-4">{apiError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645] transition-all duration-300 flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </button>

          <div className="mt-4 text-center">
            <a href="/RecuperarSenha" className="text-sm text-gray-500 hover:text-gray-700">
              Esqueceu a senha?
            </a>
            <br />
            <a href="/cadastro" className="text-sm text-gray-500 hover:text-gray-700">
              Não possui uma conta? Cadastre-se agora
            </a>
          </div>
        </form>
      </main>
    </div>
  );
}

export default Login;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import validator from "validator";
import eyeOn from "/src/assets/images/eye.svg";
import eyeOff from "/src/assets/images/eye-off.svg";
import api from "/src/api/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFormErrors({
      ...formErrors,
      [name]: null
    });
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
      const response = await api.post("/login", {
        email: formData.email,
        password: formData.password,
      });
      
      const { id, token, user } = response.data;

      const existingUserId = localStorage.getItem("id");
      if (existingUserId && existingUserId !== id.toString()) {
      }

      localStorage.setItem("id", id);
      localStorage.setItem("token", token);
      
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        fetchAndStoreUserProfile(token);
      }
      
      window.dispatchEvent(new Event("userUpdated"));

      navigate("/Unidades", { state: { email: formData.email } });
    } catch (error) {
      if (error.response) {
        if (error.response.status === 403) {
          setApiError("Usuário não confirmado. Por favor, verifique seu e-mail.");
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

  const fetchAndStoreUserProfile = async (token) => {
    try {
      const profileResponse = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.setItem("user", JSON.stringify(profileResponse.data.data));
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      loginUser();
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <div className="flex flex-col h-full items-center justify-center bg-[#E5E5E5] p-4 w-full">
      <main className="flex flex-col items-center justify-center bg-[#E5E5E5] p-4 w-full">
        <form
          className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
          onSubmit={handleSubmit}
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
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${
                formErrors.email ? "border-red-500" : "border-gray-400"
              } border rounded w-full py-2 px-3 text-gray-700`}
            />
            {formErrors.email && (
              <p className="text-red-500 text-xs">{formErrors.email}</p>
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${
                  formErrors.password ? "border-red-500" : "border-gray-400"
                } border rounded w-full py-2 px-3 text-gray-700`}
              />

              <img
                src={showPassword ? eyeOff : eyeOn}
                alt="eye-icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={toggleShowPassword}
              />
            </div>
            {formErrors.password && (
              <p className="text-red-500 text-xs mt-2">{formErrors.password}</p>
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
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Entrando...
              </div>
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
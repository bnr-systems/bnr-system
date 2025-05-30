import React, { useState } from "react";
import { useNavigate} from "react-router-dom";
import api from "/src/api/api";
import eyeOn from "/src/assets/images/eye.svg";
import eyeOff from "/src/assets/images/eye-off.svg";

function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [mensagemErro, setMensagemErro] = useState("");
  const [errosSenha, setErrosSenha] = useState([]);
  const [sucesso, setSucesso] = useState(false);
  const [validando, setValidando] = useState(false);
  const navigate = useNavigate();

   const token = localStorage.getItem("token");
 

  const validarSenha = (senha) => {
    const erros = [];
    if (senha.length < 8) {
      erros.push("A senha deve ter no mínimo 8 caracteres.");
    }
    if (!/[A-Z]/.test(senha)) {
      erros.push("A senha deve incluir pelo menos uma letra maiúscula.");
    }
    if (!/[!@#$%^&*]/.test(senha)) {
      erros.push("A senha deve incluir pelo menos um caractere especial.");
    }
    return erros;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagemErro("");
    const erros = validarSenha(novaSenha);

    if (erros.length > 0) {
      setErrosSenha(erros);
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setMensagemErro("As senhas não coincidem.");
      return;
    }

    try {
      setValidando(true);
      const response = await api.post(
        "/reset-password",
        { token, senha: novaSenha }
      );

      if (response.data.status) {
        setSucesso(true);
        setNovaSenha("");
        setConfirmarSenha("");
      } else {
        setMensagemErro("Erro ao redefinir a senha. Tente novamente.");
      }
    } catch (error) {
      setMensagemErro(
        error.response?.data?.message || "Ocorreu um erro inesperado."
      );
    } finally {
      setValidando(false);
    }
  };

  const handleGoToLogin = () => {
    navigate("/Login");
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 w-full">
      <main className="flex-grow flex items-center justify-center bg-[#E5E5E5] p-4 w-full">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md sm:max-w-lg lg:max-w-lg">
          {sucesso ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-700 mb-6">
                Senha Redefinida com Sucesso!
              </h2>
              <p className="text-gray-600 mb-6">
                Sua senha foi alterada. Agora você pode acessar sua conta.
              </p>
              <button
                onClick={handleGoToLogin}
                className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645] transition-all duration-300"
              >
                Entrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">
                Redefinir Senha
              </h2>
              <div className="mb-4 relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="novaSenha"
                >
                  Nova Senha
                </label>
                <input
                  type={senhaVisivel ? "text" : "password"}
                  id="novaSenha"
                  value={novaSenha}
                  onChange={(e) => {
                    setNovaSenha(e.target.value);
                    setErrosSenha([]); 
                  }}
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                  required
                />
                <img
                  src={senhaVisivel ? eyeOn : eyeOff}
                  alt=""
                  className="absolute top-9 right-3 cursor-pointer w-5 h-5"
                  onClick={() => setSenhaVisivel(!senhaVisivel)}
                />
              </div>
              <div className="mb-4 relative">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="confirmarSenha"
                >
                  Confirmar Nova Senha
                </label>
                <input
                  type={confirmarSenhaVisivel ? "text" : "password"}
                  id="confirmarSenha"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  className="border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FCA311]"
                  required
                />
                <img
                  src={confirmarSenhaVisivel ? eyeOn : eyeOff}
                  alt=" "
                  className="absolute top-9 right-3 cursor-pointer w-5 h-5"
                  onClick={() =>
                    setConfirmarSenhaVisivel(!confirmarSenhaVisivel)
                  }
                />
              </div>
              {errosSenha.length > 0 && (
                <ul className="text-red-500 text-sm mb-4">
                  {errosSenha.map((erro, index) => (
                    <li key={index}> {erro}</li>
                  ))}
                </ul>
              )}
              {mensagemErro && (
                <p className="text-red-500 text-sm mb-4">{mensagemErro}</p>
              )}
              <button
                type="submit"
                className={`bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full ${
                  validando ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fcb645]"
                } transition duration-200`}
                disabled={validando}
              >
                {validando ? "Redefinindo..." : "Redefinir Senha"}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default RedefinirSenha;
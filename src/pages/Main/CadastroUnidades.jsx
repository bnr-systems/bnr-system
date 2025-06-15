import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { useAuth } from "/src/context/AuthContext"; 
import { FaSpinner } from "react-icons/fa";
import Menu from "/src/components/Menu";
import { useForm } from "react-hook-form";
import api from "/src/api/api";

function CadastroUnidades() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
    const { token, user } = useAuth(); 
  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false); // Controle do estado da barra lateral
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState({
    general: "",
    cnpj: "",
    nome: "",
    email: "",
    pdf: "",
  });
  const [alerta, setAlerta] = useState("");
  const navigate = useNavigate();

  const estadoSelecionado = watch("estado_id");

  const validateCNPJ = (value) => {
    const unformattedCNPJ = value.replace(/\D/g, ""); // Remove caracteres não numéricos
    if (unformattedCNPJ.length !== 14) {
      return "CNPJ inválido";
    }
    return true;
  };
  const translateErrorMessage = (message) => {
    const translations = {
      // Validações de formato
      "The email must be a valid email address.":
        "O e-mail informado não é válido.",
      "The cnpj format is invalid.": "O formato do CNPJ é inválido.",
      "The phone format is invalid.": "O formato do telefone é inválido.",
      "Duplicate entry": "Este CNPJ já está cadastrado no sistema.",

      // Validações de unicidade
      "The nome has already been taken.": "Este nome já está cadastrado.",
      "The email has already been taken.": "Este e-mail já está em uso.",
      "The cnpj has already been taken.": "Este CNPJ já está cadastrado.",

      // Validações de arquivo
      "The pdf must be a file of type: pdf.": "O arquivo deve ser do tipo PDF.",
      "The pdf must not be greater than 2048 kilobytes.":
        "O arquivo não deve ser maior que 2MB.",

      // Outros erros comuns
      "Invalid credentials": "Credenciais inválidas.",
      Unauthorized: "Não autorizado.",
      "Server error": "Erro no servidor.",
      "Network error": "Erro de conexão.",
    };

    return translations[message] || message;
  };
  // Buscar estados na API
  useEffect(() => {
    const fetchEstados = async () => {
      try {
        const response = await api.get("/estados");
        const estadosData = response.data.map((estado) => ({
          value: estado.cod,
          label: estado.nome,
        }));
        setEstados(estadosData);
      } catch (error) {
        console.error("Erro ao buscar estados:", error);
        setError("Erro ao carregar os estados. Tente novamente mais tarde.");
      }
    };
    fetchEstados();
  }, []);

  // Buscar municípios com base no estado selecionado
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (!estadoSelecionado) return;
      try {
        const response = await api.get(`/municipios/${estadoSelecionado}`);
        const municipiosData = response.data.map((municipio) => ({
          value: municipio.codEstado,
          label: municipio.nome,
        }));
        setMunicipios(municipiosData);
        setAlerta(
          municipiosData.length === 0
            ? "Nenhum município encontrado para o estado selecionado."
            : ""
        );
      } catch (error) {
        console.error("Erro ao buscar municípios:", error);
        setMunicipios([]);
        setAlerta("Erro ao carregar municípios. Tente novamente.");
      }
    };
    fetchMunicipios();
  }, [estadoSelecionado]);

  // Recuperar o user_id do localStorage e definir no formulário
  useEffect(() => {
    if (user?.id) {
      setValue("user_id", user?.id);
    }
  }, [user,setValue]);

  // Submissão do formulário
  const onSubmit = async (data) => {
    setIsLoading(true);
    setError({
      general: "",
      cnpj: "",
      nome: "",
      email: "",
      pdf: "",
    });
    const formDataToSend = new FormData();
    Object.keys(data).forEach((key) => {
      if (key === "pdf" && data[key]?.[0]) {
        formDataToSend.append("pdf", data[key][0]);
      } else {
        formDataToSend.append(key, data[key]);
      }
      
    });

    try {
      await api.post("/unidades/store", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Unidade cadastrada com sucesso!");
      navigate("/unidades");
    } catch (error) {
      if (error.response) {
        const { data: errorData, status } = error.response;

        // Handle validation errors (422)
        if (status === 422) {
          // Check for specific field errors
          if (errorData.errors) {
            Object.keys(errorData.errors).forEach((field) => {
              const errorMessage = errorData.errors[field][0];
              const translatedMessage = translateErrorMessage(errorMessage);
              setError((prev) => ({
                ...prev,
                [field]: translatedMessage,
              }));
            });
          }
        } else if (status === 413) {
          setError((prev) => ({
            ...prev,
            pdf: "O limite do tamanho do arquivo foi excedido. O máximo permitido é 2MB.",
          }));
        } else if (status === 401) {
          setError((prev) => ({
            ...prev,
            general: "Sessão expirada. Faça o login novamente",
          }));
        } else {
          setError((prev) => ({
            ...prev,
            general:
              "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
          }));
        }
      } else if (error.request) {
        setError((prev) => ({
          ...prev,
          general:
            "O limite do tamanho do arquivo foi excedido. O máximo permitido é 2MB.",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Menu />
      <div className="flex-1 p-8 bg-gray-100 overflow-y-auto rounded-md shadow-xl">
        <h1 className="text-2xl text-gray-900 text-center font-bold mb-6">
          Cadastro Unidade
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" {...register("user_id")} />
          {/* Nome */}
          <div className="mb-4">
            <label
              htmlFor="nome"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Nome da Unidade
            </label>
            <input
              type="text"
              id="nome"
              {...register("nome", { required: "O nome é obrigatório" })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.nome && (
              <p className="text-red-500">{errors.nome.message}</p>
            )}
            {error.nome && <p className="text-red-500">{error.nome}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              E-mail
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "O e-mail é obrigatório",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Formato de e-mail inválido",
                },
              })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Estado */}
          <div className="mb-4">
            <label
              htmlFor="estado_id"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Estado
            </label>
            <Select
              options={estados}
              onChange={(selectedOption) => {
                const estadoId = selectedOption ? selectedOption.value : null;
                setValue("estado_id", estadoId, { shouldValidate: true });
              }}
              placeholder="Selecione o estado"
              isClearable
              className={errors.estado_id ? "border-red-500" : ""}
            />
            {errors.estado_id && (
              <p className="text-red-500">{errors.estado_id.message}</p>
            )}
          </div>

          {/* Município */}
          <div className="mb-4">
            <label
              htmlFor="municipio_id"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Município
            </label>
            <Select
              options={municipios}
              onChange={(selectedOption) => {
                const municipioId = selectedOption
                  ? selectedOption.value
                  : null;
                setValue("municipio_id", municipioId, { shouldValidate: true });
              }}
              placeholder="Selecione o município"
              isDisabled={!estadoSelecionado}
              isClearable
              className={errors.municipio_id ? "border-red-500" : ""}
            />
            {errors.municipio_id && (
              <p className="text-red-500">{errors.municipio_id.message}</p>
            )}

            {alerta && <p className="text-yellow-600 text-sm mt-1">{alerta}</p>}
          </div>

          {/* Endereço */}
          <div className="mb-4">
            <label
              htmlFor="endereco"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Endereço
            </label>
            <input
              type="text"
              id="endereco"
              {...register("endereco", {
                required: "O endereço é obrigatório",
              })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.endereco && (
              <p className="text-red-500">{errors.endereco.message}</p>
            )}
          </div>

          {/* Complemento */}
          <div className="mb-4">
            <label
              htmlFor="complemento"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Complemento
            </label>
            <input
              type="text"
              id="complemento"
              {...register("complemento")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Número */}
          <div className="mb-4">
            <label
              htmlFor="numero"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Número
            </label>
            <input
              type="number"
              id="numero"
              {...register("numero", { required: "O número é obrigatório" })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.numero && (
              <p className="text-red-500">{errors.numero.message}</p>
            )}
          </div>
          {/* Telefone */}
          <div className="mb-4">
            <label
              htmlFor="telefone"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Telefone
            </label>
            <input
              type="text"
              id="telefone"
              {...register("telefone", {
                required: "O telefone é obrigatório",
              })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.telefone && (
              <p className="text-red-500">{errors.telefone.message}</p>
            )}
          </div>

          {/* CNPJ */}
          <div className="mb-4">
            <label
              htmlFor="cnpj"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              CNPJ
            </label>
            <input
              type="text"
              id="cnpj"
              {...register("cnpj", {
                required: "O CNPJ é obrigatório",
                validate: validateCNPJ,
              })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.cnpj && (
              <p className="text-red-500">{errors.cnpj.message}</p>
            )}
            {error.cnpj && <p className="text-red-500">{error.cnpj}</p>}
          </div>
          {/* Comprovante do CNPJ */}
          <div className="mb-4">
            <label
              htmlFor="pdf"
              className="block text-sm font-bold mb-2 text-gray-800"
            >
              Comprovante do CNPJ (PDF)
            </label>
            <input
              type="file"
              id="pdf"
              accept=".pdf"
              {...register("pdf", { required: "O comprovante é obrigatório" })}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            {errors.pdf && <p className="text-red-500">{errors.pdf.message}</p>}
            {error.pdf && <p className="text-red-500">{error.pdf}</p>}
          </div>
          {error.general && (
            <div className="mb-4">
              <p className="text-red-500">{error.general}</p>
            </div>
          )}

          {/* Botão de submissão */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex justify-center items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  Cadastrando...
                </div>
              ) : (
                "Cadastrar"
              )}
            </button>
          </div>
          <div className="mt-4 text-center">
            <a
              href="/Unidades"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Voltar
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}

export default CadastroUnidades;

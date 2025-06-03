import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import iconMenu from "/src/assets/images/icon-menu.svg";
import Select from "react-select";
import { useAuth } from "/src/context/AuthContext"; 
import { useNavigate } from "react-router-dom";
import api from "/src/api/api";

function EdicaoUnidade() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const { token } = useAuth(); 
  const [unidade, setUnidade] = useState(null);
  const [estados, setEstados] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [municipios, setMunicipios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState(null); // Armazena os dados originais
  const [error, setError] = useState(null);
  const [alerta, setAlerta] = useState("");
    const [userType, setUserType] = useState([]);

  const navigate = useNavigate();
  const unidadeId = localStorage.getItem("unidadeId");

  const fetchUserType = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const tipo = response?.data?.data?.userType;
        setUserType(tipo);
      } catch (error) {
        console.error("Erro ao buscar tipo de usuário:", error);
      }

    };

    fetchUserType();

  // Buscar os dados da unidade
  useEffect(() => {
    const fetchUnidade = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/unidades/${unidadeId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOriginalData(response.data); 
        setUnidade(response.data);
        const fields = [
          "nome",
          "email",
          "endereco",
          "complemento",
          "numero",
          "telefone",
          "cnpj",
        ];
        fields.forEach((field) => {
          setValue(field, response.data[field]);
        });

        // Definir estado
        if (response.data.estado) {
          setValue("estado_id", response.data.estado_id);
        }
        

        // Definir município após carregar os municípios
        if (response.data.municipio) 
          setValue("municipio_id", String(response.data.municipio_id));
      } catch (err) {
        console.error("Erro completo ao carregar unidade:", err);
        setError("Erro ao carregar os dados da unidade.");
      } finally {
        setLoading(false);
      }
    };
    
    if (unidadeId) {
      fetchUnidade();
    } else {
      console.error("ID da unidade não encontrado no localStorage");
      setError("ID da unidade não encontrado.");
    }
  }, [unidadeId, setValue]);

  
  // Buscar estados
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
        setError("Erro ao carregar os estados.");
      }
    };
    fetchEstados();
  }, []);

  // Buscar municípios com base no estado selecionado
  // Buscar municípios com base no estado selecionado
  useEffect(() => {
    const fetchMunicipios = async () => {
      if (!unidade || !unidade.estado_id) return;
      try {
        const response = await api.get(`/municipios/${unidade.estado_id}`);

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
  }, [unidade]);

  useEffect(() => {
    if (unidade) {
      setValue("municipio_id", unidade.municipio_id);
    }
  }, [unidade, setValue]);


// Buscar os dados da unidade
useEffect(() => {
  const fetchUnidade = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/unidades/${unidadeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUnidade(response.data);
      setOriginalData(response.data); // Salva os dados originais para comparação
      const fields = [
        "nome",
        "email",
        "endereco",
        "complemento",
        "numero",
        "telefone",
        "cnpj",
      ];
      fields.forEach((field) => setValue(field, response.data[field]));

      if (response.data.estado) setValue("estado_id", response.data.estado_id);
      if (response.data.municipio)
        setValue("municipio_id", response.data.municipio_id);
    } catch (err) {
      console.error("Erro completo ao carregar unidade:", err);
      setError("Erro ao carregar os dados da unidade.");
    } finally {
      setLoading(false);
    }
  };

  if (unidadeId) {
    fetchUnidade();
  } else {
    console.error("ID da unidade não encontrado no localStorage");
    setError("ID da unidade não encontrado.");
  }
}, [unidadeId, setValue]);

// Filtrar apenas os campos alterados antes de enviar
const getChangedFields = (data) => {
  const changedFields = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== originalData[key]) {
      changedFields[key] = data[key];
    }
  });
  
  return changedFields;
};

const onSubmit = async (data) => {
  // Garantir que municipio_id seja enviado como string
  const changedData = getChangedFields(data); // Somente campos alterados

  if (Object.keys(changedData).length === 0) {
    alert("Nenhuma alteração foi realizada.");
    return;
  }

  // Converte municipio_id para string antes de enviar
  if (changedData.municipio_id) {
    changedData.municipio_id = String(changedData.municipio_id);
  }

  try {
    setLoading(true);
    await api.put(
      `/unidades/${unidadeId}`,
      changedData, // Envia somente os campos alterados
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    alert("Unidade atualizada com sucesso!");
    navigate("/unidades");
  } catch (err) {
    console.error("Erro ao salvar alterações:", err);
    setError("Erro ao salvar as alterações.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-8 bg-gray-100 min-h-screen w-80 lg:w-[40%]">
      {/* Botão para abrir o menu */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded text-white"
        >
          <img src={iconMenu} alt="Menu" className="w-6 h-6" />
        </button>
      )}

      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform ease-in-out duration-500 z-40 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4 font-bold text-lg border-b border-gray-700 flex justify-between items-center">
          <span>Menu</span>
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <button
          className="p-4 hover:bg-gray-700 text-left w-full"
          onClick={() => navigate("/unidades")}
        >
          Unidades
        </button>
        <button
          className="p-4 hover:bg-gray-700 text-left w-full"
          onClick={() => navigate("/PecasRouter")}
        >
          Peças
        </button>

        {userType === "fornecedor" && (
          <button
            className="p-4 hover:bg-gray-700 text-left w-full"
            onClick={() => navigate("/pecasVinculadas")}
          >
            Peças Vinculadas
          </button>
        )}
      </aside>

      <h1 className="text-xl font-bold mb-6 text-center">Editar Unidade</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {unidade && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nome */}
          <div>
            <label htmlFor="nome" className="block font-semibold">
              Nome da Unidade
            </label>
            <input
              id="nome"
              {...register("nome", { required: "Nome é obrigatório" })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.nome && (
              <p className="text-red-500">{errors.nome.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-semibold">
              Email
            </label>
            <input
              id="email"
              {...register("email", {
                required: "Email é obrigatório",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email inválido",
                },
              })}
              className="w-full border rounded px-3 py-2"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Estado (estático) */}
          <div>
            <label className="block font-semibold" htmlFor="estado_id">
              Estado
            </label>
            <input
              type="text"
              id="estado_id"
              value={
                estados.find((estado) => estado.value === unidade?.estado_id)
                  ?.label || "Estado não encontrado"
              }
              className="w-full border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
              readOnly
            />
            {/* Campo oculto para garantir que estado_id seja enviado */}
            <input
              type="hidden"
              {...register("estado_id", { valueAsNumber: true })} // Define o valor como número
              value={unidade?.estado_id || ""}
            />
          </div>

          {/* Municipio */}
          <label className="block font-semibold">Município</label>
          <Select
            options={municipios}
            onChange={(selectedOption) => {
              const municipioId = selectedOption
                ? selectedOption.value
                : unidade.municipio_id;
              setValue("municipio_id", municipioId, { shouldValidate: true });
            }}
            placeholder="Selecione o município"
            value={
              municipios.find((m) => m.value === watch("municipio_id")) || null
            }
            defaultValue={
              municipios.find((m) => m.value === unidade?.municipio?.codEstado)
                ?.label || null
            }
            className={errors.municipio_id ? "border-red-500" : ""}
            isClearable
          />

          {/* Endereço */}
          <div>
            <label htmlFor="endereco" className="block font-semibold">
              Endereço
            </label>
            <input
              id="endereco"
              {...register("endereco")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.endereco && (
              <p className="text-red-500">{errors.endereco.message}</p>
            )}
          </div>

          {/* Complemento */}
          <div>
            <label htmlFor="complemento" className="block font-semibold">
              Complemento
            </label>
            <input
              id="complemento"
              {...register("complemento")}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Número */}
          <div>
            <label htmlFor="numero" className="block font-semibold">
              Número
            </label>
            <input
              id="numero"
              {...register("numero")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.numero && (
              <p className="text-red-500">{errors.numero.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="telefone" className="block font-semibold">
              Telefone
            </label>
            <input
              id="telefone"
              {...register("telefone")}
              className="w-full border rounded px-3 py-2"
            />
            {errors.telefone && (
              <p className="text-red-500">{errors.telefone.message}</p>
            )}
          </div>

          {/* CNPJ (estático) */}
          <div>
            <label className="block font-semibold">CNPJ</label>
            <div className="w-full border rounded px-3 py-2 bg-gray-200">
              {unidade.cnpj}
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => navigate("/unidades")}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-white font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold"
              disabled={loading}
            >
              Salvar
            </button>
          </div>
          
        </form>
      )}
    </div>
  );
}

export default EdicaoUnidade;

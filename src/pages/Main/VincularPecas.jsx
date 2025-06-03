import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "/src/api/api";
import { useAuth } from "/src/context/AuthContext"; 
import iconMenu from "/src/assets/images/icon-menu.svg";
import iconCopy from "/src/assets/images/icon-copy.png";
import iconCheck from "/src/assets/images/icon-check.png";
import Select from "react-select";

const VincularPecas = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setError,
    formState: { errors },
  } = useForm();
  const [menuOpen, setMenuOpen] = useState(false);
  const [pecas, setPecas] = useState([]);
  const [pecaSelecionada, setPecaSelecionada] = useState(null);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);
  const [copiado, setCopiado] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Define o estado da busca
  const [unidades, setUnidades] = useState([]);
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [busca, setBusca] = useState("");
  const [vinculos, setVinculos] = useState([]);
  const [userType, setUserType] = useState([]);
  const navigate = useNavigate();

  const userId = localStorage.getItem("id");
  const { token } = useAuth(); 


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

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !token) {
        console.error("Usuário não autenticado");
        return;
      }
      try {
        const [pecasResponse, unidadesResponse, vinculosResponse] =
          await Promise.all([
            api.get("/peca-modelos", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            api.get(`/unidades/user/${userId}`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            api.get("/peca-modelo-unidades", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        setPecas(
          pecasResponse.data.map((item) => ({
            value: item.id,
            label: item.peca?.nome_fantasia
              ? `${item.peca.nome_fantasia} - ${item.peca.codigo}`
              : item.peca?.codigo,
            id: item.id,
            nome_fantasia: item.peca?.nome_fantasia,
            codigo: item.peca?.codigo,
          }))
        );

        setUnidades(
          unidadesResponse.data.data.map((unidade) => ({
            value: unidade.id,
            label: unidade.nome,
            id: unidade.id,
            nome: unidade.nome || "",
            municipio: unidade.municipio || "", // Garante que nome sempre seja uma string
          }))
        );

        setVinculos(
          Array.isArray(vinculosResponse.data)
            ? vinculosResponse.data.map((vinculo) => ({
                id: vinculo.id,
                estoque: vinculo.estoque,
                valor: vinculo.valor,
                peca_modelo: {
                  id: vinculo.peca_modelo.id,
                  modelo: vinculo.peca_modelo.modelo_id,
                  ano: vinculo.peca_modelo.ano,
                  cilindrada: vinculo.peca_modelo.cilindrada,
                },
                unidade: {
                  id: vinculo.unidade.id,
                  nome: vinculo.unidade.nome,
                },
              }))
            : []
        );
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    };

    fetchData();
  }, [token, userId]);

  const onSubmit = async (data) => {
    try {
      const postData = {
        unidade_id: unidadeSelecionada.id,
        peca_modelo_id: pecaSelecionada.id,
        estoque: data.estoque,
        valor: data.valor,
      };

      await api.post("/peca-modelo-unidades", postData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Vínculo criado com sucesso!");
      reset();
      setVinculos([...vinculos, postData]);
      navigate("/pecasVinculadas");
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Erro desconhecido.";
        
        if (errorMessage.includes("Numeric value out of range")) {
          setError("estoque", {
            type: "manual",
            message: "O valor inserido no estoque é muito alto.",
          });
        } else {
          setError("general", {
            type: "manual",
            message: `Erro ao criar vínculo: ${errorMessage}`,
          });
        }
      } else {
        console.error("Erro ao conectar com o servidor:", error);
        setError("general", {
          type: "manual",
          message: "Erro de conexão. Tente novamente mais tarde.",
        });
      }
      
      setUnidadeSelecionada(null);
      setPecaSelecionada(null);
    }
  };
  const pecasFiltradas = pecas
    .filter(
      (peca) =>
        (peca.nome_fantasia &&
          peca.nome_fantasia.toLowerCase().includes(busca.toLowerCase())) ||
        (peca.codigo && peca.codigo.toLowerCase().includes(busca.toLowerCase()))
    )
    .sort((a, b) => {
      if (!a.nome_fantasia && !b.nome_fantasia) return 0;
      if (!a.nome_fantasia) return 1;
      if (!b.nome_fantasia) return -1;
      return a.nome_fantasia.localeCompare(b.nome_fantasia);
    });

  useEffect(() => {
    const filtered = unidades
      .filter((unidade) =>
        unidade.nome?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => (a.nome || "").localeCompare(b.nome || ""));
    setFilteredUnidades(filtered);
  }, [searchTerm, unidades]);

  const copiarCodigo = (codigo, id) => {
    navigator.clipboard.writeText(codigo);
    setCopiado(id);
    setTimeout(() => setCopiado(null), 2000); // Reseta após 2 segundos
  };

  return (
    <div className="flex flex-col items-center p-6">
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded text-white"
        >
          <img src={iconMenu} alt="Menu" className="w-6 h-6" />
        </button>
      )}

      {/* Fundo translúcido e barra lateral */}
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

      <h1 className="flex justify-center items-center text-center mb-6  text-2xl font-bold text-gray-900">
        Vincular Peças às Unidades
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md rounded p-6 w-full max-w-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Código da Peça Modelo:</label>
          <Select
            options={pecasFiltradas}
            onChange={(selectedOption) => {
              const pecaId = selectedOption ? selectedOption.value : null;
              setValue("pecas", pecaId, { shouldValidate: true });
              setPecaSelecionada(selectedOption); // Se precisar do estado para outras funções
            }}
            placeholder="Selecione uma peça"
            isClearable
            className={errors.pecas ? "border-red-500" : ""}
          />
          {errors.pecas && (
            <p className="text-red-500">{errors.pecas.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Unidade:</label>
          <Select
            options={unidades}
            onChange={(selectedOption) => {
              const unidadeId = selectedOption ? selectedOption.value : null;
              setValue("unidades", unidadeId, { shouldValidate: true });
              setUnidadeSelecionada(selectedOption);
            }}
            placeholder="Selecione uma unidade"
            isClearable
            className={errors.unidades ? "border-red-500" : ""}
          />
          {errors.unidades && (
            <p className="text-red-500">{errors.unidades.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Estoque:</label>
          <input
            type="number"
            {...register("estoque", {
              required: "Preencha a quantidade do estoque",
            })}
            className="border rounded w-full p-2"
          />
          {errors.estoque && (
            <p className="text-red-500">{errors.estoque.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Valor:</label>
          <input
            type="number"
            step="0.01"
            {...register("valor", { required: "Preencha o valor da peça" })}
            className="border rounded w-full p-2"
          />
          {errors.valor && (
            <p className="text-red-500">{errors.valor.message}</p>
          )}
          {/* Exibição do erro geral */}
          {errors.general?.message && (
            <div className="mb-4 mt-4 text-red-500 text-md">
              <p>{errors.general.message}</p>
            </div>
          )}
        </div>
        <div className="mt-4 text-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded"
          >
            Vincular
          </button>
        </div>
        <div className="mt-4 text-center">
          <a
            href="/pecasVinculadas"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Voltar
          </a>
        </div>
      </form>

      <div className="w-full mt-6">
        <details>
          <summary className="text-xl font-bold mb-4 cursor-pointer">
            Ver Peças Modelo
          </summary>
          <div>
            <label htmlFor="busca" className="block text-sm font-bold mb-2">
              Buscar por Nome ou Código da Peça
            </label>
            <input
              type="text"
              id="busca"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              placeholder="Digite o nome ou código"
            />
          </div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Nome</th>
                <th className="border border-gray-300 px-4 py-2">Código</th>
              </tr>
            </thead>
            <tbody>
              {pecasFiltradas.length > 0 ? (
                pecasFiltradas.map((peca) => (
                  <tr key={peca.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {peca.nome_fantasia || ""}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 flex justify-between items-center">
                      <span>{peca.codigo}</span>
                      <button
                        onClick={() => copiarCodigo(peca.codigo, peca.id)}
                        className="ml-6 p-1 border border-gray-400 rounded hover:bg-gray-200"
                      >
                        <img
                          src={copiado === peca.id ? iconCheck : iconCopy}
                          alt="Copiar código"
                          className={`transition-transform duration-300 ${
                            copiado === peca.id
                              ? "w-4 h-4 text-green-500"
                              : "w-4 h-4"
                          }`}
                        />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    Nenhuma peça encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </details>
      </div>

      <div className="w-full mt-6">
        <details>
          <summary className="text-xl font-bold mb-4 cursor-pointer">
            Ver Unidades
          </summary>
          <label htmlFor="busca" className="block text-sm font-bold mb-2">
            Buscar por Nome da Unidade
          </label>
          <input
            type="text"
            placeholder="Digite o nome da unidade"
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Nome</th>
                <th className="border border-gray-300 px-4 py-2">Município</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnidades.length > 0 ? (
                filteredUnidades.map((unidade) => (
                  <tr key={unidade.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {unidade.nome}
                    </td>
                    <td className="border border-gray-300 px-8 py-4">
                      {unidade.municipio?.nome || "Não informado"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="2" className="text-center py-4">
                    Nenhuma unidade encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </details>
      </div>
    </div>
  );
};

export default VincularPecas;

import React, { useState, useEffect, useMemo } from "react";
import iconMenu from "/src/assets/images/icon-menu.svg";
import api from "/src/api/api";
import { useNavigate } from "react-router-dom";

const PecasFornecedor = () => {
  const [pecas, setPecas] = useState([]);
  const [fabricantes, setFabricantes] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fabricanteFiltro, setFabricanteFiltro] = useState("");
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("data"); // Controle de ordenação
  const [itensPorPagina, setItensPorPagina] = useState(10); // Itens por página
  const [paginaAtual, setPaginaAtual] = useState(1); // Página atual
  const [detalhesPeca, setDetalhesPeca] = useState(null);
  const [detalhesAbertos, setDetalhesAbertos] = useState(null);
  const [userType, setUserType] = useState([]);


  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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
    fetchUserType();

    };

  useEffect(() => {
    const fetchPecas = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/pecas",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const pecasData = response.data.data;
        if (Array.isArray(pecasData)) {
          setPecas(pecasData);
          // Ajustar para página 1 caso não haja dados
          if (pecasData.length > 0 && paginaAtual === 0) {
            setPaginaAtual(1);
          }
        } else {
          console.error("Os dados recebidos não são um array.");
          setPecas([]);
        }
      } catch (error) {
        console.error("Erro ao buscar peças:", error);
        setPecas([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPecas();
  }, [token]);

  useEffect(() => {
    const fetchFabricantes = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/fabricantes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.data)
        ) {
          const fabricantesData = response.data.data.data.reduce(
            (acc, fabricante) => {
              acc[fabricante.id] = fabricante.nome;
              return acc;
            },
            {}
          );
          setFabricantes(fabricantesData);
        } else {
          console.error("Estrutura inesperada na resposta dos fabricantes.");
        }
      } catch (error) {
        console.error("Erro ao buscar fabricantes:", error);
      }
    };

    fetchFabricantes();
  }, [token]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/categorias",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const categoriasData = response.data.map((categoria) => ({
          value: categoria.id,
          label: categoria.nome,
        }));
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    };

    fetchCategorias();
  }, [token]);

  const pecasFiltradas = useMemo(() => {
    let resultado = pecas.filter((peca) => {
      const termoBusca = busca.toLowerCase();
      const nomeMatch = (peca.nome_fantasia || "")
        .toLowerCase()
        .includes(termoBusca);
      const codigoMatch = (peca.codigo || "")
        .toLowerCase()
        .includes(termoBusca);
      const fabricanteMatch =
        !fabricanteFiltro ||
        String(peca.fabricante_id) === String(fabricanteFiltro);

      return (nomeMatch || codigoMatch) && fabricanteMatch;
    });

    if (ordem === "data") {
      resultado.sort(
        (a, b) => new Date(b.data_cadastro) - new Date(a.data_cadastro)
      );
    } else if (ordem === "alfabetica") {
      resultado.sort((a, b) => {
        if (!a.nome_fantasia && !b.nome_fantasia) return 0;
        if (!a.nome_fantasia) return 1;
        if (!b.nome_fantasia) return -1;
        return a.nome_fantasia.localeCompare(b.nome_fantasia);
      });
    }

    return resultado;
  }, [pecas, busca, ordem, fabricanteFiltro]);

  const pecasPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return pecasFiltradas.slice(inicio, fim);
  }, [pecasFiltradas, paginaAtual, itensPorPagina]);
  const totalPaginas = Math.ceil(pecasFiltradas.length / itensPorPagina);

  const toggleDetalhes = (id) => {
    setDetalhesAbertos(detalhesAbertos === id ? null : id);
  };

  // Garantir que a página atual esteja dentro dos limites
  useEffect(() => {
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  const handleVerDetalhes = (peca) => {
    setDetalhesPeca(peca);
  };

  const fecharDetalhes = () => {
    setDetalhesPeca(null);
  };

  if (isLoading) {
    return <p>Carregando peças...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="flex justify-center items-center mb-6  text-2xl font-bold text-gray-900">
        Peças
      </h1>
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


      {/* Botão de Cadastrar Nova Peça */}
      <div className="flex justify-end sm:mb-4">
        <button
          onClick={() => navigate("/cadastroPecas")}
          className="px-6 py-2 bg-[#FCA311] opacity-0 sm:opacity-100 font-bold text-white rounded hover:bg-[#fcb645] transition duration-200"
        >
          + Nova Peça
        </button>
      </div>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="busca" className="block text-sm font-bold mb-2">
            Buscar por Nome ou Código
          </label>
          <input
            type="text"
            id="busca"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Digite o nome ou código"
          />
        </div>
        <div>
          <label htmlFor="fabricante" className="block text-sm font-bold mb-2">
            Filtrar por Fabricante
          </label>
          <select
            id="fabricante"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={fabricanteFiltro}
            onChange={(e) => setFabricanteFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            {Object.entries(fabricantes).map(([id, nome]) => (
              <option key={id} value={id}>
                {nome}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ordem" className="block text-sm font-bold mb-2">
            Ordenar por
          </label>
          <select
            id="ordem"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value)}
          >
            <option value="data">Data de Cadastro</option>
            <option value="alfabetica">Ordem Alfabética</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="itensPorPagina"
            className="block text-sm font-bold mb-2"
          >
            Itens por Página
          </label>
          <select
            id="itensPorPagina"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={itensPorPagina}
            onChange={(e) =>
              setItensPorPagina(Math.min(Number(e.target.value), 100))
            }
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Tabela de Peças */}
      {pecasPaginadas.length === 0 ? (
        <p>Nenhuma peça encontrada.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Nome
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Código
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Fabricante
              </th>
            </tr>
          </thead>
          <tbody>
            {pecasPaginadas.map((peca) => (
              <React.Fragment key={peca.id}>
                <tr
                  onClick={() => toggleDetalhes(peca.id)}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="border border-gray-300 px-4 py-2">
                    {peca.nome_fantasia || "-"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {peca.codigo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {fabricantes[peca.fabricante_id] || "Não Informado"}
                  </td>
                </tr>
                {detalhesAbertos === peca.id && peca.foto && (
                  <tr>
                    <td
                      colSpan={3}
                      className="border border-gray-300 p-4 bg-gray-100"
                    >
                      <img
                        src={`https://vps55372.publiccloud.com.br/storage/${peca.foto}`}
                        alt={peca.nome_fantasia}
                        className="md:max-w-[600px] md:max-h-[600px] h-auto w-auto mx-auto sm:max-w-[400px] sm:max-h-[400px]" 
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
      <div className="sm:hidden flex justify-center">
        <button
          onClick={() => navigate("/cadastroPecas")}
          className={`bg-[#FCA311] sm:opacity-0 mt-8 mb-4  text-white font-bold py-2 px-4 rounded w-48 hover:bg-[#fcb645] transition-all duration-300 flex items-center justify-center`}
        >
          + Nova Peça
        </button>
      </div>
      {/* Paginação */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          disabled={paginaAtual <= 1 || totalPaginas === 0}
          onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 relative right-5 bg-[#14213D] text-white font-semibold  rounded disabled:opacity-50"
        >
          Anterior
        </button>
        <span>
          Página {totalPaginas === 0 ? 0 : paginaAtual} de {totalPaginas}
        </span>
        <button
          disabled={paginaAtual === totalPaginas || totalPaginas === 0}
          onClick={() =>
            setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
          }
          className="px-4 py-2 relative left-5 bg-[#14213D] text-white font-semibold  rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {/* Modal de Detalhes */}
      {detalhesPeca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">
              {detalhesPeca.nome_fantasia}
            </h2>
            <img
              src={
                detalhesPeca.foto
                  ? `https://vps55372.publiccloud.com.br/storage/${detalhesPeca.foto}`
                  : "/path/to/placeholder.jpg"
              }
              alt={detalhesPeca.nome_fantasia}
              className="mb-4 max-w-full"
            />
            <p>
              <span className="font-semibold">Código: </span>
              {detalhesPeca.codigo}
            </p>
            <p>
              <span className="font-semibold">Fabricante: </span>
              {fabricantes[detalhesPeca.fabricante_id] || "Não Informado"}
            </p>
            <button
              onClick={fecharDetalhes}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PecasFornecedor;
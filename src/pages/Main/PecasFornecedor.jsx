import React, { useState, useEffect, useMemo } from "react";
import Menu from "/src/components/Menu";
import api from "/src/api/api";
import { useAuth } from "/src/context/AuthContext"; 
import { useNavigate } from "react-router-dom";

const PecasFornecedor = () => {
  const [pecas, setPecas] = useState([]);
  const [fabricantes, setFabricantes] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fabricanteFiltro, setFabricanteFiltro] = useState("");
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("data"); // Controle de ordenação
  const [itemsPerPage, setItemsPerPage] = useState(10); // Itens por página
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [detalhesPeca, setDetalhesPeca] = useState(null);
  const [detalhesAbertos, setDetalhesAbertos] = useState(null);


  const { token, user } = useAuth(); 

  const navigate = useNavigate();

   useEffect(() => {
    const fetchPecas = async () => {
      try {
        let allPecas = [];
        let nextPage = "/pecas";
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
    
        while (nextPage) {
          const response = await api.get(nextPage, config);
          const dataPage = response.data.data || [];
          allPecas = allPecas.concat(dataPage);
          nextPage = response.data.next_page_url
            ? response.data.next_page_url.replace("https://vps55372.publiccloud.com.br/api", "")
            : null;
        }
    
        setPecas(allPecas);
        setCurrentPage(1);
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
    const inicio = (currentPage - 1) * itemsPerPage;
    const fim = inicio + itemsPerPage;
    return pecasFiltradas.slice(inicio, fim);
  }, [pecasFiltradas, currentPage, itemsPerPage]);
  const totalPages = Math.ceil(pecasFiltradas.length / itemsPerPage);

  const toggleDetalhes = (id) => {
    setDetalhesAbertos(detalhesAbertos === id ? null : id);
  };

  // Garantir que a página atual esteja dentro dos limites
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

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
      <Menu />


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
            htmlFor="itemsPerPage"
            className="block text-sm font-bold mb-2"
          >
            Itens por Página
          </label>
          <select
            id="itemsPerPage"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={itemsPerPage}
            onChange={(e) =>
              setItemsPerPage(Math.min(Number(e.target.value), 100))
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
  <div className="w-full overflow-x-auto">
    <table className="min-w-full border-collapse border border-gray-300">
      <thead className="bg-gray-200">
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-left">Nome</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Código</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Fabricante</th>
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
                <td colSpan={3} className="border border-gray-300 p-4 bg-gray-100">
                  <img
                    src={`https://vps55372.publiccloud.com.br/${peca.foto}`}
                    alt={peca.nome_fantasia}
                    className="max-w-full h-auto mx-auto md:max-w-[600px] md:max-h-[600px] sm:max-w-[400px] sm:max-h-[400px]"
                  />
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
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
        <div className="flex justify-center items-center mt-8 space-x-2">
  {/* Botão de voltar */}
  <button
    disabled={currentPage <= 1}
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    className="px-4 py-2 bg-[#14213D]) bg-white text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
    &lt;
  </button>

  {/* Primeira página sempre visível */}
  <button
    onClick={() => setCurrentPage(1)}
    className={`w-10 h-10 flex items-center justify-center rounded ${
      currentPage === 1 ? "bg-[#14213D] text-white" : "bg-white text-gray-800"
    }`}
  >
    1
  </button>

  {/* Ellipsis antes das páginas do meio */}
  {currentPage > 4 && <span className="px-2">...</span>}

  {/* Páginas do meio */}
  {Array.from({ length: 3 }, (_, i) => {
    const pageNumber = currentPage <= 3
      ? i + 2
      : currentPage >= totalPages - 2
      ? totalPages - 4 + i
      : currentPage - 1 + i;

    if (pageNumber > 1 && pageNumber < totalPages) {
      return (
        <button
          key={pageNumber}
          onClick={() => setCurrentPage(pageNumber)}
          className={`w-10 h-10 flex items-center justify-center rounded ${
            currentPage === pageNumber
               ? "bg-[#14213D] text-white"
                    : "bg-white text-gray-800"
          }`}
        >
          {pageNumber}
        </button>
      );
    }
    return null;
  })}

  {/* Ellipsis depois das páginas do meio */}
  {currentPage < totalPages - 3 && <span className="px-2">...</span>}

  {/* Última página visível */}
  {totalPages > 1 && (
    <button
      onClick={() => setCurrentPage(totalPages)}
      className={`w-10 h-10 flex items-center justify-center rounded ${
        currentPage === totalPages ? "bg-[#14213D] text-white" : "bg-white text-gray-800"
      }`}
    >
      {totalPages}
    </button>
  )}

  {/* Botão de avançar */}
  <button
    disabled={currentPage >= totalPages}
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    className="px-4 py-2 bg-white text-gray-800 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
    >
    &gt;
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
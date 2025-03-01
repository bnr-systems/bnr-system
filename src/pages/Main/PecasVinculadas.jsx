import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "/src/api/api";
import iconMenu from "/src/assets/images/icon-menu.svg";

const PecasVinculadas = () => {
  const [pecas, setPecas] = useState({});
  const [vinculos, setVinculos] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("data");
  const [itensPorPagina, setItensPorPagina] = useState(5);
  const [paginaAtual, setPaginaAtual] = useState(1);
  
  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!userId) {
          console.error("userId não encontrado!");
          return;
        }

        const unidadesResponse = await api.get(`/unidades/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnidades(unidadesResponse.data.data || []);

        const vinculosResponse = await api.get("/peca-modelo-unidades", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const vinculosFiltrados = vinculosResponse.data.filter(
          (v) => v.unidade?.user_id === Number(userId)
        );

        setVinculos(vinculosFiltrados);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  useEffect(() => {
    const fetchPecas = async () => {
      try {
        const response = await api.get("/pecas", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && Array.isArray(response.data.data)) {
          const pecasMap = response.data.data.reduce((acc, peca) => {
            acc[peca.id] = peca.nome_fantasia
              ? `${peca.nome_fantasia} - ${peca.codigo}`
              : peca.codigo || "-";
            return acc;
          }, {});
          setPecas(pecasMap);
        } else {
          console.error("Formato inesperado da resposta da API de peças", response.data);
        }
      } catch (error) {
        console.error("Erro ao buscar peças:", error);
      }
    };

    fetchPecas();
  }, [token]);

  useEffect(() => {
    setPaginaAtual(1);
  }, [busca]);

  const filteredVinculos = useMemo(() => {
    let resultado = vinculos.filter(
      (v) =>
        v.unidade?.nome.toLowerCase().includes(busca.toLowerCase()) ||
        pecas[v.peca_modelo?.peca_id]?.toLowerCase().includes(busca.toLowerCase()) ||
        v.peca_modelo?.peca_id.toString().includes(busca)
    );
  
  
    let resultadoOrdenado = [...resultado]; 
    if (ordem === "data") {
      resultadoOrdenado.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (ordem === "alfabetica") {
      resultadoOrdenado.sort((a, b) => {
        const nomeUnidadeA = a.unidade?.nome?.toString().toLowerCase() || "";
        const nomeUnidadeB = b.unidade?.nome?.toString().toLowerCase() || "";
  
  
        return nomeUnidadeA.localeCompare(nomeUnidadeB);
      });
    }
  
  
    return resultadoOrdenado;
  }, [busca, ordem, vinculos, pecas]);
  
  const totalItems = filteredVinculos.length;
  const totalPaginas = Math.ceil(totalItems / itensPorPagina);

  const vinculosPaginados = filteredVinculos.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  return (
    <div className="h-screen w-full flex flex-col p-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Peças Vinculadas</h1>
      <div className="hidden md:flex justify-end mb-4">
        <button
          onClick={() => navigate("/vincularPecas")}
          className="px-6 py-2 bg-[#FCA311] font-bold text-white rounded hover:bg-[#fcb645] transition duration-200"
        >
          + Vincular Novas Peças
        </button>
      </div>
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
          onClick={() => navigate("/pecas")}
        >
          Peças
        </button>
        <button
          className="p-4 hover:bg-gray-700 text-left w-full"
          onClick={() => navigate("/pecasVinculadas")}
        >
          Peças Vinculadas
        </button>
      </aside>
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
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Unidade</th>
              <th className="border border-gray-300 px-4 py-2">Peça</th>
              <th className="border border-gray-300 px-4 py-2">Estoque</th>
              <th className="border border-gray-300 px-4 py-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            {vinculosPaginados.length > 0 ? (
              vinculosPaginados.map((vinculo) => {
                return (
                  <tr key={vinculo.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {vinculo.unidade?.nome || " - "}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {pecas[vinculo.peca_modelo.peca_id] || " - "}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {vinculo.estoque}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      R$ {Number(vinculo.valor || 0).toFixed(2)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Nenhuma peça vinculada encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Paginação */}
      <div className="flex justify-center items-center mt-8 space-x-2">
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
      <button
        onClick={() => navigate("/vincularPecas")}
        className="bg-[#FCA311] mt-8 text-white font-bold py-2 px-4 rounded w-full sm:w-48 hover:bg-[#fcb645] transition-all duration-300 flex items-center justify-center md:hidden"
      >
        + Vincular Novas Peças
      </button>
    </div>
  );
};

export default PecasVinculadas;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Menu from "/src/components/Menu";
import api from "/src/api/api";
import { useAuth } from "/src/context/AuthContext";


function Unidades() {
  const [unidades, setUnidades] = useState([]); // Estado para armazenar as unidades
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Controle do pop-up
  const [selectedEstado, setSelectedEstado] = useState(""); // Estado para filtro por estado
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [cidadesFiltradas, setCidadesFiltradas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Paginação
  const [itemsPerPage, setItemsPerPage] = useState(20); // Itens por página
  const [sortOrder, setSortOrder] = useState("asc"); // Ordenação
  const [totalUnidades, setTotalUnidades] = useState(0);
  
  const navigate = useNavigate();

const { user, isAuthenticated, isLoading, token } = useAuth();

 useEffect(() => {
  if (!isLoading && !isAuthenticated) {
    navigate("/login"); 
  }
}, [isAuthenticated, isLoading, navigate]);

  const fetchUnidades = async () => {
    try {
      const userId = user?.id;
      if (!userId || !token) {
      throw new Error("Usuário não está logado.");
    }

      const response = await api.get(`/unidades/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Extraindo dados do backend
      const data = Array.isArray(response.data.data) ? response.data.data : [];
      const total = response.data.total_unidades || data.length;

      setUnidades(data);
      setFilteredUnidades(data);
      setTotalUnidades(total); // Armazena o total no estado
    } catch (error) {
      console.error("Erro ao buscar unidades:", error);
      setUnidades([]); // Reseta para array vazio em caso de erro
      setFilteredUnidades([]);
      setTotalUnidades(0); // Reseta totalUnidades em caso de erro
    }
  };

  useEffect(() => {
  if (user && token) {
    fetchUnidades();
  }
}, [user, token]);
  const totalPages = Math.ceil(filteredUnidades.length / itemsPerPage);


  // Log no estado `unidades` para verificar alterações
  useEffect(() => {}, [unidades]);

  const handleCreateUnidade = () => {
    if (totalUnidades > 2) {
      setShowPopup(true); // Mostrar pop-up se o limite for excedido
    } else {
      navigate("/cadastroUnidades"); // Navegar para o formulário de criação
    }
  };

  const closePopupNavigate = () => {
    setShowPopup(false);
    navigate("/cadastroUnidades");
  };

  const closePopup = () => {
    setShowPopup(false);
  };
  useEffect(() => {
    if (selectedEstado) {
      const cidades = unidades
        .filter((u) => u.estado?.nome === selectedEstado)
        .map((u) => u.municipio?.nome);
      setCidadesFiltradas([...new Set(cidades)]); // Remove duplicados
    } else {
      setCidadesFiltradas([]);
    }
    setSelectedMunicipio(""); // Reinicia o município ao trocar o estado
  }, [selectedEstado, unidades]);

  const handleFilter = () => {
    const filtered = unidades.filter((unidade) => {
      const matchSearch = unidade.nome
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchEstado = selectedEstado
        ? unidade.estado?.nome === selectedEstado
        : true;
      const matchMunicipio = selectedMunicipio
        ? unidade.municipio?.nome === selectedMunicipio
        : true;
      return matchSearch && matchEstado && matchMunicipio;
    });
    setFilteredUnidades(filtered);
  };

  const handleSort = () => {
    const sorted = [...filteredUnidades].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.nome.localeCompare(b.nome);
      } else {
        return b.nome.localeCompare(a.nome);
      }
    });
    setFilteredUnidades(sorted);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    handleFilter(); // Chamando função para filtrar
  }, [searchTerm, selectedEstado, selectedMunicipio]); // Remova 'unidades' da lista de dependências

  useEffect(() => {
    handleSort(); // Chamando função para ordenar
  }, [sortOrder]); // Remova 'filteredUnidades' da lista de dependências

  const paginatedUnidades = filteredUnidades.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return (
    <div className="flex min-h-screen">
      <Menu />
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto rounded-md shadow-xl lg:w-[90vw]">
        <div className="flex items justify-center sm:justify-end">
          <button
            onClick={handleCreateUnidade}
            className={`bg-[#FCA311] opacity-0 sm:opacity-100 text-white font-bold py-2 px-4 rounded w-48 hover:bg-[#fcb645] transition-all duration-300 flex items-center justify-center`}
          >
            + Nova Unidade
          </button>
        </div>
        <h1 className="flex justify-center items-center mb-6 mt-[-30px] text-2xl font-bold text-gray-900">
          Unidades
        </h1>

        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar por nome"
            className="border rounded p-2 flex-1 "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border rounded p-2"
            value={selectedEstado}
            onChange={(e) => setSelectedEstado(e.target.value)}
          >
            <option value="">Todos os estados</option>
            {[...new Set(unidades.map((u) => u.estado?.nome))].map((estado) => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            value={selectedMunicipio}
            onChange={(e) => setSelectedMunicipio(e.target.value)}
          >
            <option value="">Todos os municípios</option>
            {cidadesFiltradas.map((municipio) => (
              <option key={municipio} value={municipio}>
                {municipio}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Nome: A-Z</option>
            <option value="desc">Nome: Z-A</option>
          </select>
          <select
            className="border rounded p-2"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={20}>20 por página</option>
            <option value={10}>10 por página</option>
            <option value={5}>5 por página</option>

          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-6 max-w-8xl mx-auto ">
          {paginatedUnidades.length > 0 ? (
            paginatedUnidades.map((unidade) => (
              <div
                key={unidade.id}
                className="bg-white shadow p-4 rounded-lg border border-gray-300"
              >
                <h2 className="text-lg text-gray-800 font-bold mb-2">
                  {unidade.nome}
                </h2>
                <p>
                  <strong className="text-gray-800">Estado:</strong>{" "}
                  {unidade.estado?.nome || "Não informado"}
                </p>
                <p>
                  <strong className="text-gray-800">Município:</strong>{" "}
                  {unidade.municipio?.nome || "Não informado"}
                </p>
                <p>
                  <strong className="text-gray-800">Endereço:</strong>{" "}
                  {unidade.endereco}, {unidade.numero}
                  {unidade.complemento && ` - ${unidade.complemento}`}
                </p>
                <p>
                  <strong className="text-gray-800">Telefone:</strong>{" "}
                  {unidade.telefone}
                </p>
                {/* <p>
                  <strong className="text-gray-800">E-mail:</strong>{" "}
                  {unidade.email}
                </p> */}
                <p>
                  <strong className="text-gray-800">CNPJ:</strong>{" "}
                  {unidade.cnpj}
                </p>
                <button
                  onClick={() => {
                    localStorage.setItem("unidadeId", unidade.id); // Salva o id da unidade no localStorage
                    navigate(`/edicaoUnidade`);
                  }}
                  className="mt-4 bg-blue-500 text-white py-2 px-3 rounded font-semibold hover:bg-blue-600"
                >
                  Editar
                </button>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Nenhuma unidade registrada.
            </p>
          )}
        </div>
        <div className="sm:hidden flex justify-center">
          <button
            onClick={handleCreateUnidade}
            className={`bg-[#FCA311] sm:opacity-0 mt-8 mb-4  text-white font-bold py-2 px-4 rounded w-48 hover:bg-[#fcb645] transition-all duration-300 flex items-center justify-center`}
          >
            + Nova Unidade
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

      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold mb-4">Aviso</h2>
            <p className="mb-4">
              O total de unidades cadastradas ultrapassou o limite gratuito. Uma
              fatura será enviada para a nova unidade cadastrada. <br></br>
              Deseja prosseguir?
            </p>
            <button
              onClick={closePopupNavigate}
              className="bg-[#223763] text-white py-2 px-4 rounded mr-6 hover:bg-[#375694]"
            >
              Sim
            </button>
            <button
              onClick={closePopup}
              className="bg-[#e72e2e] text-white py-2 px-4 rounded hover:bg-[#f74c4c]"
            >
              Não
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Unidades;
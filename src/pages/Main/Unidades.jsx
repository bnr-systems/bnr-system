import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import iconMenu from "/src/assets/images/icon-menu.svg";
import api from "/src/api/api";

function Unidades() {
  const [unidades, setUnidades] = useState([]); // Estado para armazenar as unidades
  const [filteredUnidades, setFilteredUnidades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPopup, setShowPopup] = useState(false); // Controle do pop-up
  const [menuOpen, setMenuOpen] = useState(false); // Controle do estado da barra lateral
  const [selectedEstado, setSelectedEstado] = useState(""); // Estado para filtro por estado
  const [selectedMunicipio, setSelectedMunicipio] = useState("");
  const [cidadesFiltradas, setCidadesFiltradas] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Paginação
  const [itemsPerPage, setItemsPerPage] = useState(20); // Itens por página
  const [sortOrder, setSortOrder] = useState("asc"); // Ordenação
  const [totalUnidades, setTotalUnidades] = useState(0);
  const navigate = useNavigate();

  // Verifica login ao carregar a página
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Faça o login primeiro!");
      navigate("/login"); // Redireciona para a página de login
    }
  }, [navigate]);

  const fetchUnidades = async () => {
    try {
      const userId = localStorage.getItem("id"); // Leia userId aqui
      if (!userId) {
        throw new Error("Usuário não está logado.");
      }

      const response = await api.get(`/unidades/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    fetchUnidades();
  }, []);

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
      {/* Botão para abrir o menu */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded text-white"
        >
          <img src={iconMenu} alt="Menu" className="w-6 h-6" />
        </button>
      )}

      {/* Fundo translúcido e barra lateral */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)} // Fecha o menu ao clicar fora
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
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-[#14213D] text-white font-semibold  rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span>Página {currentPage}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage * itemsPerPage >= filteredUnidades.length}
            className="px-4 py-2 bg-[#223763] text-white font-semibold rounded disabled:opacity-50"
          >
            Próxima
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

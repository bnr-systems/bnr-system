import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "/src/api/api";
import iconMenu from "/src/assets/images/icon-menu.svg";

const PecasPromocao = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [fabricantes, setFabricantes] = useState({});
  const [pecasPromocao, setPecasPromocao] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [ordem, setOrdem] = useState("preco");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [detalhesPeca, setDetalhesPeca] = useState(null);

  const token = localStorage.getItem("token");

  // Inicializa os dados de peças em promoção
  useEffect(() => {
    if (location.state && location.state.pecasPromocao) {
      setPecasPromocao(location.state.pecasPromocao);
      setIsLoading(false);
    } else {
      fetchPecasPromocao();
    }

    fetchFabricantes();
  }, [location.state]);

  // Busca peças em promoção da API
  const fetchPecasPromocao = async () => {
    setIsLoading(true);
    try {
      // Em produção, substituir por chamada real à API
      // const response = await api.get("https://vps55372.publiccloud.com.br/api/pecas-promocao",
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );
      // setPecasPromocao(response.data.data);

      // Dados simulados para demonstração
      const pecasPromo = [
        {
          id: 1,
          nome_fantasia: "Filtro de Óleo Premium",
          codigo: "FO-2345",
          fabricante_id: 1,
          categoria: "Filtros",
          produto: "Filtro de Óleo",
          valor: 49.9,
          valor_original: 79.9,
          estado: "São Paulo",
          municipio: "São Paulo",
          telefone: "(11) 98765-4321",
          estoque: 25,
          desconto: 37.5,
          imagem: "https://picsum.photos/id/1/200/200",
        },
        {
          id: 2,
          nome_fantasia: "Pastilha de Freio Cerâmica",
          codigo: "PF-8721",
          fabricante_id: 2,
          categoria: "Freios",
          produto: "Pastilha de Freio",
          valor: 129.9,
          valor_original: 189.9,
          estado: "São Paulo",
          municipio: "Campinas",
          telefone: "(19) 98765-1234",
          estoque: 15,
          desconto: 31.6,
          imagem: "https://picsum.photos/id/2/200/200",
        },
        {
          id: 3,
          nome_fantasia: "Vela de Ignição Iridium",
          codigo: "VI-4520",
          fabricante_id: 3,
          categoria: "Ignição",
          produto: "Vela de Ignição",
          valor: 89.9,
          valor_original: 119.9,
          estado: "Minas Gerais",
          municipio: "Belo Horizonte",
          telefone: "(31) 97654-3210",
          estoque: 30,
          desconto: 25.0,
          imagem: "https://picsum.photos/id/3/200/200",
        },
        {
          id: 4,
          nome_fantasia: "Amortecedor Dianteiro",
          codigo: "AM-7890",
          fabricante_id: 2,
          categoria: "Suspensão",
          produto: "Amortecedor",
          valor: 349.9,
          valor_original: 499.9,
          estado: "Rio de Janeiro",
          municipio: "Rio de Janeiro",
          telefone: "(21) 96543-2109",
          estoque: 8,
          desconto: 30.0,
          imagem: "https://picsum.photos/id/4/200/200",
        },
        {
          id: 5,
          nome_fantasia: "Bomba d'água Universal",
          codigo: "BA-1234",
          fabricante_id: 1,
          categoria: "Arrefecimento",
          produto: "Bomba d'água",
          valor: 199.9,
          valor_original: 289.9,
          estado: "Paraná",
          municipio: "Curitiba",
          telefone: "(41) 95432-1098",
          estoque: 12,
          desconto: 31.0,
          imagem: "https://picsum.photos/id/5/200/200",
        },
        {
          id: 6,
          nome_fantasia: "Correia Dentada Reforçada",
          codigo: "CD-5678",
          fabricante_id: 4,
          categoria: "Transmissão",
          produto: "Correia Dentada",
          valor: 79.9,
          valor_original: 129.9,
          estado: "Santa Catarina",
          municipio: "Florianópolis",
          telefone: "(48) 91234-5678",
          estoque: 20,
          desconto: 38.5,
          imagem: "https://picsum.photos/id/6/200/200",
        },
        {
          id: 7,
          nome_fantasia: "Kit Embreagem Completo",
          codigo: "KE-9876",
          fabricante_id: 3,
          categoria: "Transmissão",
          produto: "Kit Embreagem",
          valor: 399.9,
          valor_original: 589.9,
          estado: "Rio Grande do Sul",
          municipio: "Porto Alegre",
          telefone: "(51) 98765-4321",
          estoque: 7,
          desconto: 32.2,
          imagem: "https://picsum.photos/id/7/200/200",
        },
        {
          id: 8,
          nome_fantasia: "Sensor de Oxigênio Universal",
          codigo: "SO-3456",
          fabricante_id: 5,
          categoria: "Sensores",
          produto: "Sensor de Oxigênio",
          valor: 149.9,
          valor_original: 229.9,
          estado: "Goiás",
          municipio: "Goiânia",
          telefone: "(62) 97654-3210",
          estoque: 15,
          desconto: 34.8,
          imagem: "https://picsum.photos/id/8/200/200",
        },
      ];

      setPecasPromocao(pecasPromo);
    } catch (error) {
      console.error("Erro ao buscar peças em promoção:", error);
      setPecasPromocao([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar fabricantes
  const fetchFabricantes = async () => {
    try {
      const response = await api.get(
        "https://vps55372.publiccloud.com.br/api/fabricantes",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (
        response.data &&
        response.data.data &&
        Array.isArray(response.data.data.data)
      ) {
        const fabricantesData = response.data.data.data.blueuce(
          (acc, fabricante) => {
            acc[fabricante.id] = fabricante.nome;
            return acc;
          },
          {}
        );
        setFabricantes(fabricantesData);
      } else {
        // Dados de exemplo caso a API falhe
        setFabricantes({
          1: "BorgWarner",
          2: "Bosch",
          3: "NGK",
          4: "Gates",
          5: "Delphi",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar fabricantes:", error);
      // Dados de exemplo caso a API falhe
      setFabricantes({
        1: "BorgWarner",
        2: "Bosch",
        3: "NGK",
        4: "Gates",
        5: "Delphi",
      });
    }
  };

  // Extrair categorias únicas para o filtro
  const categorias = [...new Set(pecasPromocao.map((peca) => peca.categoria))];

  // Filtrar peças conforme os critérios
  const pecasFiltradas = pecasPromocao.filter((peca) => {
    const termoBusca = busca.toLowerCase();
    const nomeMatch = (peca.nome_fantasia || "")
      .toLowerCase()
      .includes(termoBusca);
    const codigoMatch = (peca.codigo || "").toLowerCase().includes(termoBusca);
    const categoriaMatch =
      !categoriaFiltro || peca.categoria === categoriaFiltro;

    return (nomeMatch || codigoMatch) && categoriaMatch;
  });

  // Ordenar peças
  const pecasOrdenadas = [...pecasFiltradas].sort((a, b) => {
    if (ordem === "preco") {
      return a.valor - b.valor;
    } else if (ordem === "desconto") {
      return b.desconto - a.desconto;
    } else if (ordem === "alfabetica") {
      return a.nome_fantasia.localeCompare(b.nome_fantasia);
    }
    return 0;
  });

  // Paginar peças
  const pecasPaginadas = pecasOrdenadas.slice(
    (paginaAtual - 1) * itensPorPagina,
    paginaAtual * itensPorPagina
  );

  const totalPaginas = Math.ceil(pecasOrdenadas.length / itensPorPagina);

  // Verificar se a página atual está dentro dos limites
  useEffect(() => {
    if (paginaAtual > totalPaginas && totalPaginas > 0) {
      setPaginaAtual(totalPaginas);
    }
  }, [paginaAtual, totalPaginas]);

  // Handlers
  const handleVerDetalhes = (peca) => {
    setDetalhesPeca(peca);
  };

  const fecharDetalhes = () => {
    setDetalhesPeca(null);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p>Carregando peças em promoção...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="flex justify-center items-center mb-6 text-2xl font-bold text-gray-900">
          Peças em Promoção
        </h1>

      {/* Menu Button */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="absolute top-4 left-4 z-50 p-2 rounded text-white"
        >
          <img src={iconMenu} alt="Menu" className="w-6 h-6" />
        </button>
      )}

      {/* Menu Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}

      {/* Sidebar Menu */}
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
        <button
          className="p-4 bg-gray-700 text-left w-full text-yellow-300"
          onClick={() => navigate("/PecasPromocao")}
        >
          Peças em Promoção
        </button>
      </aside>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <label htmlFor="categoria" className="block text-sm font-bold mb-2">
            Filtrar por Categoria
          </label>
          <select
            id="categoria"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categorias.map((categoria) => (
              <option key={categoria} value={categoria}>
                {categoria}
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
            <option value="preco">Menor Preço</option>
            <option value="desconto">Maior Desconto</option>
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
          </select>
        </div>
      </div>

      {/* Voltar para Peças 
      <div className="mb-6">
        <button
          onClick={() => navigate("/pecas")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition duration-200 flex items-center"
        >
          ← Voltar para Peças
        </button>
      </div>
      */}
      

      {/* Grid de Peças em Promoção */}
      {pecasPaginadas.length === 0 ? (
        <div className="text-center p-8">
          <p>Nenhuma peça em promoção encontrada.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {pecasPaginadas.map((peca) => (
            <div
              key={peca.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleVerDetalhes(peca)}
            >
              <div className="relative">
                <img
                  src={peca.imagem}
                  alt={peca.nome_fantasia}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-0 right-0 bg-blue-900 text-white px-2 py-1 rounded-bl font-bold">
                  {peca.desconto
                    ? `${peca.desconto.toFixed(0)}% OFF`
                    : "PROMOÇÃO"}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">
                  {peca.nome_fantasia}
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Código: {peca.codigo}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Fabricante:{" "}
                  {fabricantes[peca.fabricante_id] || "Não Informado"}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-gray-500 line-through text-sm">
                      R${" "}
                      {peca.valor_original
                        ? peca.valor_original.toFixed(2)
                        : "-"}
                    </span>
                    <p className="font-bold text-blue-600 text-xl">
                      R$ {peca.valor ? peca.valor.toFixed(2) : "-"}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500">
                    Estoque: {peca.estoque || 0}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      <div className="flex justify-center items-center mt-8 space-x-2">
        <button
          disabled={paginaAtual <= 1 || totalPaginas === 0}
          onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 bg-[#14213D] text-white font-semibold rounded disabled:opacity-50"
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
          className="px-4 py-2 bg-[#14213D] text-white font-semibold rounded disabled:opacity-50"
        >
          Próxima
        </button>
      </div>

      {/* Modal de Detalhes */}
      {detalhesPeca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={detalhesPeca.imagem}
                  alt={detalhesPeca.nome_fantasia}
                  className="w-full rounded-lg"
                />
              </div>
              <div className="md:w-1/2 md:pl-6 mt-4 md:mt-0">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold">
                    {detalhesPeca.nome_fantasia}
                  </h2>
                  <span className="bg-blue-900 text-white px-3 py-1 rounded-full font-bold">
                    {detalhesPeca.desconto
                      ? `${detalhesPeca.desconto.toFixed(0)}% OFF`
                      : "PROMOÇÃO"}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-gray-500 line-through text-lg">
                    R${" "}
                    {detalhesPeca.valor_original
                      ? detalhesPeca.valor_original.toFixed(2)
                      : "-"}
                  </p>
                  <p className="font-bold text-blue-600 text-3xl">
                    R${" "}
                    {detalhesPeca.valor ? detalhesPeca.valor.toFixed(2) : "-"}
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  <p>
                    <span className="font-semibold">Código:</span>{" "}
                    {detalhesPeca.codigo}
                  </p>
                  <p>
                    <span className="font-semibold">Categoria:</span>{" "}
                    {detalhesPeca.categoria}
                  </p>
                  <p>
                    <span className="font-semibold">Produto:</span>{" "}
                    {detalhesPeca.produto}
                  </p>
                  <p>
                    <span className="font-semibold">Fabricante:</span>{" "}
                    {fabricantes[detalhesPeca.fabricante_id] || "Não Informado"}
                  </p>
                  <p>
                    <span className="font-semibold">Estoque:</span>{" "}
                    {detalhesPeca.estoque} unidades
                  </p>
                  <p>
                    <span className="font-semibold">Localização:</span>{" "}
                    {detalhesPeca.municipio}, {detalhesPeca.estado}
                  </p>
                  <p>
                    <span className="font-semibold">Contato:</span>{" "}
                    {detalhesPeca.telefone}
                  </p>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={fecharDetalhes}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Fechar
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
                    onClick={() => {
                      // Aqui você pode adicionar lógica para contatar o fornecedor
                      alert(
                        `Entraremos em contato com o fornecedor pelo telefone ${detalhesPeca.telefone}`
                      );
                    }}
                  >
                    Contatar Fornecedor
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PecasPromocao;

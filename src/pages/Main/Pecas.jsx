import React, { useState, useEffect, useMemo, useCallback } from "react";
import iconMenu from "/src/assets/images/icon-menu.svg";
import api from "/src/api/api";
import { useCarrinho } from "/src/context/CarrinhoContext";
import { useNavigate } from "react-router-dom";

const Pecas = () => {
  const [pecas, setPecas] = useState([]);
  const [fabricantes, setFabricantes] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [menuOpen, setMenuOpen] = useState(false);
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(16);

  const [fabricanteFiltro, setFabricanteFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [produtoFiltro, setProdutoFiltro] = useState("");
  const [ordem, setOrdem] = useState("data");
  const [busca, setBusca] = useState(""); // Texto digitado pelo usuário
  const [termoBusca, setTermoBusca] = useState(""); // Termo efetivamente usado na busca

  // Estados de detalhes e modais
  const [detalhesPeca, setDetalhesPeca] = useState(null);
  const [detalhesAbertos, setDetalhesAbertos] = useState(null);
  const [showContactSuccessPopup, setShowContactSuccessPopup] = useState(false);
  const [showCarrinhoPopup, setShowCarrinhoPopup] = useState(false);

  // Estados para feature de oficina
  const [userType, setUserType] = useState("");
  const [showPromotionPopup, setShowPromotionPopup] = useState(false);
  const [pecasPromocao, setPecasPromocao] = useState([]);
  const [pecaPromocaoSelecionada, setPecaPromocaoSelecionada] = useState(null);
  const [pecasSimilares, setPecasSimilares] = useState([]);
  const [mostrandoPecasSimilares, setMostrandoPecasSimilares] = useState(false);

  const { carrinho, adicionarAoCarrinho } = useCarrinho();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Função de busca otimizada - só executa quando o usuário clica na lupa
  const handleSearchClick = useCallback(() => {
    setTermoBusca(busca.trim());
    setCurrentPage(1); // Reset para a primeira página ao buscar
  }, [busca]);

  // Função para pressionar Enter e realizar a busca
  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        handleSearchClick();
      }
    },
    [handleSearchClick]
  );

  // Verificação de tipo de usuário (memoizada)
  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;

      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const tipo = response?.data?.data?.userType;

        if (tipo) {
          setUserType(tipo);

          if (tipo === "oficina") {
            fetchPecasPromocao();
            setShowPromotionPopup(true);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      }
    };

    fetchUserData();
  }, [token]);

  // Carregar peças (memoizada)
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const fetchPecas = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/pecas",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const pecasData = response.data.data;
        if (Array.isArray(pecasData)) {
          setPecas(pecasData);
          if (pecasData.length > 0 && currentPage === 0) {
            setCurrentPage(1);
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

  // Carregar fabricantes
  useEffect(() => {
    if (!token) return;

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
          const fabricantesData = response.data.data.data.reduce(
            (acc, fabricante) => {
              acc[fabricante.id] = fabricante.nome;
              return acc;
            },
            {}
          );
          setFabricantes(fabricantesData);
        }
      } catch (error) {
        console.error("Erro ao buscar fabricantes:", error);
      }
    };

    fetchFabricantes();
  }, [token]);

  // Carregar categorias
  useEffect(() => {
    if (!token) return;

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

  // Busca peças em promoção para o popup (mock)
  const fetchPecasPromocao = useCallback(() => {
    // Simulação de API - substituir por chamada real
    const pecasPromo = [
      {
        id: 1,
        nome_fantasia: "Filtro de Óleo Premium",
        codigo: "FO-2345",
        fabricante_id: 1,
        categoria: "Filtros",
        produto: "Filtro de Óleo",
        valor: 49.9,
        estado: "São Paulo",
        municipio: "São Paulo",
        telefone: "(11) 98765-4321",
        estoque: 25,
        imagem:
          "https://dcdn-us.mitiendanube.com/stores/762/826/products/tbm31-783da3b6329b81b93715737641473749-640-0.png", // Filtro de óleo
      },
      {
        id: 2,
        nome_fantasia: "Pastilha de Freio Cerâmica",
        codigo: "PF-8721",
        fabricante_id: 2,
        categoria: "Freios",
        produto: "Pastilha de Freio",
        valor: 129.9,
        estado: "São Paulo",
        municipio: "Campinas",
        telefone: "(19) 98765-1234",
        estoque: 15,
        imagem:
          "https://dcdn-us.mitiendanube.com/stores/762/826/products/tbm31-783da3b6329b81b93715737641473749-640-0.png",
      },
      {
        id: 3,
        nome_fantasia: "Vela de Ignição Iridium",
        codigo: "VI-4520",
        fabricante_id: 3,
        categoria: "Ignição",
        produto: "Vela de Ignição",
        valor: 89.9,
        estado: "Minas Gerais",
        municipio: "Belo Horizonte",
        telefone: "(31) 97654-3210",
        estoque: 30,
        imagem:
          "https://dcdn-us.mitiendanube.com/stores/762/826/products/tbm31-783da3b6329b81b93715737641473749-640-0.png",
      },
      {
        id: 4,
        nome_fantasia: "Amortecedor Dianteiro",
        codigo: "AM-7890",
        fabricante_id: 2,
        categoria: "Suspensão",
        produto: "Amortecedor",
        valor: 349.9,
        estado: "Rio de Janeiro",
        municipio: "Rio de Janeiro",
        telefone: "(21) 96543-2109",
        estoque: 8,
        imagem:
          "https://dcdn-us.mitiendanube.com/stores/762/826/products/tbm31-783da3b6329b81b93715737641473749-640-0.png",
      },
      {
        id: 5,
        nome_fantasia: "Bomba d'água Universal",
        codigo: "BA-1234",
        fabricante_id: 1,
        categoria: "Arrefecimento",
        produto: "Bomba d'água",
        valor: 199.9,
        estado: "Paraná",
        municipio: "Curitiba",
        telefone: "(41) 95432-1098",
        estoque: 12,
        imagem:
          "https://dcdn-us.mitiendanube.com/stores/762/826/products/tbm31-783da3b6329b81b93715737641473749-640-0.png",
      },
    ];

    setPecasPromocao(pecasPromo);
  }, []);

  // Filtrar peças conforme os critérios (memoizado)
  const pecasFiltradas = useMemo(() => {
    // Se estamos mostrando peças similares, retornamos apenas essas
    if (mostrandoPecasSimilares) {
      return pecasSimilares;
    }

    let resultado = pecas.filter((peca) => {
      // Aplicar filtros de busca apenas quando há um termo de busca
      const termoMatch =
        !termoBusca ||
        (peca.nome_fantasia &&
          peca.nome_fantasia
            .toLowerCase()
            .includes(termoBusca.toLowerCase())) ||
        (peca.codigo &&
          peca.codigo.toLowerCase().includes(termoBusca.toLowerCase()));

      const fabricanteMatch =
        !fabricanteFiltro ||
        String(peca.fabricante_id) === String(fabricanteFiltro);
      const categoriaMatch =
        !categoriaFiltro || peca.categoria === categoriaFiltro;
      const produtoMatch = !produtoFiltro || peca.produto === produtoFiltro;

      return termoMatch && fabricanteMatch && categoriaMatch && produtoMatch;
    });

    // Ordenação
    if (ordem === "data") {
      resultado.sort(
        (a, b) =>
          new Date(b.data_cadastro || 0) - new Date(a.data_cadastro || 0)
      );
    } else if (ordem === "alfabetica") {
      resultado.sort((a, b) => {
        if (!a.nome_fantasia && !b.nome_fantasia) return 0;
        if (!a.nome_fantasia) return 1;
        if (!b.nome_fantasia) return -1;
        return a.nome_fantasia.localeCompare(b.nome_fantasia);
      });
    } else if (ordem === "preco_menor") {
      resultado.sort((a, b) => (a.valor || 0) - (b.valor || 0));
    } else if (ordem === "preco_maior") {
      resultado.sort((a, b) => (b.valor || 0) - (a.valor || 0));
    }

    return resultado;
  }, [
    pecas,
    termoBusca, // Agora usamos termoBusca ao invés de busca
    ordem,
    fabricanteFiltro,
    categoriaFiltro,
    produtoFiltro,
    mostrandoPecasSimilares,
    pecasSimilares,
  ]);

  // Obter peças para a página atual (memoizado)
  const pecasPaginadas = useMemo(() => {
    const inicio = (currentPage - 1) * itemsPerPage;
    const fim = inicio + itemsPerPage;
    return pecasFiltradas.slice(inicio, fim);
  }, [pecasFiltradas, currentPage, itemsPerPage]);

  // Calcular número total de páginas
  const totalPages = Math.ceil(pecasFiltradas.length / itemsPerPage);

  // Garantir que a página atual esteja dentro dos limites
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Handlers
  const handleVerDetalhes = useCallback((peca) => {
    setDetalhesPeca(peca);
  }, []);

  const fecharDetalhes = useCallback(() => {
    setDetalhesPeca(null);
  }, []);

  const toggleDetalhes = useCallback(
    (id) => {
      setDetalhesAbertos(detalhesAbertos === id ? null : id);
    },
    [detalhesAbertos]
  );

  const handleClickPecaPromocao = useCallback(
    (peca) => {
      setPecaPromocaoSelecionada(peca);
      setShowPromotionPopup(false);

      // Buscar peças similares (do mesmo modelo)
      const pecasSimilaresEncontradas = [...pecas, ...pecasPromocao].filter(
        (p) => p.produto === peca.produto
      );

      setPecasSimilares(pecasSimilaresEncontradas);
      setMostrandoPecasSimilares(true);

      // Reset dos filtros para mostrar apenas as peças similares
      setBusca("");
      setTermoBusca("");
      setFabricanteFiltro("");
      setCategoriaFiltro("");
      setProdutoFiltro(peca.produto);
    },
    [pecas, pecasPromocao]
  );

  const voltarParaTodasPecas = useCallback(() => {
    setMostrandoPecasSimilares(false);
    setProdutoFiltro("");
    setCurrentPage(1);
  }, []);

  const limparFiltros = useCallback(() => {
    setBusca("");
    setTermoBusca("");
    setFabricanteFiltro("");
    setCategoriaFiltro("");
    setProdutoFiltro("");
    setOrdem("data");
    setCurrentPage(1);
  }, []);

  // Componente de Carrossel para o Pop-up de Promoções
  const Carousel = ({ items }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
      setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
      setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
    };

    return (
      <div className="relative w-full">
        <div className="overflow-hidden rounded-lg">
          <div className="flex justify-center">
            <img
              src={items[currentIndex].imagem}
              alt={items[currentIndex].nome_fantasia}
              className="w-64 h-64 object-cover cursor-pointer"
              onClick={() => handleClickPecaPromocao(items[currentIndex])}
            />
          </div>
          <div className="mt-2 text-center">
            <h3 className="font-bold text-lg">
              {items[currentIndex].nome_fantasia}
            </h3>
            <p className="text-sm">Código: {items[currentIndex].codigo}</p>
            <p className="text-sm">
              Fabricante:{" "}
              {fabricantes[items[currentIndex].fabricante_id] ||
                "Não Informado"}
            </p>
            <p className="font-bold text-green-600 text-lg">
              R$ {items[currentIndex].valor.toFixed(2)}
            </p>
            <button
              onClick={() => handleClickPecaPromocao(items[currentIndex])}
              className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Ver Mais Deste Modelo
            </button>
          </div>
        </div>
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r"
        >
          ❮
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l"
        >
          ❯
        </button>
        <div className="flex justify-center mt-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`mx-1 w-3 h-3 rounded-full ${
                currentIndex === idx ?"bg-blue-600" : "bg-gray-300"
              }`}
            ></button>
          ))}
        </div>
      </div>
    );
  };

  // Componente de Card de Peça - Extraído para melhorar a performance
  // Alterado para estilo horizontal como no Mercado Livre
  const PecaCard = React.memo(({ peca }) => {
    const imagemUrl = peca.foto
      ? peca.foto.startsWith("http")
        ? peca.foto
        : `https://vps55372.publiccloud.com.br/storage/fotos/${peca.foto}`
      : peca.imagem ||
        "https://dcdn-us.mitiendanube.com/stores/762/826/products/tbm31-783da3b6329b81b93715737641473749-640-0.png";
        

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-transform hover:shadow-lg hover:border-blue-300 flex flex-col sm:flex-row">
        {/* Lado esquerdo: Imagem */}
        <div className="w-full sm:w-40 h-40 p-2 flex-shrink-0">
          <img
            src={imagemUrl}
            alt={peca.nome_fantasia || "Peça automotiva"}
            className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Lado direito: Informações */}
        <div className="p-4 flex-1">
          <div className="flex flex-col h-full justify-between">
            <div>
              <h3
                className="text-sm text-gray-600 mb-1"
                title={fabricantes[peca.fabricante_id] || "Fabricante"}
              >
                {fabricantes[peca.fabricante_id] || "Fabricante"}
              </h3>
              <h3
                className="font-medium text-base mb-2 line-clamp-2"
                title={peca.nome_fantasia || "-"}
              >
                {peca.nome_fantasia || "-"}
              </h3>
              <p className="text-xs text-gray-600 mb-1">
                {peca.estado}, {peca.municipio}
              </p>
            </div>

            <div>
              <p className="text-green-600 font-bold text-xl mb-1">
                R$ {(peca.valor || 0).toFixed(2)}
              </p>
              <p className="text-xs text-green-700 mb-3">
                Em até 12x sem juros
              </p>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleVerDetalhes(peca)}
                  className="flex-1 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm font-medium"
                >
                  Ver Detalhes
                </button>
                <button
                  onClick={() => adicionarAoCarrinho(peca)}
                  className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-medium"
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

  

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen w-[90vw] md:w-[80vw] lg:w-[75vw]">
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
     
      <header className="bg-gray-100 py-2 px-4 shadow-md sticky top-0">
        <div className="max-w-screen-xl mx-auto w-full px-4">
          <div className="flex items-center">
            {/* Barra de busca destacada */}
            <div className="flex-1 relative">
              <div className="flex rounded-md overflow-hidden border-2 border-blue-600 focus-within:ring-2 focus-within:ring-blue-500">
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full py-2 px-4 outline-none text-gray-700"
                  placeholder="Busque peças por nome ou código..."
                />
                <button
                  onClick={handleSearchClick}
                  className="bg-blue-500 px-4 hover:bg-blue-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Carrinho de compras */}
            <button
              onClick={() => navigate("/CarrinhoPage")}
              className="ml-4 p-2 text-gray-700 relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {carrinho?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {carrinho.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Filtros colapsáveis estilo Mercado Livre */}
        <div className="bg-white rounded-lg shadow mb-4">
          <button
            onClick={() => setFiltrosAbertos(!filtrosAbertos)}
            className="w-full px-4 py-3 flex justify-between items-center font-medium text-gray-700 border-b border-gray-200"
          >
            <span>Filtros</span>
            <span>{filtrosAbertos ? "▲" : "▼"}</span>
          </button>

          {filtrosAbertos && (
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="fabricante"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fabricante
                </label>
                <select
                  id="fabricante"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={fabricanteFiltro}
                  onChange={(e) => {
                    setFabricanteFiltro(e.target.value);
                    setCurrentPage(1);
                  }}
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
                <label
                  htmlFor="categoria"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Categoria
                </label>
                <select
                  id="categoria"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={categoriaFiltro}
                  onChange={(e) => {
                    setCategoriaFiltro(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Todas</option>
                  {categorias.map((cat) => (
                    <option key={cat.value} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="produto"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Produto
                </label>
                <input
                  type="text"
                  id="produto"
                  value={produtoFiltro}
                  onChange={(e) => {
                    setProdutoFiltro(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Digite o nome do produto"
                />
              </div>

              <div>
                <label
                  htmlFor="ordem"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ordenar por
                </label>
                <select
                  id="ordem"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  value={ordem}
                  onChange={(e) => {
                    setOrdem(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="data">Mais recentes</option>
                  <option value="alfabetica">Ordem alfabética</option>
                  <option value="preco_menor">Menor preço</option>
                  <option value="preco_maior">Maior preço</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={limparFiltros}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Barra de informações e controles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white rounded-lg shadow px-4 py-3 mb-4">
          <div className="mb-2 sm:mb-0">
            <span className="font-medium">
              {pecasFiltradas.length} resultado
              {pecasFiltradas.length !== 1 && "s"}
            </span>
          </div>

          {/* Itens por página */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
              <label htmlFor="itemsPerPage" className="text-sm mr-2">
                Itens por página:
              </label>
              <select
                id="itemsPerPage"
                className="border border-gray-300 rounded px-2 py-1 text-sm"
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={8}>8</option>
                <option value={16}>16</option>
                <option value={32}>32</option>
                <option value={64}>64</option>
              </select>
            </div>
          </div>
        </div>

        {/* Area de conteúdo principal - mais larga como no Mercado Livre */}
        <div className="w-full mx-auto">
          {/* Breadcrumb para peças similares */}
          {mostrandoPecasSimilares && (
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <div className="flex items-center text-sm">
                <button
                  onClick={voltarParaTodasPecas}
                  className="text-blue-500 hover:underline flex items-center"
                >
                  <span>Voltar para todas as peças</span>
                </button>
                <span className="mx-2">›</span>
                <span className="font-medium">
                  Mostrando resultados para "{produtoFiltro}"
                </span>
              </div>
            </div>
          )}

          {/* Mensagem quando não há resultados */}
          {pecasFiltradas.length === 0 && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                Nenhum resultado encontrado
              </h3>
              <p className="text-gray-500 mb-4">
                Tente outros termos de busca ou remova alguns filtros.
              </p>
              <button
                onClick={limparFiltros}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Limpar Filtros
              </button>
            </div>
          )}

          {/* Grid responsivo de peças - ajustado para ser mais largo */}
          {pecasFiltradas.length > 0 && (
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-4">
                {pecasPaginadas.map((peca) => (
                  <div className="w-full bg-white rounded-lg shadow p-4">
                    <PecaCard key={peca.id} peca={peca} />
                  </div>
                ))}
              </div>
            </div>
          )}

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
        </div>
      </div>

      {/* Modal para detalhes da peça */}
      {detalhesPeca && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold">Detalhes da Peça</h2>
              <button
                onClick={fecharDetalhes}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Imagem */}
                <div className="w-full md:w-1/3">
                  <img
                    src={
                      detalhesPeca.foto
                        ? detalhesPeca.foto.startsWith("http")
                          ? detalhesPeca.foto
                          : `https://vps55372.publiccloud.com.br/storage/fotos/${detalhesPeca.foto}`
                        : detalhesPeca.imagem ||
                          "https://dcdn-us.mitiendanube.com/stores/762/826/products/tbm31-783da3b6329b81b93715737641473749-640-0.png"
                    }
                    alt={detalhesPeca.nome_fantasia || "Peça automotiva"}
                    className="w-full h-auto rounded-lg border"
                  />
                </div>

                {/* Informações */}
                <div className="w-full md:w-2/3">
                  <h3 className="text-2xl font-semibold mb-3">
                    {detalhesPeca.nome_fantasia || "Sem nome"}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    <strong>Código:</strong> {detalhesPeca.codigo || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Fabricante:</strong>{" "}
                    {fabricantes[detalhesPeca.fabricante_id] || "Não informado"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Categoria:</strong>{" "}
                    {detalhesPeca.categoria || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Produto:</strong> {detalhesPeca.produto || "N/A"}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Localização:</strong> {detalhesPeca.municipio},{" "}
                    {detalhesPeca.estado}
                  </p>
                  <p className="text-gray-600 mb-1">
                    <strong>Estoque:</strong>{" "}
                    {detalhesPeca.estoque || "Não informado"} unidades
                  </p>
                  <p className="text-gray-600 mb-4">
                    <strong>Contato:</strong> {detalhesPeca.telefone || "N/A"}
                  </p>

                  <div className="mt-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      R$ {(detalhesPeca.valor || 0).toFixed(2)}
                    </div>
                    <p className="text-green-700 mb-4">
                      Em até 12x sem juros • Frete grátis
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => {
                          adicionarAoCarrinho(detalhesPeca);
                          setShowCarrinhoPopup(true);
                          setTimeout(() => setShowCarrinhoPopup(false), 3000);
                        }}
                        className="flex-1 bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 font-medium"
                      >
                        Adicionar ao Carrinho
                      </button>
                      <button
                        onClick={() => {
                          adicionarAoCarrinho(detalhesPeca);
                          navigate("/CarrinhoPage");
                        }}
                        className="flex-1 bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 font-medium"
                      >
                        Comprar Agora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para promoções (só aparece para oficinas) */}
      {showPromotionPopup && userType === "oficina" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="flex justify-between items-center p-4 bg-blue-600 text-white rounded-t-lg">
              <h2 className="text-xl font-bold">
                Ofertas Especiais para Oficinas
              </h2>
              <button
                onClick={() => setShowPromotionPopup(false)}
                className="text-white hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Confira estas peças em oferta exclusiva para o seu tipo de
                negócio!
              </p>

              {pecasPromocao.length > 0 && <Carousel items={pecasPromocao} />}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPromotionPopup(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Ver mais tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup de confirmação de adição ao carrinho */}
      {showCarrinhoPopup && (
        <div className="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg z-50 animate-fade-in-up">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Item adicionado ao carrinho!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pecas;

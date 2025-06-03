import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import iconMenu from "/src/assets/images/icon-menu.svg";
import { FaSpinner } from "react-icons/fa";
import { useForm } from "react-hook-form";
import api from "/src/api/api";

function CadastroPecas() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const [categorias, setCategorias] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false); // Controle do estado da barra lateral
    const [userType, setUserType] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [alerta, setAlerta] = useState("");
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
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

  // Buscar categorias ao carregar a página

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/categorias",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const categoriasData = response.data.map((categoria) => ({
          value: categoria.id,
          label: categoria.nome,
        }));
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        setAlerta("Erro ao carregar categorias. Tente novamente mais tarde.");
      }
    };

    fetchCategorias();
  }, [token]);

  // Buscar produtos ao selecionar uma categoria
  useEffect(() => {
    if (!categoriaSelecionada) return;

    const fetchProdutos = async () => {
      try {
        const response = await api.get(
          `https://vps55372.publiccloud.com.br/api/produtos/categoria/${categoriaSelecionada.value}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]);
        setAlerta("Erro ao carregar produtos. Tente novamente.");
      }
    };

    fetchProdutos();
  }, [categoriaSelecionada, token]);

 // Buscar fabricantes ao carregar a página
 useEffect(() => {
    const fetchFabricantes = async () => {
      try {
        const response = await api.get(
          "https://vps55372.publiccloud.com.br/api/fabricantes",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // Verificar a existência do array de fabricantes
        if (
          response.data &&
          response.data.data &&
          Array.isArray(response.data.data.data)
        ) {
          const fabricantesData = response.data.data.data.map((fabricante) => ({
            value: fabricante.id,
            label: fabricante.nome,
          }));
          setFabricantes(fabricantesData); // Supondo que `setFabricantes` foi declarado
        } else {
          console.error("Estrutura inesperada na resposta:", response.data);
          setAlerta("Erro ao carregar fabricantes. Formato inesperado.");
        }
      } catch (error) {
        console.error("Erro ao buscar fabricantes:", error);
        setAlerta("Erro ao carregar fabricantes. Tente novamente mais tarde.");
      }
    };
  
    fetchFabricantes();
  }, [token]);
  
  


  // Submissão do formulário
  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("nome_fantasia", data.nome_fantasia); 
    formData.append("codigo", data.codigo);
    formData.append("fabricante_id", data.fabricante_id);
    formData.append("produto_id", data.id_produto); // Ajustado para 'produto_id'
    formData.append("foto", data.foto[0]);
    try {
      await api.post(
        "https://vps55372.publiccloud.com.br/api/pecas",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Peça cadastrada com sucesso!");
      navigate("/PecasRouter")
    } catch (error) {
      console.error("Erro ao cadastrar peça:", error);
    
      if (error.response && error.response.status === 422) {
        // Mapeamento de erros em inglês para português
        const traducaoErros = {
          "The codigo has already been taken.": "O código já está em uso.",
          "The nome_fantasia field is required.": "O nome fantasia é obrigatório.",
          "The codigo field is required.": "O código da peça é obrigatório.",
          "The fabricante_id field is required.": "O fabricante é obrigatório.",
          "The produto_id field is required.": "O produto é obrigatório.",
          "The foto field is required.": "A foto é obrigatória.",
          "The foto field must be an image.": "A foto precisa ser no formato jpg ou png."
        };
    
        // Substituir os erros retornados pela API por suas versões em português
        const mensagensErro = Object.values(error.response.data.errors)
          .flat()
          .map((msg) => traducaoErros[msg] || msg) // Traduz ou mantém o original caso não esteja no dicionário
          .join(" ");
    
        setAlerta(mensagensErro);
      } else {
        setAlerta("Erro ao cadastrar peça. Verifique os campos e tente novamente.");
      } 
    }
      finally {
        setIsLoading(false);
      }
    
  }
  
  return (
    <div className="container mx-auto p-4">
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

      <h1 className="text-2xl font-bold mb-6 text-center">Cadastro de Peças</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="categoria" className="block text-sm font-bold mb-2">
            Categoria
          </label>
          <Select
            options={categorias}
            onChange={(selectedOption) => {
              setValue(
                "categoria_id",
                selectedOption ? selectedOption.value : null,
                { shouldValidate: true }
              );
              setCategoriaSelecionada(selectedOption);
            }}
            placeholder="Selecione a categoria"
            isClearable
          />
          {errors.categoria_id && (
            <p className="text-red-500">{errors.categoria_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="produto" className="block text-sm font-bold mb-2">
            Produto
          </label>
          <select
            id="produto"
            {...register("id_produto", { required: "O produto é obrigatório" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="" disabled>Selecione um produto</option>
            {produtos.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
          {errors.id_produto && (
            <p className="text-red-500">{errors.id_produto.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-bold mb-2"
          >
            Nome Fantasia
          </label>
          <input
            type="text"
            id="nome_fantasia"
            {...register("nome_fantasia")}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.nome_fantasia && (
            <p className="text-red-500">{errors.nome_fantasia.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="codigo" className="block text-sm font-bold mb-2">
            Código da Peça
          </label>
          <input
            type="text"
            id="codigo"
            {...register("codigo", { required: "O código é obrigatório" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.codigo && (
            <p className="text-red-500">{errors.codigo.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="fabricante" className="block text-sm font-bold mb-2">
            Fabricante
          </label>
          <Select
            options={fabricantes}
            onChange={(selectedOption) => {
              setValue(
                "fabricante_id",
                selectedOption ? selectedOption.value : null,
                { shouldValidate: true }
              );
            }}
            placeholder="Selecione o fabricante"
            isClearable
          />
          {errors.fabricante_id && (
            <p className="text-red-500">{errors.fabricante_id.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="foto" className="block text-sm font-bold mb-2">
            Upload de Foto do Produto
          </label>
          <input
            type="file"
            id="foto"
            {...register("foto", { required: "A foto é obrigatória" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.foto && <p className="text-red-500">{errors.foto.message}</p>}
        </div>

      {alerta && <p className="text-red-500 mt-4">{alerta}</p>}

        <div className="flex items-center justify-between md:justify-center">
          <button
            type="submit"
            className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full md:w-48  hover:bg-[#fcb645]"
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
            href="/PecasRouter"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Voltar
          </a>
        </div>
      </form>

    </div>
  );
}

export default CadastroPecas;

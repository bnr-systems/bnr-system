import React, { useState } from "react";
import api from "/src/api/api";
import { useAuth } from "/src/context/AuthContext"; 
import iconMenu from "/src/assets/images/icon-menu.svg";
import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../../context/CarrinhoContext";
import { ShoppingCart, ArrowLeft, Trash2, Send, Check } from "lucide-react";

const CarrinhoPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth(); 
  const { carrinho, removerDoCarrinho, limparCarrinho } = useCarrinho();
  const [contatoEnviado, setContatoEnviado] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState([]);


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

  const handleSolicitacao = async () => {
    try {
      setIsLoading(true);
      const agrupadoPorUnidade = {};

      carrinho.forEach((peca) => {
        if (!peca.unidade_id) return;

        if (!agrupadoPorUnidade[peca.unidade_id]) {
          agrupadoPorUnidade[peca.unidade_id] = [];
        }

        const descricao = `${peca.nome_fantasia} - Código: ${peca.codigo}, Quantidade: ${peca.quantidade ?? 1}`;
        agrupadoPorUnidade[peca.unidade_id].push(descricao);
      });

      const body = Object.entries(agrupadoPorUnidade)
        .filter(([unidadeId]) => unidadeId && unidadeId !== "undefined")
        .map(([unidadeId, pecas]) => ({
          unidade_id: Number(unidadeId),
          pecas,
        }));

      await api.post(
        "https://vps55372.publiccloud.com.br/api/solicitacao-orcamento",
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContatoEnviado(true);
      limparCarrinho();
    } catch (error) {
      console.error("Erro ao enviar orçamento:", error);
      alert("Erro ao enviar orçamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, peca) => {
      const quantidade = peca.quantidade || 1;
      const valor = peca.valor || 0;
      return total + valor * quantidade;
    }, 0);
  };

  if (contatoEnviado) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-10">
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

        <div className="flex flex-col items-center text-center">
          <div className="bg-green-100 p-4 rounded-full mb-4">
            <Check size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-semibold text-green-700 mb-2">
            Solicitação enviada com sucesso!
          </h2>
          <p className="text-gray-600 mb-2">
            Em breve entraremos em contato com você.
          </p>
          <p className="text-gray-500 text-sm">
            Se preferir, ligue para: (11) XXXX-XXXX
          </p>
          <button
            onClick={() => navigate("/PecasRouter")}
            className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all flex items-center gap-2 shadow"
          >
            <ArrowLeft size={18} />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 bg-white rounded-2xl shadow-lg mt-10 w-full">
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

  <div className="mb-6 sm:mb-8 text-center sm:text-left">
    <button
      onClick={() => navigate("/PecasRouter")}
      className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors gap-1"
    >
      <ArrowLeft size={18} />
      Voltar
    </button>
  </div>

  {carrinho.length === 0 ? (
    <div className="py-16 flex flex-col items-center text-center">
      <ShoppingCart size={64} className="text-gray-300 mb-4" />
      <p className="text-gray-600 text-xl mb-4">Seu carrinho está vazio.</p>
      <button
        onClick={() => navigate("/PecasRouter")}
        className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all shadow"
      >
        Adicionar Peças
      </button>
    </div>
  ) : (
    <>
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200 mb-6">
        <table className="min-w-[500px] w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Peça</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Código</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4">Valor</th>
              <th className="px-4 py-3 sm:px-6 sm:py-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {carrinho.map((peca) => (
              <tr key={peca.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 sm:px-6 sm:py-4 font-medium">
                  {peca.nome_fantasia}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-gray-600">
                  {peca.codigo}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 font-semibold text-gray-800">
                  R$ {(peca.valor ?? 0).toFixed(2)}
                </td>
                <td className="px-4 py-3 sm:px-6 sm:py-4 text-center">
                  <button
                    onClick={() => removerDoCarrinho(peca.id)}
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full transition-colors"
                    aria-label="Remover item"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-100">
            <tr>
              <td
                colSpan="2"
                className="px-4 py-3 sm:px-6 sm:py-4 text-right font-semibold text-gray-700"
              >
                Total:
              </td>
              <td className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-lg text-green-600">
                R$ {calcularTotal().toFixed(2)}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
        <button
          onClick={limparCarrinho}
          className="w-full sm:w-auto px-5 py-2 text-gray-600 border border-gray-300 rounded-full hover:bg-gray-100 transition-colors"
        >
          Limpar Carrinho
        </button>
        <button
          onClick={handleSolicitacao}
          disabled={isLoading}
          className={`w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-full font-semibold shadow-md hover:bg-green-700 transition-all flex items-center justify-center gap-2 ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Enviando..." : (
            <>
              <Send size={18} />
              Solicitar Contato
            </>
          )}
        </button>
      </div>
    </>
  )}
</div>

  );
};

export default CarrinhoPage;

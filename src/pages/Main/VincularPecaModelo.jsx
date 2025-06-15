import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "/src/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Menu from "/src/components/Menu";
import api from "/src/api/api";
import { FaSpinner } from "react-icons/fa";

function VincularPecaModelo() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [pecas, setPecas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alerta, setAlerta] = useState("");

  useEffect(() => {
  const fetchPecas = async () => {
    try {
      setIsLoading(true);
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

      const opcoes = allPecas.map((peca) => ({
        value: peca.id,
        label: `${peca.nome_fantasia || peca.nome || "Peça"} - ${peca.codigo}`,
      }));

      setPecas(opcoes);
    } catch (error) {
      console.error("Erro ao buscar peças:", error);
      setPecas([]);
      setAlerta("Erro ao carregar peças.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchModelos = async () => {
    try {
      const response = await api.get("/modelos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const opcoes = response.data.map((modelo) => ({
        value: modelo.id,
        label: modelo.modelo,
      }));
      setModelos(opcoes);
    } catch (error) {
      console.error("Erro ao buscar modelos:", error);
      setAlerta("Erro ao carregar modelos.");
    }
  };

  fetchPecas();
  fetchModelos();
}, [token]);


  const onSubmit = async (data) => {
    setIsLoading(true);
    setAlerta("");

    try {
      await api.post("/peca-modelos", {
        peca_id: data.peca_id,
        modelo_id: data.modelo_id,
        cilindrada: Number(data.cilindrada),
        ano: Number(data.ano),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Peça vinculada com sucesso!");
      navigate("/PecasRouter");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const erros = Object.values(error.response.data.errors)
          .flat()
          .join(" ");
        setAlerta(erros);
      } else {
        setAlerta("Erro ao vincular peça. Verifique os dados e tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Menu />
      <h1 className="text-2xl font-bold mb-6 text-center">Vincular Peça ao Modelo</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Peça</label>
          <Select
            options={pecas}
            onChange={(opt) => setValue("peca_id", opt?.value, { shouldValidate: true })}
            placeholder="Selecione a peça"
            isClearable
          />
          {errors.peca_id && <p className="text-red-500">{errors.peca_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Modelo</label>
          <Select
            options={modelos}
            onChange={(opt) => setValue("modelo_id", opt?.value, { shouldValidate: true })}
            placeholder="Selecione o modelo"
            isClearable
          />
          {errors.modelo_id && <p className="text-red-500">{errors.modelo_id.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Cilindrada</label>
          <input
            type="number"
            {...register("cilindrada", { required: "A cilindrada é obrigatória" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.cilindrada && <p className="text-red-500">{errors.cilindrada.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Ano</label>
          <input
            type="number"
            {...register("ano", { required: "O ano é obrigatório" })}
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
          {errors.ano && <p className="text-red-500">{errors.ano.message}</p>}
        </div>

        {alerta && <p className="text-red-500">{alerta}</p>}

        <button
          type="submit"
          className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded w-full hover:bg-[#fcb645]"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex justify-center items-center">
              <FaSpinner className="animate-spin mr-2" />
              Enviando...
            </div>
          ) : (
            "Vincular Peça"
          )}
        </button>

        <div className="mt-4 text-center">
          <a href="/PecasRouter" className="text-sm text-gray-500 hover:text-gray-700">
            Voltar
          </a>
        </div>
      </form>
    </div>
  );
}

export default VincularPecaModelo;

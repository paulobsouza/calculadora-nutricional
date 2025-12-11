import { useState } from "react";
import { apiService } from "../services/ApiService";
import ModalSelecao from "./ModalSelecao";
import "./BuscaAlimento.css";

function BuscaAlimento({ onAlimentoSelecionado }) {
  const [termoBusca, setTermoBusca] = useState("");
  const [buscando, setBuscando] = useState(false);
  const [opcoes, setOpcoes] = useState([]);
  const [modalAberto, setModalAberto] = useState(false);

  const handleBuscar = async () => {
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) {
      alert("Por favor, digite um alimento para buscar.");
      return;
    }

    setBuscando(true);
    try {
      const data = await apiService.buscarAlimentoUSDA(termo);

      if (data.foods && data.foods.length > 0) {
        setOpcoes(data.foods);
        setModalAberto(true);
      } else {
        alert(
          "Nenhum alimento encontrado. Tente usar termos em inglês ou mais específicos."
        );
      }
    } catch (error) {
      console.error("Erro ao buscar alimento:", error);
      alert("Erro ao buscar alimento. Tente novamente.");
    } finally {
      setBuscando(false);
    }
  };

  const handleSelecionarAlimento = async (alimento) => {
    try {
      const detalhes = await apiService.getDetalhesAlimentoUSDA(alimento.fdcId);
      const nutrientes = detalhes.foodNutrients || [];

      const getValor = (id) => {
        const nutr = nutrientes.find(
          (n) => n.nutrient?.id === id || n.nutrientId === id
        );
        return nutr?.amount || nutr?.value || 0;
      };

      const dadosAlimento = {
        nome: detalhes.description || "",
        carboidratos: getValor(1005).toFixed(1),
        proteinas: getValor(1003).toFixed(1),
        gorduras: getValor(1004).toFixed(1),
      };

      onAlimentoSelecionado(dadosAlimento);
      setModalAberto(false);
      setTermoBusca("");
      alert(`Dados de '${detalhes.description}' carregados!`);
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error);
      alert("Erro ao carregar os dados completos do alimento.");
    }
  };

  return (
    <div className="busca-container">
      <label htmlFor="busca-alimento">
        Buscar Alimento na Base de Dados (em inglês):
      </label>
      <div className="busca-wrapper">
        <input
          type="text"
          id="busca-alimento"
          placeholder="Ex: apple, banana, chicken breast"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
        />
        <button
          type="button"
          className="btn-busca"
          onClick={handleBuscar}
          disabled={buscando}
        >
          {buscando ? "Buscando..." : "Buscar"}
        </button>
      </div>

      <ModalSelecao
        isOpen={modalAberto}
        opcoes={opcoes}
        onClose={() => setModalAberto(false)}
        onSelect={handleSelecionarAlimento}
      />
    </div>
  );
}

export default BuscaAlimento;

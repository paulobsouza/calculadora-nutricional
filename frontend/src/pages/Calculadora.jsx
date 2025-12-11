import { useState, useEffect, useCallback } from "react";
import { apiService } from "../services/ApiService";
import { useAuth } from "../contexts/AuthContext";
import Header from "../components/Header";
import Card from "../components/Card";
import BuscaAlimento from "../components/BuscaAlimento";
import FormAlimento from "../components/FormAlimento";
import ListaAlimentos from "../components/ListaAlimentos";
import FormGastoCalorico from "../components/FormGastoCalorico";
import ResumoDiario from "../components/ResumoDiario";

function Calculadora() {
  const [alimentos, setAlimentos] = useState([]);
  const [metaDiaria, setMetaDiaria] = useState(null);
  const [resumo, setResumo] = useState({ consumidas: 0, restantes: 0 });
  const [dadosPreenchidos, setDadosPreenchidos] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  const carregarEstado = useCallback(async () => {
    try {
      const estado = await apiService.getState();
      setAlimentos(estado.alimentos || []);
      setMetaDiaria(estado.metaDiaria || null);
      setResumo(estado.resumo || { consumidas: 0, restantes: 0 });
    } catch (error) {
      console.error("Falha ao carregar estado inicial:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEstado();
  }, [carregarEstado]);

  const handleAlimentoSelecionado = (dados) => {
    setDadosPreenchidos(dados);
  };

  const handleAdicionarAlimento = async (dados) => {
    try {
      const novoEstado = await apiService.addAlimento(dados);
      setAlimentos(novoEstado.alimentos || []);
      setMetaDiaria(novoEstado.metaDiaria || null);
      setResumo(novoEstado.resumo || { consumidas: 0, restantes: 0 });
      setDadosPreenchidos(null);
    } catch (error) {
      console.error("Falha ao adicionar alimento:", error);
      alert("Erro ao adicionar alimento. Tente novamente.");
    }
  };

  const handleDeletarAlimento = async (id) => {
    try {
      const novoEstado = await apiService.deleteAlimento(id);
      setAlimentos(novoEstado.alimentos || []);
      setMetaDiaria(novoEstado.metaDiaria || null);
      setResumo(novoEstado.resumo || { consumidas: 0, restantes: 0 });
    } catch (error) {
      console.error("Falha ao deletar alimento:", error);
      alert("Erro ao deletar alimento. Tente novamente.");
    }
  };

  const handleDefinirMeta = async (dados) => {
    try {
      const novoEstado = await apiService.definirMeta(dados);
      setAlimentos(novoEstado.alimentos || []);
      setMetaDiaria(novoEstado.metaDiaria || null);
      setResumo(novoEstado.resumo || { consumidas: 0, restantes: 0 });
    } catch (error) {
      console.error("Falha ao definir meta:", error);
      alert("Erro ao definir meta. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <>
        <Header user={user} onLogout={logout} />
        <main className="container">
          <p>Carregando...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Header user={user} onLogout={logout} />
      <main className="container">
        <Card title="Calcular Calorias por Alimento">
          <BuscaAlimento onAlimentoSelecionado={handleAlimentoSelecionado} />
          <hr />
          <FormAlimento
            onSubmit={handleAdicionarAlimento}
            dadosPreenchidos={dadosPreenchidos}
          />
          <ListaAlimentos
            alimentos={alimentos}
            onDelete={handleDeletarAlimento}
          />
        </Card>

        <Card title="Estimativa de Gasto Calórico Diário">
          <FormGastoCalorico onSubmit={handleDefinirMeta} />
          <ResumoDiario metaDiaria={metaDiaria} resumo={resumo} />
        </Card>
      </main>
    </>
  );
}

export default Calculadora;

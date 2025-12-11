import { useState, useEffect } from "react";
import "./FormAlimento.css";

function FormAlimento({ onSubmit, dadosPreenchidos }) {
  const [nome, setNome] = useState("");
  const [carboidratos, setCarboidratos] = useState("");
  const [proteinas, setProteinas] = useState("");
  const [gorduras, setGorduras] = useState("");

  useEffect(() => {
    if (dadosPreenchidos) {
      setNome(dadosPreenchidos.nome || "");
      setCarboidratos(dadosPreenchidos.carboidratos || "");
      setProteinas(dadosPreenchidos.proteinas || "");
      setGorduras(dadosPreenchidos.gorduras || "");
    }
  }, [dadosPreenchidos]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nome, carboidratos, proteinas, gorduras });
    setNome("");
    setCarboidratos("");
    setProteinas("");
    setGorduras("");
  };

  return (
    <form className="form-alimento" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="nome">Nome do Alimento:</label>
        <input
          type="text"
          id="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="carboidratos">Carboidratos (g) / 100g:</label>
        <input
          type="number"
          id="carboidratos"
          step="0.1"
          value={carboidratos}
          onChange={(e) => setCarboidratos(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="proteinas">Proteínas (g) / 100g:</label>
        <input
          type="number"
          id="proteinas"
          step="0.1"
          value={proteinas}
          onChange={(e) => setProteinas(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="gorduras">Gorduras (g) / 100g:</label>
        <input
          type="number"
          id="gorduras"
          step="0.1"
          value={gorduras}
          onChange={(e) => setGorduras(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn">
        Adicionar e Calcular
      </button>
    </form>
  );
}

export default FormAlimento;

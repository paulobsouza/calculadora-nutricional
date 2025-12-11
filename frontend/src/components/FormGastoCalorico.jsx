import { useState } from "react";
import "./FormGastoCalorico.css";

function FormGastoCalorico({ onSubmit }) {
  const [peso, setPeso] = useState("");
  const [objetivo, setObjetivo] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ peso, objetivo });
  };

  return (
    <form className="form-gasto" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="peso">Seu Peso (Kg):</label>
        <input
          type="number"
          id="peso"
          step="0.1"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="objetivo">Seu Objetivo:</label>
        <select
          id="objetivo"
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecione...
          </option>
          <option value="ganho-massa">Ganho de Massa</option>
          <option value="perda-peso">Perda de Peso</option>
        </select>
      </div>
      <button type="submit" className="btn">
        Calcular e Definir Meta
      </button>
    </form>
  );
}

export default FormGastoCalorico;

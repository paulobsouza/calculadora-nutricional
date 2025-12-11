import "./ResumoDiario.css";

function ResumoDiario({ metaDiaria, resumo }) {
  if (!metaDiaria) {
    return (
      <div className="resumo-diario-container">
        <div className="resultado-inicial"></div>
        <div className="resultado-final">
          <p>
            Calcule seu gasto diário para definir uma meta e acompanhar seu
            progresso.
          </p>
        </div>
      </div>
    );
  }

  const classeCor = resumo.restantes >= 0 ? "positivo" : "negativo";

  return (
    <div className="resumo-diario-container">
      <div className="resultado-inicial">
        <h4>Detalhamento de Macronutrientes:</h4>
        <p>
          <strong>Carboidratos:</strong>{" "}
          {metaDiaria.macros.carboidratos.toFixed(1)}g
        </p>
        <p>
          <strong>Proteínas:</strong> {metaDiaria.macros.proteinas.toFixed(1)}g
        </p>
        <p>
          <strong>Gorduras:</strong> {metaDiaria.macros.gorduras.toFixed(1)}g
        </p>
      </div>

      <div className="resultado-final">
        <h4>Resumo Diário ({metaDiaria.objetivo})</h4>
        <div className="resumo-item">
          <p>Meta de Calorias:</p>
          <span>{metaDiaria.total.toFixed(1)} kcal</span>
        </div>
        <div className="resumo-item">
          <p>Calorias Consumidas:</p>
          <span>{resumo.consumidas.toFixed(1)} kcal</span>
        </div>
        <div className="resumo-item">
          <p>Calorias Restantes:</p>
          <span className={classeCor}>{resumo.restantes.toFixed(1)} kcal</span>
        </div>
      </div>
    </div>
  );
}

export default ResumoDiario;

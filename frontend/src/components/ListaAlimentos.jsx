import "./ListaAlimentos.css";

function ListaAlimentos({ alimentos, onDelete }) {
  if (!alimentos || alimentos.length === 0) {
    return (
      <div className="lista-alimentos-container">
        <h3>Lista de Alimentos</h3>
        <ul className="lista-alimentos">
          <li>Nenhum alimento cadastrado hoje.</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="lista-alimentos-container">
      <h3>Lista de Alimentos</h3>
      <ul className="lista-alimentos">
        {alimentos.map((alimento) => (
          <li key={alimento.id}>
            <strong>{alimento.nome}</strong> ({alimento.calorias.toFixed(1)}{" "}
            kcal)
            <button
              className="btn-delete"
              onClick={() => onDelete(alimento.id)}
            >
              X
            </button>
            <br />
            <small>
              C: {alimento.carboidratos}g, P: {alimento.proteinas}g, G:{" "}
              {alimento.gorduras}g
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaAlimentos;

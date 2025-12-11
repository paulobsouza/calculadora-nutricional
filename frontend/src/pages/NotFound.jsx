import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2>Página não encontrada</h2>
        <p>
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/" className="btn btn-primary">
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}

export default NotFound;

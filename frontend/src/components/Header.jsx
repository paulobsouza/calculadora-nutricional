import { Link } from "react-router-dom";
import "./Header.css";

function Header({ user, onLogout }) {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-title">
          <h1>Calculadora Nutricional</h1>
        </Link>
        {user && (
          <div className="header-user">
            <span>Olá, {user.nome}</span>
            <button onClick={onLogout} className="btn-logout">
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

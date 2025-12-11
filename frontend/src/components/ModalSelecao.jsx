import "./ModalSelecao.css";

function ModalSelecao({ isOpen, opcoes, onClose, onSelect }) {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal" onClick={handleBackdropClick}>
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>
        <h3>Selecione o alimento correto:</h3>
        <ul className="lista-opcoes">
          {opcoes.map((item, index) => (
            <li key={index}>
              <button onClick={() => onSelect(item)}>{item.description}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ModalSelecao;

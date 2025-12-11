const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    // Verificar se há token no header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Acesso negado. Token não fornecido.",
      });
    }

    // Extrair o token
    const token = authHeader.split(" ")[1];

    // Verificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "Token inválido. Usuário não encontrado.",
      });
    }

    // Adicionar usuário à requisição
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Token inválido." });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expirado." });
    }
    return res.status(500).json({ message: "Erro na autenticação." });
  }
};

module.exports = authMiddleware;

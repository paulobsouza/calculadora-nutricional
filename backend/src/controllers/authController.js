const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Gerar token JWT
const gerarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Registrar usuário
exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Verificar se usuário já existe
    const usuarioExiste = await User.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ message: "Email já cadastrado." });
    }

    // Criar usuário
    const user = await User.create({ nome, email, senha });

    // Gerar token
    const token = gerarToken(user._id);

    res.status(201).json({
      message: "Usuário criado com sucesso!",
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email já cadastrado." });
    }
    res
      .status(500)
      .json({ message: "Erro ao criar usuário: " + error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validar campos
    if (!email || !senha) {
      return res
        .status(400)
        .json({ message: "Email e senha são obrigatórios." });
    }

    // Buscar usuário com senha
    const user = await User.findOne({ email }).select("+senha");

    if (!user) {
      return res.status(401).json({ message: "Email ou senha incorretos." });
    }

    // Verificar senha
    const senhaCorreta = await user.compararSenha(senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: "Email ou senha incorretos." });
    }

    // Gerar token
    const token = gerarToken(user._id);

    res.json({
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao fazer login." });
  }
};

// Obter perfil do usuário logado
exports.getPerfil = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      peso: user.peso,
      objetivo: user.objetivo,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil." });
  }
};

// Verificar token
exports.verificarToken = async (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user._id,
      nome: req.user.nome,
      email: req.user.email,
    },
  });
};

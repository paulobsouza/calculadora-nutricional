const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Por favor, insira um email válido"],
  },
  senha: {
    type: String,
    required: [true, "Senha é obrigatória"],
    minlength: [6, "A senha deve ter pelo menos 6 caracteres"],
    select: false,
  },
  peso: {
    type: Number,
    default: null,
  },
  objetivo: {
    type: String,
    enum: ["ganho-massa", "perda-peso", null],
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash da senha antes de salvar
userSchema.pre("save", async function () {
  if (!this.isModified("senha")) return;

  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
});

// Método para comparar senhas
userSchema.methods.compararSenha = async function (senhaInformada) {
  return await bcrypt.compare(senhaInformada, this.senha);
};

module.exports = mongoose.model("User", userSchema);

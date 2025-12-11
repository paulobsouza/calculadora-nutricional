require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const alimentoRoutes = require("./routes/alimentoRoutesMongo");

const app = express();

// Conectar ao MongoDB
connectDB();

// Segurança
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requisições por IP
  message: { message: "Muitas requisições. Tente novamente mais tarde." },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // máximo 10 tentativas de login por IP
  message: {
    message: "Muitas tentativas de login. Tente novamente mais tarde.",
  },
});

// Middlewares
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rotas
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api", alimentoRoutes);

// Rota de health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Servidor rodando!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

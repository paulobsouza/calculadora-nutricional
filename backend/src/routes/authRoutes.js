const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Rotas públicas
router.post("/registrar", authController.registrar);
router.post("/login", authController.login);

// Rotas protegidas
router.get("/perfil", authMiddleware, authController.getPerfil);
router.get("/verificar", authMiddleware, authController.verificarToken);

module.exports = router;

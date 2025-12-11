const express = require("express");
const router = express.Router();
const controller = require("../controllers/alimentoControllerMongo");
const authMiddleware = require("../middleware/authMiddleware");

// Todas as rotas de alimentos são protegidas
router.use(authMiddleware);

router.get("/estado", controller.getEstado);
router.post("/alimentos", controller.adicionarAlimento);
router.delete("/alimentos/:id", controller.deletarAlimento);
router.post("/meta", controller.definirMeta);

module.exports = router;

const Alimento = require("../models/alimentoModelMongo");
const User = require("../models/userModel");

// Calcular macros baseado no objetivo
const calcularMacros = (calorias, objetivo) => {
  let carbPercent, protPercent, gordPercent;

  if (objetivo === "ganho-massa") {
    carbPercent = 0.5;
    protPercent = 0.3;
    gordPercent = 0.2;
  } else {
    carbPercent = 0.4;
    protPercent = 0.35;
    gordPercent = 0.25;
  }

  return {
    carboidratos: (calorias * carbPercent) / 4,
    proteinas: (calorias * protPercent) / 4,
    gorduras: (calorias * gordPercent) / 9,
  };
};

// Obter estado atual (alimentos do dia + meta)
exports.getEstado = async (req, res) => {
  try {
    const userId = req.user._id;

    // Buscar alimentos do dia atual
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    const alimentos = await Alimento.find({
      userId,
      data: { $gte: hoje, $lt: amanha },
    }).sort({ data: -1 });

    // Buscar dados do usuário
    const user = await User.findById(userId);

    // Calcular calorias consumidas
    const caloriasConsumidas = alimentos.reduce(
      (total, a) => total + a.calorias,
      0
    );

    // Montar meta diária se houver
    let metaDiaria = null;
    if (user.peso && user.objetivo) {
      const caloriasBase = user.peso * 22;
      const totalCalorias =
        user.objetivo === "ganho-massa"
          ? caloriasBase * 1.2
          : caloriasBase * 0.8;

      metaDiaria = {
        objetivo: user.objetivo,
        total: totalCalorias,
        macros: calcularMacros(totalCalorias, user.objetivo),
      };
    }

    res.json({
      alimentos,
      metaDiaria,
      resumo: {
        consumidas: caloriasConsumidas,
        restantes: metaDiaria ? metaDiaria.total - caloriasConsumidas : 0,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar estado:", error);
    res.status(500).json({ message: "Erro ao buscar dados." });
  }
};

// Adicionar alimento
exports.adicionarAlimento = async (req, res) => {
  try {
    const { nome, carboidratos, proteinas, gorduras } = req.body;

    if (
      !nome ||
      carboidratos == null ||
      proteinas == null ||
      gorduras == null
    ) {
      return res
        .status(400)
        .json({ message: "Todos os campos são obrigatórios." });
    }

    const alimento = await Alimento.create({
      userId: req.user._id,
      nome,
      carboidratos: parseFloat(carboidratos),
      proteinas: parseFloat(proteinas),
      gorduras: parseFloat(gorduras),
    });

    // Retornar estado atualizado
    await exports.getEstado(req, res);
  } catch (error) {
    console.error("Erro ao adicionar alimento:", error);
    res.status(500).json({ message: "Erro ao adicionar alimento." });
  }
};

// Deletar alimento
exports.deletarAlimento = async (req, res) => {
  try {
    const alimento = await Alimento.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!alimento) {
      return res.status(404).json({ message: "Alimento não encontrado." });
    }

    // Retornar estado atualizado
    await exports.getEstado(req, res);
  } catch (error) {
    console.error("Erro ao deletar alimento:", error);
    res.status(500).json({ message: "Erro ao deletar alimento." });
  }
};

// Definir meta diária
exports.definirMeta = async (req, res) => {
  try {
    const { peso, objetivo } = req.body;

    if (!peso || !objetivo) {
      return res
        .status(400)
        .json({ message: "Peso e objetivo são obrigatórios." });
    }

    // Atualizar usuário
    await User.findByIdAndUpdate(req.user._id, {
      peso: parseFloat(peso),
      objetivo,
    });

    // Retornar estado atualizado
    await exports.getEstado(req, res);
  } catch (error) {
    console.error("Erro ao definir meta:", error);
    res.status(500).json({ message: "Erro ao definir meta." });
  }
};

const mongoose = require("mongoose");

const alimentoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  nome: {
    type: String,
    required: [true, "Nome do alimento é obrigatório"],
    trim: true,
  },
  carboidratos: {
    type: Number,
    required: [true, "Carboidratos é obrigatório"],
    min: 0,
  },
  proteinas: {
    type: Number,
    required: [true, "Proteínas é obrigatório"],
    min: 0,
  },
  gorduras: {
    type: Number,
    required: [true, "Gorduras é obrigatório"],
    min: 0,
  },
  calorias: {
    type: Number,
    default: 0,
  },
  data: {
    type: Date,
    default: Date.now,
  },
});

alimentoSchema.pre("save", function () {
  this.calorias =
    this.carboidratos * 4 + this.proteinas * 4 + this.gorduras * 9;
});

module.exports = mongoose.model("Alimento", alimentoSchema);

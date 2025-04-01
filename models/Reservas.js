const mongoose = require("mongoose");

const ReservaSchema = new mongoose.Schema({
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  profesor: { type: String, required: true },
  alumno: { type: String, required: false },
  clase: { type: String, required: true }
}, { timestamps: true });

const Reserva = mongoose.model("Reserva", ReservaSchema);

module.exports = Reserva;

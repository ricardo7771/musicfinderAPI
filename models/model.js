const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  correo: { type: String, required: true, unique: true }, 
  contraseña: { type: String, required: true }, 
  rol: { type: String, required: true },
  nombre: { type: String, required: true },
  fechaNacimiento: { type: Date },
}, {
  collection: 'usuarios',
  timestamps: true, 
});

module.exports = mongoose.model("Usuario", usuarioSchema);  

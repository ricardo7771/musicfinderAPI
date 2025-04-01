const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const ProfileSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4 },
  correo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  instrumento: { type: String, default: "Instrumento no especificado" },
  precio: { type: String, default: "$0/hora" },
  ubicacion: {
    latitud: { type: String, default: "" },
    longitud: { type: String, default: "" }
  },
  rating: { type: Number, default: 0 },
  imagen: { type: String, default: "assets/default_profile.jpg" },
  descripcion: { type: String, default: "Descripción no disponible" },
  rol: { type: String, required: true }
}, { timestamps: true });

const Profile = mongoose.model("Profile", ProfileSchema);

module.exports = Profile;

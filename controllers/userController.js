const express = require("express");
const router = express.Router();
const { Profile } = require("../models/Profile"); // Importa el modelo de Profile desde Mongoose

// Endpoint para obtener datos del usuario por ID
router.post("/getUser", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "El ID del usuario es requerido" });
  }

  try {
    const usuario = await Profile.findOne({ id });
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
});

module.exports = router;

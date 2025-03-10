const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

// Ruta del archivo JSON de usuarios
const usersFilePath = path.join(__dirname, "../data/profile.json");

// Función para leer los usuarios desde el JSON
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    const jsonData = JSON.parse(data);
    return jsonData.perfiles || [];  // Asegúrate de acceder a "perfiles" en lugar de "usuarios"
  } catch (error) {
    console.error("Error al leer el archivo de usuarios:", error);
    return [];
  }
};

// Endpoint para obtener datos del usuario por ID
router.post("/getUser", (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "El ID del usuario es requerido" });
  }

  const users = readUsers();
  const usuario = users.find((user) => user.id === id);

  if (!usuario) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.status(200).json(usuario);
});

module.exports = router;  // Corregido la exportación

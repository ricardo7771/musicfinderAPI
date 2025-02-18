const fs = require("fs");
const jwt = require("jsonwebtoken");

const usersFile = "data/users.json";

// Función para login
exports.login = (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
  }

  fs.readFile(usersFile, (err, data) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error al leer la base de datos" });
    }

    const usuarios = JSON.parse(data).usuarios;
    const usuario = usuarios.find((user) => user.correo === correo && user.contraseña === contraseña);

    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ correo: usuario.correo, rol: usuario.rol }, "secreto", { expiresIn: "1h" });

    res.json({ mensaje: "Inicio de sesión exitoso", token, rol: usuario.rol });
  });
};

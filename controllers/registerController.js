const fs = require("fs");

const usersFile = "data/users.json";

// Función para registrar un usuario
exports.register = (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  if (!nombre || !correo || !contraseña || !rol) {
    return res.status(400).json({ mensaje: "Todos los campos son necesarios" });
  }

  fs.readFile(usersFile, (err, data) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error al leer el archivo" });
    }
    const usuarios = JSON.parse(data).usuarios;
    const existingUser = usuarios.find((user) => user.correo === correo);
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const newUser = {
      nombre,
      correo,
      contraseña,
      rol,
    };

    usuarios.push(newUser);

    fs.writeFile(usersFile, JSON.stringify({ usuarios }, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ mensaje: "Error al guardar el nuevo usuario" });
      }

      res.status(201).json({ mensaje: "Usuario registrado exitosamente" });
    });
  });
};

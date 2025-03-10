const fs = require("fs");
const crypto = require("crypto");
const nodemailer = require("../config/nodemailerConfig");

const usersFile = "data/users.json";
const verificationCodes = {};  // Almacenará los códigos temporales

// Función para enviar código al correo
exports.enviarCodigo = (req, res) => {
  const { correo } = req.body;
  const users = JSON.parse(fs.readFileSync(usersFile, "utf8")).usuarios;
  const user = users.find((u) => u.correo === correo);

  if (!user) {
    return res.status(404).json({ error: "Correo no encontrado" });
  }

  const codigo = crypto.randomInt(100000, 999999).toString();
  verificationCodes[correo] = codigo;

  const mailOptions = {
    from: "musicfinderoficial@gmail.com",
    to: correo,
    subject: "Código de recuperación de contraseña",
    text: `Tu código de verificación es: ${codigo}`,
  };

  nodemailer.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al enviar el correo" });
    }
    res.json({ mensaje: "Código enviado correctamente" });
  });
};

// Función para cambiar la contraseña
exports.cambiarPassword = (req, res) => {
  const { correo, codigo, nuevaContraseña } = req.body;

  if (!verificationCodes[correo] || verificationCodes[correo] !== codigo) {
    return res.status(400).json({ error: "Código inválido o expirado" });
  }

  fs.readFile(usersFile, (err, data) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error al leer la base de datos" });
    }

    const usuarios = JSON.parse(data).usuarios;
    const usuario = usuarios.find((user) => user.correo === correo);

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    usuario.contraseña = nuevaContraseña;

    fs.writeFile(usersFile, JSON.stringify({ usuarios }, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ mensaje: "Error al actualizar la contraseña" });
      }

      delete verificationCodes[correo];  // Eliminar el código de verificación después de usarlo
      res.json({ mensaje: "Contraseña actualizada exitosamente" });
    });
  });
};

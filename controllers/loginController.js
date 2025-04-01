const User = require("../models/User");

// Controlador para manejar el login
const login = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  try {
    // Buscar usuario en la base de datos
    const usuario = await User.findOne({ correo });

    if (!usuario || usuario.contraseña !== contraseña) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    res.status(200).json({
      id: usuario.id,
      nombre: usuario.nombre,
      rol: usuario.rol,
      mensaje: "Inicio de sesión exitoso",
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = { login };

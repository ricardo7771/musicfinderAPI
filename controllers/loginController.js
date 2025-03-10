const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON de usuarios
const usersFilePath = path.join(__dirname, "../data/users.json");

// Función para leer los usuarios desde el JSON
const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFilePath, "utf8");
    const jsonData = JSON.parse(data);
    
    console.log("Usuarios cargados:", jsonData); // Verifica que los usuarios se estén leyendo correctamente

    return jsonData.usuarios || [];
  } catch (error) {
    console.error("Error al leer el archivo de usuarios:", error);
    return [];
  }
};

// Controlador para manejar el login
const login = (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  const users = readUsers();

  // Buscar usuario por correo y contraseña
  const usuario = users.find(
    (user) =>
      user.correo.trim().toLowerCase() === correo.trim().toLowerCase() &&
      user.contraseña === contraseña
  );

  if (!usuario) {
    return res.status(401).json({ error: "Credenciales incorrectas" });
  }

  res.status(200).json({
    id: usuario.id,
    nombre: usuario.nombre,
    rol: usuario.rol,
    mensaje: "Inicio de sesión exitoso",
  });
};

module.exports = { login };

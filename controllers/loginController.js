require("dotenv").config();
const jwt = require("jsonwebtoken");
const usersFile = require("../models/model") ;



// Función para login
exports.login = async (req, res) => {
  const { correo, contraseña } = req.body;

  if (!correo || !contraseña) {
    return res.status(400).json({ mensaje: "Correo y contraseña son obligatorios" });
  }
try {
  const usuario = await usersFile.findOne({correo});
  if(!usuario){
    return res.status(401).json({mensaje: "Credenciales incorrectas"})  }

    if(usuario.contraseña !== contraseña){
      return res.status(401).json({mensaje :" Credenciales incorrecta"})
    }


    const token = jwt.sign(
      { correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET, // Asegúrate de que tienes una variable de entorno JWT_SECRET definida
      { expiresIn: "1h" }
    );
    

res.json({ mensaje: "Inicio de sesión exitoso", token, rol: usuario.rol });
} catch (error) {
  res.status(500).json({ mensaje: "Error en el servidor", error });
}

};

require("dotenv").config();

const usersFile = require("../models/model");

// Función para registrar un usuario
exports.register = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  if (!nombre || !correo || !contraseña || !rol) {
    return res.status(400).json({ mensaje: "Todos los campos son necesarios" });
  }
 try {
const existingUser= await usersFile.findOne({correo});
if(existingUser){
  return res.status(400).json({mensaje: "El correo ya esta registrado, intenta con otro"})
}
  const newuser= new usersFile({nombre, correo, contraseña, rol});

  await newuser.save();

    res.status(201).json({mensaje: "Usuario registrado exitosamente"});
     }catch(error){

      res.status(500).json({mensaje: "Error de servidor", error});
     }
 
};

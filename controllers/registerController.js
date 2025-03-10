const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const usersFile = "data/users.json";
const profilesFile = "data/profile.json";  // Archivo para perfiles

// Función para registrar un usuario
exports.register = (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  if (!nombre || !correo || !contraseña || !rol) {
    return res.status(400).json({ mensaje: "Todos los campos son necesarios" });
  }

  fs.readFile(usersFile, (err, data) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error al leer el archivo de usuarios" });
    }
    const usuarios = JSON.parse(data).usuarios || [];
    const existingUser = usuarios.find((user) => user.correo === correo);
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const newUserId = uuidv4();  // Generar un ID único para el usuario

    const newUser = {
      id: newUserId,  // Asignar el mismo ID al usuario
      nombre,
      correo,
      contraseña,
      rol,
    };

    usuarios.push(newUser);

    // Crear un perfil por defecto para el nuevo usuario
    const newProfile = {
      id: newUserId,  // Asignar el mismo ID al perfil
      correo,
      nombre,
      instrumento: "Instrumento no especificado",  // Valor por defecto
      precio: "$0/hora",  // Valor por defecto
      ubicacion: "Ubicación no especificada",  // Valor por defecto
      rating: 0,  // Valor por defecto
      imagen: "assets/default_profile.jpg",  // Imagen por defecto
      descripcion: "Descripción no disponible",  // Descripción por defecto
      rol: "Profesor"

    };

    fs.readFile(profilesFile, (err, profileData) => {
      if (err) {
        return res.status(500).json({ mensaje: "Error al leer el archivo de perfiles" });
      }

      const perfiles = JSON.parse(profileData).perfiles || [];
      perfiles.push(newProfile);

      // Guardar el nuevo perfil en el archivo de perfiles
      fs.writeFile(profilesFile, JSON.stringify({ perfiles }, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ mensaje: "Error al guardar el perfil del nuevo usuario" });
        }

        // Guardar el nuevo usuario en el archivo de usuarios
        fs.writeFile(usersFile, JSON.stringify({ usuarios }, null, 2), (err) => {
          if (err) {
            return res.status(500).json({ mensaje: "Error al guardar el nuevo usuario" });
          }

          res.status(201).json({ mensaje: "Usuario y perfil registrados exitosamente" });
        });
      });
    });
  });
};

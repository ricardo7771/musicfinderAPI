const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = 'data/profile.json';  // Ruta al archivo JSON
const router = express.Router();
const app = express();
// Middleware para procesar JSON en el cuerpo de la solicitud
router.use(express.json());

// Función para leer el archivo JSON
const readProfiles = (callback) => {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) return callback(err);
    callback(null, JSON.parse(data));
  });
};

// Función para escribir en el archivo JSON
const writeProfiles = (profiles, callback) => {
  fs.writeFile(path, JSON.stringify(profiles, null, 2), (err) => {
    if (err) return callback(err);
    callback(null);
  });
};

// Ruta para obtener un perfil por ID
router.get('/getProfile/:id', (req, res) => {
  const userId = req.params.id;  // Obtener el ID del usuario desde los parámetros de la URL

  readProfiles((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }

    const perfiles = data.perfiles;
    
    // Buscar el perfil con el ID proporcionado
    const userProfile = perfiles.find(profile => profile.id === userId);
    
    if (!userProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver el perfil encontrado
    res.status(200).json(userProfile);
  });
});

// Ruta para editar un perfil por ID
router.put('/editProfile/:id', (req, res) => {
  const userId = req.params.id;
  const updatedProfile = req.body; // Los datos a actualizar deben enviarse en el cuerpo de la solicitud

  // Leer el archivo JSON
  readProfiles((err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error al leer el archivo' });
    }

    const perfiles = data.perfiles;
    
    // Buscar el perfil con el ID proporcionado
    const userIndex = perfiles.findIndex(profile => profile.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Obtener el perfil actual
    const currentProfile = perfiles[userIndex];

    // Filtrar los campos que no se pueden modificar
    const allowedFields = ['nombre', 'instrumento', 'precio', 'ubicacion', 'imagen', 'descripcion'];

    // Actualizar solo los campos permitidos, manteniendo los valores originales para los campos no permitidos
    for (const field in updatedProfile) {
      if (allowedFields.includes(field)) {
        currentProfile[field] = updatedProfile[field];  // Solo actualiza si el campo es permitido
      }
    }

    // Guardar los cambios en el archivo JSON
    writeProfiles({ perfiles }, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al guardar los cambios' });
      }

      res.status(200).json({ message: 'Perfil actualizado correctamente' });
    });
  });
});

// En profileController.js
exports.getProfileByEmail = (req, res) => {
  const { correo } = req.params; // Obtienes el correo del parámetro en la URL

  // Aquí iría tu lógica para buscar al profesor en tu base de datos o archivo
  // Por ejemplo:
  const profesor = findProfesorByCorreo(correo); // Suponiendo que tienes una función para eso

  if (profesor) {
    res.json(profesor);
  } else {
    res.status(404).json({ error: 'Profesor no encontrado' });
  }
};


module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const router = express.Router();
const app = express();

// Middleware para procesar JSON en el cuerpo de la solicitud
router.use(express.json());

// Ruta para obtener un perfil por ID
router.get('/getProfile/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await Profile.findOne({ id: userId });

    if (!profile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil', details: error });
  }
});

// Ruta para editar un perfil por ID
router.put('/editProfile/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;

    // Campos permitidos para actualizar
    const allowedFields = ['nombre', 'instrumento', 'precio', 'ubicacion', 'imagen', 'descripcion'];

    // Filtrar los datos actualizables
    const updateFields = {};
    Object.keys(updatedData).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateFields[key] = updatedData[key];
      }
    });

    const updatedProfile = await Profile.findOneAndUpdate({ id: userId }, updateFields, { new: true });

    if (!updatedProfile) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Perfil actualizado correctamente', profile: updatedProfile });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil', details: error });
  }
});

// Obtener perfil por correo
router.get('/getProfileByEmail/:correo', async (req, res) => {
  try {
    const { correo } = req.params;
    const profile = await Profile.findOne({ correo });

    if (!profile) {
      return res.status(404).json({ error: 'Profesor no encontrado' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar el perfil', details: error });
  }
});

module.exports = router;

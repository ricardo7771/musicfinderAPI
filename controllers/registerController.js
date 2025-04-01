const User = require("../models/User");
const Profile = require("../models/Profile");

exports.register = async (req, res) => {
  const { nombre, correo, contraseña, rol } = req.body;

  if (!nombre || !correo || !contraseña || !rol) {
    return res.status(400).json({ mensaje: "Todos los campos son necesarios" });
  }

  try {
    const existingUser = await User.findOne({ correo });
    if (existingUser) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const newUser = new User({ nombre, correo, contraseña, rol });
    await newUser.save();

    const newProfile = new Profile({
      id: newUser.id,
      correo,
      nombre,
      instrumento: "Instrumento no especificado",
      precio: "$0/hora",
      ubicacion: { latitud: "", longitud: "" },
      rating: 0,
      imagen: "assets/default_profile.jpg",
      descripcion: "Descripción no disponible",
      rol
    });
    await newProfile.save();

    res.status(201).json({ mensaje: "Usuario y perfil registrados exitosamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar el usuario", error });
  }
};

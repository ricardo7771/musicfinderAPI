const Profile = require("../models/Profile");  // Importamos el modelo de Profile

// Función para obtener todos los perfiles de profesores con los campos filtrados
const getProfessors = async (req, res) => {
  try {
    // Consulta a la base de datos para obtener los perfiles con rol "Profesor"
    const professors = await Profile.find({ rol: "Profesor" }).select(
      "id nombre instrumento precio ubicacion rating imagen descripcion"
    );

    if (professors.length > 0) {
      return res.status(200).json(professors);
    } else {
      return res.status(404).json({ error: "No se encontraron profesores." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener los perfiles de los profesores", error });
  }
};

module.exports = {
  getProfessors
};

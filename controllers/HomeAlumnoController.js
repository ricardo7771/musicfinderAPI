const fs = require("fs");
const path = require("path");

const profilePath = path.join(__dirname, "../data/profile.json");

// Función para obtener todos los perfiles de profesores con los campos filtrados
const getProfessors = (req, res) => {
  fs.readFile(profilePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error al leer el archivo de perfiles" });
    }

    try {
      const jsonData = JSON.parse(data);
      const perfiles = jsonData.perfiles || [];

      // Filtrar solo los perfiles con rol "Profesor"
      const profesores = perfiles.filter(p => p.rol === "Profesor");

      // Filtrar los datos para mostrar solo los campos requeridos
      const filteredProfessors = profesores.map(p => ({
        id:p.id,
        nombre: p.nombre,
        instrumento: p.instrumento,
        precio: p.precio,
        ubicacion: p.ubicacion,
        rating: p.rating,
        imagen: p.imagen,
        descripcion: p.descripcion 
      }));

      return res.status(200).json(filteredProfessors);
    } catch (parseError) {
      return res.status(500).json({ error: "Error al parsear el archivo JSON" });
    }
  });
};

module.exports = {
  getProfessors
};

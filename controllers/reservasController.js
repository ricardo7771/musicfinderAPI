const fs = require("fs");
const path = require("path");

const reservasFilePath = path.join(__dirname, "../data/reservas.json");

// Función para leer reservas desde el archivo JSON
const leerReservas = () => {
  try {
    const data = fs.readFileSync(reservasFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return []; // Si hay error (archivo no existe o está vacío), devolvemos un array vacío
  }
};

// Función para guardar reservas en el archivo JSON
const guardarReservas = (reservas) => {
  fs.writeFileSync(reservasFilePath, JSON.stringify(reservas, null, 2), "utf8");
};

// Obtener reservas por fecha
const getReservas = (req, res) => {
  const { fecha } = req.params;
  const reservas = leerReservas();

  const reservasFiltradas = reservas.filter((reserva) => reserva.fecha === fecha);

  if (reservasFiltradas.length > 0) {
    return res.status(200).json(reservasFiltradas);
  } else {
    return res.status(404).json({ message: "No se encontraron reservas para esta fecha." });
  }
};

// Crear una nueva reserva
const crearReserva = (req, res) => {
  const { fecha } = req.params;
  const { hora, profesor, alumno, clase } = req.body;

  if (!hora || !profesor || !clase) {
    return res.status(400).json({ message: "Faltan datos para crear la reserva." });
  }

  const reservas = leerReservas();
  const nuevaReserva = { fecha, hora, profesor, alumno, clase };
  reservas.push(nuevaReserva);

  guardarReservas(reservas);

  return res.status(201).json({ message: "Reserva creada correctamente", reserva: nuevaReserva });
};

// Actualizar una reserva
const actualizarReserva = (req, res) => {
  const { fecha, hora } = req.params;
  const { profesor, alumno, clase } = req.body;

  let reservas = leerReservas();
  const reservaIndex = reservas.findIndex((r) => r.fecha === fecha && r.hora === hora);

  if (reservaIndex === -1) {
    return res.status(404).json({ message: "Reserva no encontrada." });
  }

  reservas[reservaIndex] = { fecha, hora, profesor, alumno, clase };
  guardarReservas(reservas);

  return res.status(200).json({ message: "Reserva actualizada correctamente", reserva: reservas[reservaIndex] });
};

// Eliminar una reserva
const eliminarReserva = (req, res) => {
  const { fecha, hora } = req.params;

  let reservas = leerReservas();
  const reservaIndex = reservas.findIndex((r) => r.fecha === fecha && r.hora === hora);

  if (reservaIndex === -1) {
    return res.status(404).json({ message: "Reserva no encontrada." });
  }

  reservas.splice(reservaIndex, 1);
  guardarReservas(reservas);

  return res.status(200).json({ message: "Reserva eliminada correctamente" });
};

module.exports = {
  getReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
};

const Reserva = require("../models/Reservas"); // Importamos el modelo de reservas

// Obtener reservas por fecha
const getReservas = async (req, res) => {
  const { fecha } = req.params;
  
  try {
    const reservas = await Reserva.find({ fecha });
    return reservas.length > 0
      ? res.status(200).json(reservas)
      : res.status(404).json({ message: "No se encontraron reservas para esta fecha." });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las reservas.", error });
  }
};

// Crear una nueva reserva
const crearReserva = async (req, res) => {
  const { fecha } = req.params;
  const { hora, profesor, alumno, clase } = req.body;

  if (!hora || !profesor || !clase) {
    return res.status(400).json({ message: "Faltan datos para crear la reserva." });
  }

  try {
    const nuevaReserva = new Reserva({ fecha, hora, profesor, alumno, clase });
    await nuevaReserva.save();
    return res.status(201).json({ message: "Reserva creada correctamente", reserva: nuevaReserva });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear la reserva", error });
  }
};

// Actualizar una reserva
const actualizarReserva = async (req, res) => {
  const { fecha, hora } = req.params;
  const { profesor, alumno, clase } = req.body;

  try {
    const reserva = await Reserva.findOneAndUpdate(
      { fecha, hora },
      { profesor, alumno, clase },
      { new: true }
    );
    return reserva
      ? res.status(200).json({ message: "Reserva actualizada correctamente", reserva })
      : res.status(404).json({ message: "Reserva no encontrada." });
  } catch (error) {
    return res.status(500).json({ message: "Error al actualizar la reserva", error });
  }
};

// Eliminar una reserva
const eliminarReserva = async (req, res) => {
  const { fecha, hora } = req.params;

  try {
    const reserva = await Reserva.findOneAndDelete({ fecha, hora });
    return reserva
      ? res.status(200).json({ message: "Reserva eliminada correctamente" })
      : res.status(404).json({ message: "Reserva no encontrada." });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar la reserva", error });
  }
};

// Obtener reservas por profesor
const getReservasPorProfesor = async (req, res) => {
  const { profesorId } = req.params;

  try {
    const reservasProfesor = await Reserva.find({ profesor: profesorId });
    return reservasProfesor.length > 0
      ? res.status(200).json(reservasProfesor)
      : res.status(404).json({ message: "No tienes alumnos con reservas." });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener las reservas del profesor", error });
  }
};

module.exports = {
  getReservas,
  crearReserva,
  actualizarReserva,
  eliminarReserva,
  getReservasPorProfesor,
};
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require('os');  // Módulo para obtener la IP local
// Importación de controladores
const HomeAlumnoController = require("./controllers/HomeAlumnoController");
const userController = require("./controllers/userController");
const profileController = require("./controllers/profileController");
const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const passwordController = require("./controllers/passwordController");
const reservasController = require("./controllers/reservasController"); // Controlador de reservas

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para procesar las solicitudes JSON
app.use(bodyParser.json());
app.use(cors({
  origin: "*", // Permite cualquier origen
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));


// Rutas para login
app.post("/login", loginController.login);
app.post("/register", registerController.register);

// Rutas para Cambiar Contraseña
app.post("/enviar-codigo", passwordController.enviarCodigo);
app.post("/cambiar-password", passwordController.cambiarPassword);

// Rutas del perfil
app.post("/getUser", userController);

// Integración del controlador de perfil
app.use('/api/profiles', profileController); // Todas las rutas del controlador serán prefijadas con '/api/profiles'

// Rutas de reservas
app.get("/professors", HomeAlumnoController.getProfessors);
app.get("/reservas/:fecha", reservasController.getReservas); // Obtener reservas por fecha
app.post("/reservas/:fecha", reservasController.crearReserva); // Crear una nueva reserva
app.put("/reservas/:fecha/:hora", reservasController.actualizarReserva); // Actualizar una reserva
app.delete("/reservas/:fecha/:hora", reservasController.eliminarReserva); // Eliminar una reserva


// Obtener la dirección IP local
const getLocalIP = () => {
  const networkInterfaces = os.networkInterfaces();
  let localIP = 'localhost';  // Por defecto si no encuentra una IP
  for (const interfaceName in networkInterfaces) {
      for (const net of networkInterfaces[interfaceName]) {
          if (net.family === 'IPv4' && !net.internal) {
              localIP = net.address;
              break;
          }
      }
  }
  return localIP;
};

// Iniciar el servidor y mostrar la IP local
const localIP = getLocalIP();
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor corriendo en http://${localIP}:${PORT}`);
});

console.log(reservasController); // Verifica si el controlador de reservas está importado correctamente
  
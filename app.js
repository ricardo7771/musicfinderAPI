const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require('os');
const http = require("http");  // Necesario para usar Socket.io
const { Server } = require("socket.io"); // Importar Socket.io

// Importación de controladores
const HomeAlumnoController = require("./controllers/HomeAlumnoController");
const userController = require("./controllers/userController");
const profileController = require("./controllers/profileController");
const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const passwordController = require("./controllers/passwordController");
const reservasController = require("./controllers/reservasController");

const app = express();
const server = http.createServer(app);  // Crear un servidor HTTP
const io = new Server(server, { cors: { origin: "*" } }); // Configurar Socket.io

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

// Rutas existentes
app.post("/login", loginController.login);
app.post("/register", registerController.register);
app.post("/enviar-codigo", passwordController.enviarCodigo);
app.post("/cambiar-password", passwordController.cambiarPassword);
app.post("/getUser", userController);
app.use('/api/profiles', profileController);
app.get("/professors", HomeAlumnoController.getProfessors);
app.get("/reservas/:fecha", reservasController.getReservas);
app.post("/reservas/:fecha", reservasController.crearReserva);
app.put("/reservas/:fecha/:hora", reservasController.actualizarReserva);
app.delete("/reservas/:fecha/:hora", reservasController.eliminarReserva);

// 💬 **Chatbot en tiempo real con Socket.io**
io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("message", (message) => {
        console.log("Mensaje recibido:", message);

        let botResponse = "No entendí tu pregunta.";
        if (message.includes("reservar")) {
            botResponse = "Para reservar una clase, ve a la sección de reservas.";
        } else if (message.includes("precio")) {
            botResponse = "Los precios varían según el profesor. Puedes verlos en sus perfiles.";
        } else if (message.includes("horario")) {
            botResponse = "Consulta los horarios disponibles en la plataforma.";
        }

        socket.emit("response", botResponse); // Responder al usuario
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
});

// Obtener la IP local
const getLocalIP = () => {
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';
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

// Iniciar el servidor con Express + Socket.io
const localIP = getLocalIP();
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://${localIP}:${PORT}`);
});

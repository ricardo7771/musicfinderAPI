const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require('os');
const http = require("http");  // Necesario para usar Socket.io
const { Server } = require("socket.io"); // Importar Socket.io
const fs = require("fs");
const path = require("path");

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
app.get("/reservas/profesor/:profesorId",reservasController.getReservasPorProfesor);


// Ruta del archivo de historial
const historyFilePath = path.join(__dirname, "./data/chatHistory.json");

// Función para leer el historial de chat
const loadChatHistory = () => {
    try {
        const data = fs.readFileSync(historyFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];  // Si hay un error (ej. el archivo no existe), retorna un array vacío
    }
};

// Función para guardar el historial de chat
const saveChatHistory = (history) => {
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), "utf8");
};

// Cargar historial al iniciar el servidor
let chatHistory = loadChatHistory();

io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    // Enviar historial de chat al nuevo usuario
    socket.emit("chatHistory", chatHistory);

    socket.on("sendMessage", ({ profesorId, alumnoId, message, sender }) => {
        const userType = sender === "profesor" ? "👨‍🏫 Profesor" : "🎓 Alumno";
        const newMessage = { user: userType, profesorId, alumnoId, message, timestamp: new Date().toISOString() };

        // Agregar mensaje al historial y guardar
        chatHistory.push(newMessage);
        saveChatHistory(chatHistory);

        io.emit("message", newMessage);
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
});
// Obtener la IP local
const getLocalIP = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const net of networkInterfaces[interfaceName]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return "localhost";
};

// Iniciar el servidor con Express + Socket.io
const localIP = getLocalIP();
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://${localIP}:${PORT}`);
});

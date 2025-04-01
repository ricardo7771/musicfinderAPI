const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const os = require('os');
const http = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const path = require("path");
require("dotenv").config(); // Cargar variables de entorno

// Importación de controladores
const HomeAlumnoController = require("./controllers/HomeAlumnoController");
const userController = require("./controllers/userController");
const profileController = require("./controllers/profileController");
const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const passwordController = require("./controllers/passwordController");
const reservasController = require("./controllers/reservasController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Conectar a MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Conectado a MongoDB Atlas"))
.catch(err => console.error("Error conectando a MongoDB:", err));

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
app.get("/reservas/profesor/:profesorId", reservasController.getReservasPorProfesor);

// Ruta del archivo de historial
const historyFilePath = path.join(__dirname, "./data/chatHistory.json");

// Función para leer el historial de chat
const loadChatHistory = () => {
    try {
        const data = fs.readFileSync(historyFilePath, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
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
    socket.emit("chatHistory", chatHistory);

    socket.on("sendMessage", ({ profesorId, alumnoId, message, sender }) => {
        const userType = sender === "profesor" ? "👨‍🏫 Profesor" : "🎓 Alumno";
        const newMessage = { user: userType, profesorId, alumnoId, message, timestamp: new Date().toISOString() };
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

const localIP = getLocalIP();
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en http://${localIP}:${PORT}`);
});

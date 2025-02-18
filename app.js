const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const reservasRoutes =require ("./routes/reservasRoutes")

const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const passwordController = require("./controllers/passwordController");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// Rutas para login, registro, etc.
app.post("/login", loginController.login);
app.post("/register", registerController.register);
app.post("/enviar-codigo", passwordController.enviarCodigo);
app.post("/cambiar-password", passwordController.cambiarPassword);
app.use("/reservas", reservasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

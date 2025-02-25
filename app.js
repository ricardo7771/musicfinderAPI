require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const reservasRoutes = require("./routes/reservasRoutes");
const loginController = require("./controllers/loginController");
const registerController = require("./controllers/registerController");
const passwordController = require("./controllers/passwordController");

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => console.error("❌ Error de conexión MongoDB:", err));


app.use(express.json()); 
app.use(cors());


app.post("/login", loginController.login);
app.post("/register", registerController.register);
app.post("/enviar-codigo", passwordController.enviarCodigo);
app.post("/cambiar-password", passwordController.cambiarPassword);
app.use("/reservas", reservasRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

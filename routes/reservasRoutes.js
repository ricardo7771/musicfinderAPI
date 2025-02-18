const express =require("express");
const router = express.Router();
const reservasController= require("../controllers/reservasController");


router.post("/",reservasController.crearReserva);
router.get("/",reservasController.obtenerReserva);
router.put("/cancelar/:id",reservasController.cancelarReserva);

module.exports= router;
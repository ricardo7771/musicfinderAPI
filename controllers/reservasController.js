const fs = require("fs");
const FILE_PATH ="./data/reservas.json"

const leerReservas=()=> {

try{
    const data= fs.readFileSync(FILE_PATH,"utf-8");
    return JSON.parse(data);

}catch(error){
    console.error("Error leyendo Reservas",error);
    return[];
}
};

const escribirReservas=(reservas)=>{
    fs.writeFileSync(FILE_PATH,JSON.stringify(reservas,null,4));

};
const crearReserva = (req, res) => {
    
    const { profesor_id, estudiante_id, fecha, hora, lugar } = req.body;
    const reservas = leerReservas();
    const nuevaReserva = {
        id: reservas.length + 1, // ID único basado en la hora
        profesor_id,
        estudiante_id,
        fecha,
        hora,
        lugar,
        estado: "pendiente"
    };

    
    reservas.push(nuevaReserva);
    escribirReservas(reservas);  // Esta función escribe las reservas al archivo JSON

    res.json({ message: "Reserva creada", reserva: nuevaReserva });
};

const obtenerReserva=(req,res)=>{
    const reservas=leerReservas();
console.log("Reservas cargadas", reservas);
res.json(reservas);
};
const cancelarReserva=(req,res)=>{
    const reservas=leerReservas();
    const reserva= reservas.find((r)=>r.id==req.params.id);

    if(!reserva){
        return res.status(404).json({message:"Reserva no encontrada"});

    }

    reserva.estado="cancelada"
    escribirReservas(reservas);
    res.json({message:"Reserva caancelada", reserva});
};
module.exports = {
    crearReserva,
    obtenerReserva,
    cancelarReserva
  };
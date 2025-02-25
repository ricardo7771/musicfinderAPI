// models/UsuarioModel.js

import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
    correo: { type: String, required: true, unique: true }, // Email único
    contraseña: { type: String, required: true }, // Almacenar contraseñas de forma segura (hashed)
    rol:{type: String, required: true},
    nombre: { type: String, required: true },
    fechaNacimiento: { type: Date },
    movil: { type: String },
    genero: { type: String },
    ocupacion: { type: String },
    tipoIdentificacion: { type: String },
    numeroIdentificacion: { type: String },
    tipoDireccion: { type: String },
    nacionalidad: { type: String },
    estado: { type: String },
    ciudad: { type: String },
    distrito: { type: String },
    numeroBloque: { type: String },
}, {
    collection: 'usuarios',
    timestamps: true, // Añade campos createdAt y updatedAt
});

const UsuarioModel = mongoose.model('Usuario', usuarioSchema);

export default UsuarioModel;

// Modelo de mongoose encargado de poner ciertas restricciones a que mi
// bd o que cada registro de usuarios luzca de la manera como yo quiero.

const { Schema, model} = require('mongoose');

// Creacion de un Schema de mongoose
const UsuarioSchema = Schema({

    nombre: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    img: {
        type: String
    },

    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    },

    google: {
        type: Boolean,
        default: false
    },
});

// Para extraer la version, el id y el password del UsuarioSchema
UsuarioSchema.method('toJSON', function () {
    const { __v, _id, password, ...object } = this.toObject();

    // para renombrar el _id a uid
    object.uid = _id;
    return object;
})

// Para implementar el modelo de la definicion del schema
module.exports = model( 'Usuario', UsuarioSchema );
// Modelo de mongoose encargado de poner ciertas restricciones a que mi
// bd o que cada registro de hospitales luzca de la manera como yo quiero.

const { Schema, model} = require('mongoose');

// Creacion de un Schema de mongoose
const HospitalSchema = Schema({

    nombre: {
        type: String,
        required: true
    },
    
    img: {
        type: String
    },

    usuario: {
        // Con esto le indicamos a mongoose que va a haber una relacion entre este schema y el de usuarios,
        // para saber que usuario fue el que creo este hospital
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        // Para evitar que ningun hospital se grabe sin el usuario.
        required: true,
    } 
}, { collection: 'hospitales' });

// Para extraer la version del HospitalSchema
HospitalSchema.method('toJSON', function () {
    const { __v, ...object } = this.toObject();
    return object;
})

// Para implementar el modelo de la definicion del schema
module.exports = model( 'Hospital', HospitalSchema );
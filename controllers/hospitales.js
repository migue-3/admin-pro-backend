const { response } = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    const hospitales = await Hospital.find()
                                     .populate('usuario', 'nombre img')

    res.json({
        ok: true,
        hospitales
    })
}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    const hospital = new Hospital({
        usuario: uid,
        ...req.body
    });

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.. error inesperado'
        })
    }
}

const actualizarHospital = async (req, res = response) => {

    const hospitalId = req.params.id;
    const uid = req.uid;

    try {    

        // Primero verificamos a ver si existe un hospital con ese id
        const hospitalDB = await Hospital.findById( hospitalId );

        if ( !hospitalDB ) {
            return    res.status(404).json({
                ok: true,
                msg: 'No existe un hospital con ese id',
            });
        }

        // Le establecemos el nuevo nombre al hospital que viene en el body de la peticion
        const cambiosHospital = {
            ...req.body,
            // con esto tenemos el ultimo usuario que hizo la modificacion
            usuario: uid
        }

        // finalmente guardamos los cambios actualizados en la BD
        const hospitalActualizado = await Hospital.findByIdAndUpdate( hospitalId, cambiosHospital, { new: true } );

        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const borrarHospital = async (req, res = response) => {
    
    const hospitalId = req.params.id;

    try {
        

        // Primero verificamos a ver si existe un hospital con ese id
        const hospitalDB = await Hospital.findById( hospitalId );

        if ( !hospitalDB ) {
            return    res.status(404).json({
                ok: true,
                msg: 'No existe un hospital con ese id',
            });
        }

        await Hospital.findByIdAndDelete( hospitalId );

        res.json({
            ok: true,
            msg: 'Hospital Borrado'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospital,
    borrarHospital
}
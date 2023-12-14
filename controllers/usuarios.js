const { response } = require('express');
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuarios')
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async(req, res) => {
    
    // Para traernos todos los usuarios que esten grabados en la BD
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: true,
        usuarios,
        // esto es lo que yo configure en mi middleware para compartir informacion en las peticiones
        uid: req.uid
    });

}

const crearUsuarios = async(req, res = response) => {

    const { email, password, nombre } = req.body;

    try {
        // Para validar si el usuario ya existe en la BD
        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body);

        // Encriptar contraseña antes de guardar en la BD
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        
        // Para grabarlo/guardar en la BD
        await usuario.save();
        
        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false, 
            msg: 'Error inesperado... revisar logs'
        });
    }
}

const actualizarUsuario = async (req, res = response) => {
    // TODO: validar token y comprobar si es el usuario correcto
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        // Actualizaciones a la instancia del usuarioDB
        const campos = req.body;

        if (usuarioDB.email ===  req.body.email) {
            //Borramos los campos que no queremos actualizar
            delete campos.email;
        } else {
            const existeEmail = await Usuario.findOne({ email: req.body.email });
            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        //Borramos los campos que no queremos actualizar
        delete campos.password;
        delete campos.google;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }

}

const borrarUsuario = async (req, res = response) => {
    
    const uid = req.params.id;

    try {    

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario por ese id'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.json({
            ok: true,
            msg: 'Usuario elmiminado'
        });

    } catch (error) {
        
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado, contacte con el administrador'
        })
    }
}

module.exports = {
    getUsuarios,
    crearUsuarios,
    actualizarUsuario,
    borrarUsuario
}
const { response } = require('express');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res = response, next) => {

    // Leer el Token que viene en el header de la req
    const token = req.header('x-token');
    
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {
        
        // PARA VERIFICAR QUE EL TOKEN SEA CORRECTO
        const { uid } = jwt.verify( token, process.env.JWT_SECRET );
        req.uid = uid
        // next() es la funcion que tenemos que llamar si todo sale correctamente
        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }
}

module.exports = {
    validarJWT
}
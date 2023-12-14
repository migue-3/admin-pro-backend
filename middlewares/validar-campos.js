const { response } = require('express')
const { validationResult } = require('express-validator')

const validarCampos = ( req, res = response, next ) => {
    
    const errores = validationResult( req );
    if ( !errores.isEmpty() ) {
        return res.status(400).json({
            ok: false,
            errors: errores.mapped()
        });
    }
    // Si llega a este punto quiere decir que no hay errores por lo cual podemos llamar al next
    next();
}

module.exports = {
    validarCampos
}
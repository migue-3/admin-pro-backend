const jwt = require('jsonwebtoken');


const generarJWT = ( uid, nombre ) => {

    // Transformamos la funcion generarJWT en una promesa para poder usar el resolve y reject de una manera facil
    // y luego poder usar async y await cuando se llame la funcion
    return new Promise( ( resolve, reject ) => {
        
        const payload = {
            uid,
            nombre
        };
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, ( err, token ) => {
    
            if( err ) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
        });
    });
} 

module.exports = {
    generarJWT,
}
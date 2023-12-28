/*
    Ruta: '/api/hospitales'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const  { getHospitales, crearHospital, actualizarHospital, borrarHospital } = require('../controllers/hospitales');

router.get( '/', getHospitales );

// Como segundo parametro podemos especificar los middleware entre ([] si es mas de uno) que queremos usar
router.post( '/',
     [
          validarJWT,
          check('nombre','El nombre del hospital es obligatorio').not().isEmpty(),
          validarCampos
     ], 
     crearHospital 
);

router.put( '/:id',
     [ 
          validarJWT,
          check('nombre','El nombre del hospital es obligatorio').not().isEmpty(),
          validarCampos
     ], 
     actualizarHospital
);

router.delete( '/:id',
     validarJWT,
     borrarHospital
)


module.exports = router;
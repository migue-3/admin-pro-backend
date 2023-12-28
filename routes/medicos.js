/*
    Ruta: '/api/medicos'
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const router = Router();

const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos') 

router.get( '/', getMedicos );

// Como segundo parametro podemos especificar los middleware entre ([] si es mas de uno) que queremos usar
router.post( '/',
     [
          validarJWT,
          check('nombre','El nombre del medico es obligatorio').not().isEmpty(),
          check('hospital','El id del hospital tiene que ser un ID generado por mongoose').isMongoId(),
          validarCampos
     ], 
     crearMedico 
);

router.put( '/:id',
     [ 
          validarJWT,
          check('nombre','El nombre del medico es obligatorio').not().isEmpty(),
          check('hospital','El id del hospital tiene que ser un ID generado por mongoose').isMongoId(),
          validarCampos
     ], 
     actualizarMedico
);

router.delete( '/:id',
     validarJWT,
     borrarMedico
)


module.exports = router;
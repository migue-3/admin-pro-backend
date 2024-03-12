/*
    Ruta: /api/usuarios
*/

const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();
const {
  getUsuarios,
  crearUsuarios,
  actualizarUsuario,
  borrarUsuario,
} = require("../controllers/usuarios");
const {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
} = require("../middlewares/validar-jwt");

router.get("/", validarJWT, getUsuarios);

// Como segundo parametro podemos especificar los middleware entre ([] si es mas de uno) que queremos usar
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    // llamamos el middleware validarCampos despues de los checks ya que si lo llamamos antes aun no se han construido los errores
    validarCampos,
  ],
  crearUsuarios
);

router.put(
  "/:id",
  [
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  actualizarUsuario
);

router.delete("/:id", validarJWT, borrarUsuario);

module.exports = router;

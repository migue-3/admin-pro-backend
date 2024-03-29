const { response } = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuarios");

const validarJWT = (req, res = response, next) => {
  // Leer el Token que viene en el header de la req
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la petición",
    });
  }

  try {
    // PARA VERIFICAR QUE EL TOKEN SEA CORRECTO
    const { uid } = jwt.verify(token, process.env.JWT_SECRET);
    req.uid = uid;
    // next() es la funcion que tenemos que llamar si todo sale correctamente
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }
};

const validarADMIN_ROLE = async (req, res = response, next) => {
  const uid = req.uid;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (usuarioDB.role !== "ADMIN_ROLE") {
      return res.status(403).json({
        ok: false,
        msg: "No tiene permisos de administrador",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const validarADMIN_ROLE_o_MismoUsuario = async (req, res = response, next) => {
  const uid = req.uid;

  //ID QUE QUIERO MODIFICAR LO SACO DE LA 'REQ.PARAMS'
  const id = req.params.id;
  try {
    const usuarioDB = await Usuario.findById(uid);

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Usuario no existe",
      });
    }

    if (usuarioDB.role !== "ADMIN_ROLE" && uid !== id) {
      return res.status(403).json({
        ok: false,
        msg: "No tiene permisos de administrador",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  validarJWT,
  validarADMIN_ROLE,
  validarADMIN_ROLE_o_MismoUsuario,
};

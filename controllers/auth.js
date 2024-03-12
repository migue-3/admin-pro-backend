const { response } = require("express");
const bcrypt = require("bcryptjs");

const Usuario = require("../models/usuarios");
const { generarJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");
const { getMenuFrontEnd } = require("../helpers/menu-frontend");

const login = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    // Verificar email
    const usuarioDB = await Usuario.findOne({ email });

    if (!usuarioDB) {
      return res.status(404).json({
        ok: false,
        msg: "Email no encontrado",
      });
    }

    // Verificar contraseña
    const validPassword = bcrypt.compareSync(password, usuarioDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Contraseña no es válida",
      });
    }

    // Generar el TOKEN - JWT
    const token = await generarJWT(usuarioDB.id);

    res.json({
      ok: true,
      token,
      menu: getMenuFrontEnd(usuarioDB.role),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error inesperado, contacte con el administrador",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  try {
    const { email, name, picture } = await googleVerify(req.body.token);

    // Verificacion del email del usuario de google contra los usuarios creados en la BD
    const usuarioDB = await Usuario.findOne({ email });
    let usuario;

    if (!usuarioDB) {
      usuario = new Usuario({
        nombre: name,
        email,
        password: "123",
        img: picture,
        google: true,
      });
    } else {
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Para grabar finalmente al usuario en la BD
    await usuario.save();

    //Generar el token - JWT
    const token = await generarJWT(usuario.id);

    res.json({
      ok: true,
      email,
      name,
      picture,
      token,
      menu: getMenuFrontEnd(usuario.role),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: true,
      msg: "Token de Google no es correcto",
    });
  }
};

const renewToken = async (req, res = response) => {
  // Tomamos el uid del usuario que viene en la req.uid
  const uid = req.uid;

  // Obtener el usuario por UID
  const usuarioDB = await Usuario.findById(uid);

  //Generar el token - JWT
  const token = await generarJWT(uid);

  res.json({
    ok: true,
    token,
    usuarioDB,
    menu: getMenuFrontEnd(usuarioDB.role),
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};

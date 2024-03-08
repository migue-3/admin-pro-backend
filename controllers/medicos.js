const { response } = require("express");
const Medico = require("../models/medico");

const getMedicos = async (req, res = response) => {
  const medicos = await Medico.find()
    .populate("usuario", "nombre img")
    .populate("hospital", "nombre img");
  res.json({
    ok: true,
    medicos,
  });
};

const getMedicosById = async (req, res = response) => {
  const medicoId = req.params.id;

  try {
    const medico = await Medico.findById(medicoId)
      .populate("usuario", "nombre img")
      .populate("hospital", "nombre img");
    res.json({
      ok: true,
      medico,
    });
  } catch (error) {
    console.log(error);
    res.json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const crearMedico = async (req, res = response) => {
  const uid = req.uid;
  const medico = new Medico({
    usuario: uid,
    ...req.body,
  });

  try {
    const medicoDB = await medico.save();

    res.json({
      ok: true,
      medico: medicoDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador.. error inesperado",
    });
  }
};

const actualizarMedico = async (req, res = response) => {
  const medicoId = req.params.id;
  const uid = req.uid;

  try {
    // Primero verificamos a ver si existe un medico con ese id
    const medicoDB = await Medico.findById(medicoId);

    if (!medicoDB) {
      return res.status(404).json({
        ok: true,
        msg: "No existe un medico con ese id",
      });
    }

    // Le establecemos el nuevo nombre al hospital que viene en el body de la peticion
    const cambiosMedico = {
      ...req.body,
      // con esto tenemos el ultimo usuario que hizo la modificacion
      usuario: uid,
    };

    // finalmente guardamos los cambios actualizados en la BD
    const medicoActualizado = await Medico.findByIdAndUpdate(
      medicoId,
      cambiosMedico,
      { new: true }
    );

    res.json({
      ok: true,
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const borrarMedico = async (req, res = response) => {
  const medicoId = req.params.id;

  try {
    // Primero verificamos a ver si existe un hospital con ese id
    const medicoDB = await Medico.findById(medicoId);

    if (!medicoDB) {
      return res.status(404).json({
        ok: true,
        msg: "No existe un hospital con ese id",
      });
    }

    await Medico.findByIdAndDelete(medicoId);

    res.json({
      ok: true,
      msg: "Medico Borrado",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  getMedicos,
  crearMedico,
  actualizarMedico,
  borrarMedico,
  getMedicosById,
};

const fs = require("fs");

const Usuario = require("../models/usuarios");
const Medico = require("../models/medico");
const Hospital = require("../models/hospital");

const borrarImg = (path) => {
  if (fs.existsSync(path)) {
    // Borramos la imagen anterior
    fs.unlinkSync(path);
  }
};

const actualizarImagen = async (tipo, id, nombreArchivo) => {
  switch (tipo) {
    case "medicos": 
    {
      const medico = await Medico.findById(id);
      if (!medico) {
        console.log("No se encontro un medico por ese id");
        return false;
      }

      // Evaluamos si ese medico tiene una imagen ya pre-asignada Y SI LA TIENE TENGO QUE BORRARLA
      const pathViejo = `./uploads/medicos/${medico.img}`;
      borrarImg(pathViejo);

      medico.img = nombreArchivo;
      await medico.save();
      return true;

      break;
    }

    case "hospitales": 
    {
      const hospital = await Hospital.findById(id);
      if (!hospital) {
        console.log("No se encontro un hospital por ese id");
        return false;
      }

      // Evaluamos si ese hospital tiene una imagen ya pre-asignada Y SI LA TIENE TENGO QUE BORRARLA
      const pathViejo = `./uploads/hospitales/${hospital.img}`;
      borrarImg(pathViejo);

      hospital.img = nombreArchivo;
      await hospital.save();
      return true;

      break;
    }

    case "usuarios":
      {
        const usuario = await Usuario.findById(id);
        if (!usuario) {
          console.log("No se encontro un usuario por ese id");
          return false;
        }

        // Evaluamos si ese usuario tiene una imagen ya pre-asignada Y SI LA TIENE TENGO QUE BORRARLA
        const pathViejo = `./uploads/usuarios/${usuario.img}`;
        borrarImg(pathViejo);

        usuario.img = nombreArchivo;
        await usuario.save();
        return true;

        break;
      }
  }
};

module.exports = {
  actualizarImagen,
};

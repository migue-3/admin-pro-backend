//Vamos a mostrar al usuario las opciones del menu basandonos en el tipo de ROLE que tenga
const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "*Dashboard*",
      icono: "mdi mdi-gauge",
      submenu: [
        { titulo: "Main", url: "/" },
        { titulo: "Progress", url: "progress" },
        { titulo: "Graficas", url: "grafica1" },
        { titulo: "Promesas", url: "promesas" },
        { titulo: "Rxjs", url: "rxjs" },
      ],
    },

    {
      titulo: "*Mantenimientos*",
      icono: "mdi mdi-folder-lock-open",
      submenu: [
        // { titulo: "Usuarios", url: "usuarios" },
        { titulo: "Hospitales", url: "hospitales" },
        { titulo: "Médicos", url: "medicos" },
      ],
    },
  ];

  if (role === "ADMIN_ROLE") {
    //Como el menu es un arreglo podemos hacer referencia al segundo elemento del menu
    //entonces con el unshift le añadimos la opcion que queremos mostrar para los usuarios
    //con el rol de ADMIN_ROLE
    menu[1].submenu.unshift({ titulo: "Usuarios", url: "usuarios" });
  }

  return menu;
};

module.exports = {
  getMenuFrontEnd,
};

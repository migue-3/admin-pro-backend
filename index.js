    // Punto inicial de mi aplicacion //

    require('dotenv').config();
    
    const express = require('express');
    const cors = require('cors');

    const { dbConnection } = require('./database/config');

    // Crear el servidor de express
    const app = express();

    // Configurar CORS
    app.use(cors());

    // Lectura y parseo del body "Debe ir antes de las rutas"
    app.use( express.json() );


    // Base de datos
    dbConnection();

    // console.log(process.env)

    // miguelgervis1 sf90fwuU7KFrB1Mp

    // Rutas
    app.use('/api/usuarios', require('./routes/usuarios') );   
    app.use('/api/login', require('./routes/auth') );
    

    // Para levantarlo
    app.listen( process.env.PORT, () => {
        console.log('Servidor corriendo en el puerto' + process.env.PORT );
    })
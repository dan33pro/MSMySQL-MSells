const express = require('express');
const bodyParser = require('body-parser');

const swaggerUi = require('swagger-ui-express');

const config = require('../../config');
const router = require('./network');

const app = express();

app.use(bodyParser.json());

// ROUTER
const swaggerDoc = require('./swagger.json');

// RUTAS
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/', router);

app.listen(config.mysqlService.port, () => {
    console.log('Servicio de mysql escuchando en el puerto: ', config.mysqlService.port);
});
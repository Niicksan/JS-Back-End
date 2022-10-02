const env = process.env.NODE_ENV || 'development';

const express = require('express');
const config = require('./config/config')[env];
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');

async function start() {
    const app = express();

    await databaseConfig(app);
    expressConfig(app);
    routesConfig(app);

    app.listen(config.port, console.log(`Server is listening on port ${config.port}! Now its up to you...`));
}

start();
// Require Controllers
const homeController = require('../controllers/homeController');
const cubeController = require('../controllers/cubeController');
const accessoryController = require('../controllers/accessoryController');
const aboutController = require('../controllers/aboutController');
const defaultController = require('../controllers/defaultController');

module.exports = (app) => {
    // Routes
    app.use(homeController);
    app.use('/cube/', cubeController);
    app.use('/accessory', accessoryController);
    app.use('/about', aboutController);
    // TODO attach other controllers

    app.all('*', defaultController);
};
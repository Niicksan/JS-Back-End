// Require Controllers
const homeController = require('../controllers/homeController');
const createController = require('../controllers/createController');
const detailsController = require('../controllers/detailsController');
const accessoryController = require('../controllers/accessoryController');
const aboutController = require('../controllers/aboutController');
const defaultController = require('../controllers/defaultController');

module.exports = (app) => {
    // Routes
    app.use(homeController);
    app.use('/cube/', createController);
    app.use('/details', detailsController);
    app.use('/accessory/', accessoryController);
    app.use('/about', aboutController);
    // TODO attach other controllers

    app.all('*', defaultController);
};
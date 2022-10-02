// Require Controllers
const homeController = require('../controllers/homeController');
const aboutController = require('../controllers/aboutController');
const createController = require('../controllers/createController');
const detailsController = require('../controllers/detailsController');
const defaultController = require('../controllers/defaultController');

module.exports = (app) => {
    // Routes
    app.use(homeController);
    app.use('/about', aboutController);
    app.use('/create', createController);
    app.use('/details', detailsController);
    // TODO attach other controllers

    app.all('*', defaultController);
};
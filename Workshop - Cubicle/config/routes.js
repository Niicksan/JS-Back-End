// Require Controllers
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const cubeController = require('../controllers/cubeController');
const accessoryController = require('../controllers/accessoryController');
const aboutController = require('../controllers/aboutController');
const defaultController = require('../controllers/defaultController');
const { hasUser, isGuest } = require('../middlewares/guards');


module.exports = (app) => {
    // Routes
    app.use(homeController);
    app.use('/auth', isGuest(), authController);
    app.use('/cube', hasUser(), cubeController);
    app.use('/accessory', hasUser(), accessoryController);
    app.use('/about', aboutController);
    // TODO attach other controllers

    app.all('*', defaultController);
};
const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');


module.exports = (app) => {
    // Routes
    app.use('/', homeController);
    app.use('/auth', authController);
};
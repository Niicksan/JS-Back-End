const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const blogController = require('../controllers/blogController');
const profileController = require('../controllers/profileController');
const defaultController = require('../controllers/defaultController');


module.exports = (app) => {
    // Routes
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/blog', blogController)
    app.use('/profile', profileController);

    app.all('*', defaultController);
};
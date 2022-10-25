const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const bookController = require('../controllers/bookController');
const profileController = require('../controllers/profileController');
const defaultController = require('../controllers/defaultController');
const { hasUser } = require('../middlewares/guards');


module.exports = (app) => {
    // Routes
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/book', hasUser(), bookController);
    app.use('/profile', profileController);

    app.all('*', defaultController);
}
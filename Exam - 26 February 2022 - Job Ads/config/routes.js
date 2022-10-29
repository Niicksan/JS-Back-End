const homeController = require('../controllers/homeController');
const authController = require('../controllers/authController');
const adController = require('../controllers/adController');
const searchController = require('../controllers/searchController');
const defaultController = require('../controllers/defaultController');
const { hasUser } = require('../middlewares/guards');


module.exports = (app) => {
    // Routes
    app.use('/', homeController);
    app.use('/auth', authController);
    app.use('/ad', adController);
    app.use('/search', hasUser(), searchController);

    app.all('*', defaultController);
};
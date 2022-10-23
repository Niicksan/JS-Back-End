const homeController = require('express').Router();


homeController.get('/', (req, res) => {
    let view;

    if (req.user) {
        // User Home page
        view = 'user-home';
    } else {
        // Guest Home page
        view = 'guest-home';
    }
    res.render(view, {
        title: 'Home Page'
    });
});

module.exports = homeController;
const homeController = require('express').Router();


// TODO Replace with the real controller
homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page',
        user: req.user
    });
});

module.exports = homeController;
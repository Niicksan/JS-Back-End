const homeController = require('express').Router();


homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    });
});

homeController.get('/all-ads', (req, res) => {
    res.render('all-ads', {
        title: 'All Ads'
    });
});

module.exports = homeController;
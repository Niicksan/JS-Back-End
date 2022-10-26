const homeController = require('express').Router();


homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    });
});

homeController.get('/catalog', (req, res) => {
    res.render('catalog', {
        title: 'All Crypto'
    });
});

module.exports = homeController;
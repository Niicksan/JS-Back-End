const hotelController = require('express').Router();


hotelController.get('/details/:id', (req, res) => {
    res.render('./hotel/details', {
        title: 'Hotel Details',
        user: req.user
    });
});

hotelController.get('/create', (req, res) => {
    res.render('./hotel/create', {
        title: 'Create Hotel',
        user: req.user
    });
});


hotelController.get('/edit/:id', (req, res) => {
    res.render('./hotel/edit', {
        title: 'Edit Hotel',
        user: req.user
    });
});

module.exports = hotelController;
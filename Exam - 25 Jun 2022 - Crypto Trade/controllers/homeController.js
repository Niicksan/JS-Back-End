const homeController = require('express').Router();

const { getAllCryptos } = require('../services/cryptoService');


homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    });
});

homeController.get('/catalog', async (req, res) => {
    const cryptos = await getAllCryptos();

    res.render('catalog', {
        title: 'All Crypto',
        cryptos
    });
});

module.exports = homeController;
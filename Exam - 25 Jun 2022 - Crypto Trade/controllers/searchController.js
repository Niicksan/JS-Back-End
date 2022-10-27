const { getAllCryptosBySearch } = require('../services/cryptoService');

const searchController = require('express').Router();


searchController.get('/', (req, res) => {
    const search = req.query.search || '';
    const method = req.query.method || '';

    const cryptos = getAllCryptosBySearch(search, method)
    res.render('search', {
        title: 'Search Crypto',
        search,
    });
});

module.exports = searchController;
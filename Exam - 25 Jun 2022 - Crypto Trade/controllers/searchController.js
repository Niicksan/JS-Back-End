const { getAllCryptosBySearch } = require('../services/cryptoService');

const searchController = require('express').Router();


searchController.get('/', async (req, res) => {
    const search = req.query.search;
    const method = req.query.method;

    const cryptos = await getAllCryptosBySearch(search, method);

    const methods = {
        'crypto-wallet': 'Crypto Wallet',
        'credit-card': 'Credit Card',
        'debit-card': 'Debit Card',
        'paypal': 'PayPal',
    }

    const selectedMethod = methods[method];

    res.render('search', {
        title: 'Search for Crypto',
        search,
        method,
        selectedMethod,
        cryptos
    });
});

module.exports = searchController;
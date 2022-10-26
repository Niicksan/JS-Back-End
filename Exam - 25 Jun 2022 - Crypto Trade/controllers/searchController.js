const searchController = require('express').Router();


searchController.get('/', (req, res) => {
    res.render('search', {
        title: 'Search Crypto'
    });
});

module.exports = searchController;
const searchController = require('express').Router();


searchController.get('/', async (req, res) => {
    res.render('search', {
        title: 'Search for Jobs',
    });
});

module.exports = searchController;
const searchController = require('express').Router();

const { getAdsByUser } = require('../services/adService');


searchController.get('/', async (req, res) => {
    const search = req.query.search;
    let isSearch = false;
    let ads = {};

    if (search == '' || search) {
        ads = await getAdsByUser(search);
        isSearch = true;
    }
    res.render('search', {
        title: 'Search for Jobs',
        ads,
        isSearch,
        search
    });
});

module.exports = searchController;
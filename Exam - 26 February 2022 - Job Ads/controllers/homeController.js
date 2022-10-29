const { getFirstThreeAds, getAllAds } = require('../services/adService');

const homeController = require('express').Router();


homeController.get('/', async (req, res) => {
    const ads = await getFirstThreeAds();

    res.render('home', {
        title: 'Home Page',
        ads
    });
});

homeController.get('/all-ads', async (req, res) => {
    const ads = await getAllAds();

    res.render('all-ads', {
        title: 'All Ads',
        ads
    });
});

module.exports = homeController;
const { getLatestBlogs, getAllBlogs } = require('../services/blogService');

const homeController = require('express').Router();


homeController.get('/', async (req, res) => {
    const blogs = await getLatestBlogs();

    res.render('home', {
        title: 'Home Page',
        blogs
    });
});

homeController.get('/catalog', async (req, res) => {
    const blogs = await getAllBlogs();

    res.render('catalog', {
        title: 'Catalog Page',
        blogs
    });
});

module.exports = homeController;
const homeController = require('express').Router();

const { getAllBooks } = require('../services/bookService');


homeController.get('/', (req, res) => {
    res.render('home', {
        title: 'Home Page'
    });
});

homeController.get('/catalog', async (req, res) => {
    const books = courses = await getAllBooks(req.query.search);

    res.render('catalog', {
        title: 'Catalog Page',
        books
    });
});

module.exports = homeController;
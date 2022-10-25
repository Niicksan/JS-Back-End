const profileController = require('express').Router();

const { getAllBooksByUser } = require('../services/bookService');


profileController.get('/', async (req, res) => {
    const books = await getAllBooksByUser(req.user._id);

    res.render('profile', {
        title: 'Profile Page',
        user: Object.assign({ books }, req.user)
    });
});

module.exports = profileController;
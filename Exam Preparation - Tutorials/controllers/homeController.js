const homeController = require('express').Router();

const { getAllByDate, getRecent } = require('../services/courseService');


homeController.get('/', async (req, res) => {
    let view;
    let courses = [];
    if (req.user) {
        // User Home page
        view = 'user-home';
        courses = await getAllByDate(req.query.search);
    } else {
        // Guest Home page
        view = 'guest-home';
        courses = await getRecent();
    }
    res.render(view, {
        title: 'Home Page',
        courses,
        search: req.query.search
    });
});

module.exports = homeController;
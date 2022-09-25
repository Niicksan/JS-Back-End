const bodyParser = require('body-parser');
const express = require('express');
const hbs = require('express-handlebars').create({
    extname: '.hbs'
});
const defaultTitle = require('../middlewares/defaultTitle');

module.exports = (app) => {

    //TODO: Setup the view engine
    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

    //TODO: Setup the body parser
    app.use(express.urlencoded({ extended: true }));

    //TODO: Setup the static files
    app.use('/static', express.static('static'));

    app.use(defaultTitle('SoftUni Cubicle'));
};
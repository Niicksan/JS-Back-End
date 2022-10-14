const express = require('express');
const hbs = require('express-handlebars').create({
    extname: '.hbs'
});
const cookieParser = require('cookie-parser');
const defaultTitle = require('../middlewares/defaultTitle');
const auth = require('../middlewares/auth');
const userNav = require('../middlewares/userNav');


const jwtSecret = '9a328ncaiowjdf';

module.exports = (app) => {

    //TODO: Setup the view engine
    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

    //TODO: Setup the body parser
    app.use(express.urlencoded({ extended: true }));

    //TODO: Setup the static files
    app.use('/static', express.static('static'));
    app.use(cookieParser());
    app.use(auth(jwtSecret));
    app.use(userNav());

    app.use(defaultTitle('SoftUni Cubicle'));
};
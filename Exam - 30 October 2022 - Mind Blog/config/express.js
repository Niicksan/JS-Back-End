const express = require('express');
const handlebars = require('express-handlebars');
const cookieParser = require('cookie-parser');
const session = require('../middlewares/session');
const trimBody = require('../middlewares/trimBody');


module.exports = (app) => {
    const hbs = handlebars.create({
        extname: '.hbs'
    });

    // Setup the view engine
    app.engine('.hbs', hbs.engine);
    app.set('view engine', '.hbs');

    // Setup the body parser
    app.use(express.urlencoded({ extended: true }));

    // Setup the static files
    app.use('/static', express.static('static'));
    app.use(cookieParser());
    app.use(session());
    app.use(trimBody('password'));
};
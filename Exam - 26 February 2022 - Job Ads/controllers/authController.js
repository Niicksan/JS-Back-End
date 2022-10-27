const authController = require('express').Router();

const { isGuest } = require('../middlewares/guards');
const { register, login } = require('../services/authService');
const { parseError } = require('../utils/errorParser');


authController.get('/register', isGuest(), (req, res) => {
    // TODO replace with real view
    res.render('./auth/register', {
        title: 'Register Page'
    });
});

authController.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.username === '' || req.body.password === '') {
            throw new Error('All fields are required');
        }

        if (req.body.password !== req.body.repass) {
            throw new Error('Passwords don\'t match');
        }

        // TODO Check if register create session
        const token = await register(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/'); // TODO Check the redirect
    } catch (error) {
        // TODO Add Error Parser
        res.locals.errors = parseError(error);

        // TODO Add Error display to the template
        res.render('./auth/register', {
            title: 'Register Page',
            user: {
                username: req.body.username
            }
        });
    }
});

authController.get('/login', isGuest(), (req, res) => {
    // TODO replace with real view
    res.render('./auth/login', {
        title: 'Login Page'
    });
});

authController.post('/login', isGuest(), async (req, res) => {
    try {
        if (req.body.username === '' || req.body.password === '') {
            throw new Error('All fields are required');
        }

        const token = await login(req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/'); // TODO Check the redirect
    } catch (error) {
        // TODO Add Error Parser
        res.locals.errors = parseError(error);

        // TODO Add Error display to the template
        res.render('./auth/login', {
            title: 'Login Page',
            user: {
                username: req.body.username
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;
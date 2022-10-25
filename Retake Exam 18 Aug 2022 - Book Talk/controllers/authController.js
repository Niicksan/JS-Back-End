const authController = require('express').Router();

const { register, login } = require('../services/authService');
const { parseError } = require('../utils/errorParser');
const { isGuest } = require('../middlewares/guards');


authController.get('/register', isGuest(), (req, res) => {
    res.render('./auth/register', {
        title: 'Register Page'
    });
});

authController.post('/register', isGuest(), async (req, res) => {
    try {
        if (req.body.email === '' || req.body.username === '' || req.body.password === '') {
            throw new Error('All fields are required');
        }

        if (req.body.password.length < 4) {
            throw new Error('Passwords must be at least 4 characters long');
        }

        if (req.body.password !== req.body.repass) {
            throw new Error('Passwords don\'t match');
        }

        const token = await register(req.body.email, req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);

        res.render('./auth/register', {
            title: 'Register Page',
            errors,
            user: {
                email: req.body.email,
                username: req.body.username
            }
        });
    }
});

authController.get('/login', isGuest(), (req, res) => {
    res.render('./auth/login', {
        title: 'Login Page'
    });
});

authController.post('/login', isGuest(), async (req, res) => {
    try {
        if (req.body.email === '' || req.body.password === '') {
            throw new Error('All fields are required');
        }

        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        const errors = parseError(error);

        res.render('./auth/login', {
            title: 'Login Page',
            errors,
            user: {
                email: req.body.email,
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
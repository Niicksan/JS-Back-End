const { register, login } = require('../services/authService');
const { parseError } = require('../utils/errorParser');
const validator = require('validator');
const authController = require('express').Router();


authController.get('/register', (req, res) => {
    res.render('./auth/register', {
        title: 'Register Page'
    });
});

authController.post('/register', async (req, res) => {
    try {
        if (req.body.email === '' || req.body.username === '' || req.body.password === '') {
            throw new Error('All fields are required');
        }

        if (validator.isEmail(req.body.email) === false) {
            throw new Error('Invalid email');
        }

        if (req.body.password.length < 5) {
            throw new Error('Passwords must be at least 5 characters long');
        }

        if (req.body.password !== req.body.repass) {
            throw new Error('Passwords don\'t match');
        }

        const token = await register(req.body.email, req.body.username, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        // TODO Add Error Parser
        const errors = parseError(error);

        // TODO Add Error display to the template
        res.render('./auth/register', {
            title: 'Register Page',
            errors,
            body: {
                email: req.body.email,
                username: req.body.username

            }
        });
    }
});

authController.get('/login', (req, res) => {
    res.render('./auth/login', {
        title: 'Login Page'
    });
});

authController.post('/login', async (req, res) => {
    try {
        if (req.body.username === '' || req.body.password === '') {
            throw new Error('All fields are required');
        }

        const token = await login(req.body.email, req.body.password);
        res.cookie('token', token);
        res.redirect('/');
    } catch (error) {
        // TODO Add Error Parser
        const errors = parseError(error);

        // TODO Add Error display to the template
        res.render('./auth/login', {
            title: 'Login Page',
            errors,
            body: {
                email: req.body.email
            }
        });
    }
});

authController.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = authController;
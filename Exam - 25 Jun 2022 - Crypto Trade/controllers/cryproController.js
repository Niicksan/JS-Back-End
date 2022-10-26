const cryptoController = require('express').Router();

const { hasUser, isOwner } = require('../middlewares/guards');
const { createCrypto } = require('../services/cryptoService');
const { parseError } = require('../utils/errorParser');
const preloader = require('../middlewares/preloader');


cryptoController.get('/create', hasUser(), (req, res) => {
    res.render('./crypto/create', {
        title: 'Create Crypto'
    });
});

cryptoController.post('/create', hasUser(), async (req, res) => {
    const crypto = {
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        description: req.body.description,
        method: req.body.method,
        owner: req.user._id,
    };

    try {
        if (Object.values(crypto).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await createCrypto(crypto);
        res.redirect('/catalog');
    } catch (error) {
        // res.locals.errors = parseError(error);
        res.render('./crypto/create', {
            title: 'Create Crypt',
            errors: parseError(error),
            crypto
        });
    }
});

cryptoController.get('/details/:id', preloader(true), async (req, res) => {
    const crypto = res.locals.crypto;

    crypto.isOwner = crypto.owner.toString() == req.user._id.toString();
    crypto.isBought = crypto.users.map(x => x.toString()).includes(req.user._id.toString());
    res.render('./crypto/details', {
        title: crypto.title,
        crypto
    });
});

cryptoController.get('/edit/:id', preloader(true), isOwner(), async (req, res) => {
    const book = res.locals.book;

    res.render('./book/edit', {
        title: `Edit Book ${book.title}`,
        book
    });
});

module.exports = cryptoController;
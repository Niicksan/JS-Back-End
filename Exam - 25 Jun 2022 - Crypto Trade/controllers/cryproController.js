const cryptoController = require('express').Router();

const { hasUser, isOwner } = require('../middlewares/guards');
const { createCrypto, deleteCryptoById, updateCryptoById, getCryptoById, buyCrypto } = require('../services/cryptoService');
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
        res.locals.errors = parseError(error);

        res.render('./crypto/create', {
            title: 'Create Crypt',
            crypto
        });
    }
});

cryptoController.get('/details/:id', preloader(true), async (req, res) => {
    const crypto = res.locals.crypto;

    crypto.isOwner = crypto.owner.toString() == req.user._id.toString();
    crypto.isBought = crypto.users.map(x => x.toString()).includes(req.user._id.toString());
    res.render('./crypto/details', {
        title: crypto.name,
        crypto
    });
});

cryptoController.get('/edit/:id', preloader(true), isOwner(), async (req, res) => {
    const crypto = res.locals.crypto;

    const methods = {
        'crypto-wallet': 'Crypto Wallet',
        'credit-card': 'Credit Card',
        'debit-card': 'Debit Card',
        'paypal': 'PayPal',
    }

    crypto.selectedMethod = methods[crypto.method];
    res.render('./crypto/edit', {
        title: `Edit Crypto ${crypto.name}`,
        crypto
    });
});

cryptoController.post('/edit/:id', preloader(), isOwner(), async (req, res) => {
    const crypto = res.locals.crypto;

    const methods = {
        'crypto-wallet': 'Crypto Wallet',
        'credit-card': 'Credit Card',
        'debit-card': 'Debit Card',
        'paypal': 'PayPal',
    }

    try {
        await updateCryptoById(crypto, req.body);
        res.redirect(`/crypto/details/${req.params.id}`);
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./crypto/edit', {
            title: `Edit Crypto ${crypto.name}`,
            crypto: Object.assign(req.body, { _id: req.params.id, selectedMethod: methods[crypto.method] })
        });
    }
});

cryptoController.get('/delete/:id', preloader(), isOwner(), async (req, res) => {
    await deleteCryptoById(req.params.id);
    res.redirect('/catalog');
});

cryptoController.get('/buy/:id', preloader(true), async (req, res) => {
    const crypto = res.locals.crypto;;

    // if (course.owner.toString() != req.user._id.toString()
    //     && course.users.map(x => x.toString()).includes(req.user._id.toString()) == false) {
    //     await enrollUser(course, req.user._id)
    // }~

    // res.redirect(`/course/details/${req.params.id}`);

    try {
        if (crypto.owner.toString() == req.user._id.toString()) {
            crypto.isOwner = true;
            throw new Error('You can not buy your own crypto coins');
        }

        if (crypto.users.map(x => x.toString()).includes(req.user._id.toString())) {
            crypto.isBought = true;
            throw new Error('You already bought these crypto coins');
        }

        await buyCrypto(req.params.id, req.user._id);
        res.redirect(`/crypto/details/${req.params.id}`);
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./crypto/details', {
            title: crypto.name,
            crypto
        });
    }
});

module.exports = cryptoController;
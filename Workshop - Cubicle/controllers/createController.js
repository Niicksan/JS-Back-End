//const { create } = require('../services/accomodationService');

const router = require('express').Router();


router.get('/', (req, res) => {
    res.render('create', {
        title: 'Create new Cubicle'
    });
});

router.post('/', async (req, res) => {
    try {
        const result = await create(req.body);
        res.redirect('/details/' + result.id);
    } catch (err) {
        res.render('create', {
            title: 'Request Error',
            error: err.message.split('\n')
        });
    }
});

module.exports = router;
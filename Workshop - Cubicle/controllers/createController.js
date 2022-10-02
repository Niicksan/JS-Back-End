const router = require('express').Router();
const { create } = require('../services/cubesService');

router.get('/create', (req, res) => {
    res.render('./cubicle/create', {
        title: 'Create new Cubicle'
    });
});

router.post('/create', async (req, res) => {
    try {
        const result = await create(req.body);
        res.redirect('/details/' + result._id);
    } catch (err) {
        console.log(err);
        res.render('/create', {
            title: 'Request Error',
            error: err.message.split('\n')
        });
    }
});

module.exports = router;
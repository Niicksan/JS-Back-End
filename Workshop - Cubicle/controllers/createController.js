const router = require('express').Router();
const { create } = require('../services/cubicleService');

router.get('/create', (req, res) => {
    res.render('./cubicle/create', {
        title: 'Create new Cubicle'
    });
});

router.post('/create', async (req, res) => {
    try {
        const result = await create(req.body);
        console.log(result);
        res.redirect('/details/' + result._id);
    } catch (err) {
        res.render('/create', {
            title: 'Request Error',
            error: err.message.split('\n')
        });
    }
});

module.exports = router;
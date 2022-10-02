const router = require('express').Router();
const { create, getCubeById } = require('../services/cubesService');

router.get('/create', (req, res) => {
    res.render('./cube/create', {
        title: 'Create new Cubicle'
    });
});

router.post('/create', async (req, res) => {
    try {
        const result = await create(req.body);
        res.redirect('/cube/details/' + result._id);
    } catch (err) {
        console.log(err);
        res.render('./cube/create', {
            title: 'Request Error',
            error: err.message.split('\n')
        });
    }
});

router.get('/details/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getCubeById(cubicleId);

    if (cubicle) {
        res.render('./cube/details', {
            title: 'Cubicle Details',
            cubicle
        });
    } else {
        res.render('cubicleNotFound', {
            title: 'Cubicle Details',
            cubicleId
        });
    }
});

module.exports = router;
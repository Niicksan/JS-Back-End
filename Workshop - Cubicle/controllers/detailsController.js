const { getById } = require('../services/cubicleService');

const router = require('express').Router();


router.get('/:id', (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = getById(cubicleId);

    if (cubicle) {
        res.render('details', {
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
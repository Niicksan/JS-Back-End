const { getById } = require('../services/cubicleService');

const router = require('express').Router();


router.get('/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getById(cubicleId);
    console.log(cubicle);
    if (cubicle) {
        res.render('./cubicle/details', {
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
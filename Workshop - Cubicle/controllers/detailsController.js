const { getCubeById } = require('../services/cubesService');

const router = require('express').Router();


router.get('/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getCubeById(cubicleId);
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
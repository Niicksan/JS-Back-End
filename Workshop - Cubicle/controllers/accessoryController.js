const router = require('express').Router();
const { createAccessory, getAllAccessories, attachAccessory } = require('../services/accessoryService');
const { getById } = require('../services/cubicleService');

router.get('/create', async (req, res) => {
    res.render('./accessory/createAccessory', {
        title: 'Create new Accessory',
        accessories
    });
});

router.post('/create', async (req, res) => {
    try {
        await createAccessory(req.body);
        res.redirect('/');
    } catch (err) {
        res.render('./accessory/createAccessory', {
            title: 'Request Error',
            error: err.message.split('\n')
        });
    }
});

router.get('/attach/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getById(cubicleId);
    const accessories = await getAllAccessories();

    if (cubicle) {
        res.render('./accessory/attachAccessory', {
            title: 'Attach new Accessory',
            cubicle,
            accessories
        });
    } else {
        res.render('cubicleNotFound', {
            title: 'Attach new Accessory',
            cubicleId
        });
    }
});

router.post('/attach/:id', async (req, res) => {
    try {
        const cubicleId = req.params.id;
        const result = await attachAccessory(cubicleId, req.body)
        res.redirect('/details/' + req.params.id);
    } catch (err) {
        console.log(err);
        res.render('./accessory/attachAccessory', {
            title: 'Request Error',
            error: err.message.split('\n')
        });
    }
});


module.exports = router;
const router = require('express').Router();
const { createAccessory } = require('../services/accessoryService');

router.get('/create', (req, res) => {
    res.render('./accessory/createAccessory', {
        title: 'Create new Accessory'
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

module.exports = router;
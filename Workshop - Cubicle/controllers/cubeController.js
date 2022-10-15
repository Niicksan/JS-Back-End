const router = require('express').Router();
const { create, getCubeById, update, deleteById } = require('../services/cubesService');
const { parseError } = require('../utils/parser');

router.get('/create', (req, res) => {
    res.render('./cube/create', {
        title: 'Create new Cubicle'
    });
});

router.post('/create', async (req, res) => {
    try {
        const result = await create(req.body, req.user._id);
        res.redirect('/cube/details/' + result._id);
    } catch (error) {
        res.render('./cube/create', {
            title: 'Request Error',
            body: req.body,
            error: parseError(error).messages
        });
    }
});

router.get('/details/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getCubeById(cubicleId);

    if (req.user && req.user._id == cubicle.owner) {
        cubicle.isOwner = true;
    }

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

router.get('/edit/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getCubeById(cubicleId);

    if (!req.user) {
        return res.redirect('/auth/login');
    }

    if (req.user && cubicle.owner != req.user._id) {
        return res.redirect('/');
    }

    res.render('./cube/edit', {
        title: 'Edit Cubicle',
        cubicle
    });
});

router.post('/edit/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getCubeById(cubicleId);

    if (!req.user) {
        return res.redirect('/auth/login');
    }

    if (req.user && cubicle.owner != req.user._id) {
        return res.redirect('/');
    }

    try {
        const result = await update(cubicleId, req.body);
        res.redirect('/cube/details/' + result._id);
    } catch (error) {
        req.body._id = cubicleId;
        res.render('./cube/edit', {
            title: 'Edit Cubicle',
            error: parseError(error),
            cubicle: req.body
        });
    }
});

router.get('/delete/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getCubeById(cubicleId);

    if (!req.user) {
        return res.redirect('/auth/login');
    }

    if (req.user && cubicle.owner != req.user._id) {
        return res.redirect('/');
    }

    res.render('./cube/delete', {
        title: 'Delete Cubicle',
        cubicle
    });
});

router.post('/delete/:id', async (req, res) => {
    const cubicleId = req.params.id;
    const cubicle = await getCubeById(cubicleId);

    if (!req.user) {
        return res.redirect('/auth/login');
    }

    if (req.user && cubicle.owner != req.user._id) {
        return res.redirect('/');
    }

    try {
        await deleteById(cubicleId, req.body);
        res.redirect('/');
    } catch (error) {
        req.body._id = cubicleId;
        res.render('./cube/delete', {
            title: 'Delete Cubicle',
            error: parseError(error),
            cubicle: req.body
        });
    }
});

module.exports = router;
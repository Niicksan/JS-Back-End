const adController = require('express').Router();

const { hasUser, isOwner } = require('../middlewares/guards');
const { getAdById, createAd, updateAdById, deleteAdById, applyForAd } = require('../services/adService');
const { parseError } = require('../utils/errorParser');
const preloader = require('../middlewares/preloader');


adController.get('/details/:id', preloader(true), async (req, res) => {
    const ad = res.locals.ad;
    console.log(ad);
    ad.isOwner = ad.author._id.toString() == req.user._id.toString();
    ad.isApplied = ad.applications.map(x => x._id.toString()).includes(req.user._id.toString());
    res.render('./ad/details', {
        title: ad.headline,
        ad
    });
});

adController.get('/create', hasUser(), async (req, res) => {
    res.render('./ad/create', {
        title: 'Create an Ad'
    });
});

adController.post('/create', hasUser(), async (req, res) => {
    const ad = {
        headline: req.body.headline,
        location: req.body.location,
        companyName: req.body.companyName,
        companyDescription: req.body.companyDescription,
        author: req.user._id,
    };

    try {
        if (Object.values(ad).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await createAd(ad);
        res.redirect('/all-ads');
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./ad/create', {
            title: 'Create an Ad',
            ad
        });
    }
});

adController.get('/edit/:id', preloader(true), isOwner(), async (req, res) => {
    const ad = res.locals.ad;

    res.render('./ad/edit', {
        title: `Edit your qd ${ad.headline}`,
        ad
    });
});

adController.post('/edit/:id', preloader(), isOwner(), async (req, res) => {
    const ad = res.locals.ad;

    try {
        if (Object.values(req.body).some(v => !v)) {
            throw new Error('All fields are required')
        }

        await updateAdById(ad, req.body);
        res.redirect(`/ad/details/${req.params.id}`);
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./ad/edit', {
            title: `Edit your qd ${ad.headline}`,
            ad: Object.assign(req.body, { _id: req.params.id })
        });
    }
});

adController.get('/delete/:id', preloader(), isOwner(), async (req, res) => {
    await deleteAdById(req.params.id);
    res.redirect('/');
});

adController.get('/apply/:id', preloader(true), async (req, res) => {
    const ad = res.locals.ad;
    console.log(ad);
    try {
        if (ad.author._id.toString() == req.user._id.toString()) {
            ad.isOwner = true;
            throw new Error('You can not apply for your own advertisement');
        }

        if (ad.applications.map(x => x._id.toString()).includes(req.user._id.toString())) {
            ad.isApplied = true;
            throw new Error('You are already applied for this advertisement');
        }

        await applyForAd(req.params.id, req.user._id);
        res.redirect(`/ad/details/${req.params.id}`);
    } catch (error) {
        res.locals.errors = parseError(error);

        res.render('./ad/details', {
            title: ad.headline,
            ad
        });
    }
});

module.exports = adController;
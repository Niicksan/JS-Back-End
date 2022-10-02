const router = require('express').Router();
const { getAllCubicles } = require('../services/cubicleService');

router.get('/', async (req, res) => {
    const search = req.query.search || '';
    const fromDifficulty = Number(req.query.from) || 1;
    const toDifficulty = Number(req.query.to) || 1000;

    const cubicles = await getAllCubicles(search, fromDifficulty, toDifficulty);

    res.render('home', {
        title: 'Home',
        cubicles,
        search,
        fromDifficulty,
        toDifficulty,
    });
});

module.exports = router;
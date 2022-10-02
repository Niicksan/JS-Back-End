const router = require('express').Router();
const { getAllCubes } = require('../services/cubesService');

router.get('/', async (req, res) => {
    const search = req.query.search || '';
    const fromDifficulty = Number(req.query.from) || 1;
    const toDifficulty = Number(req.query.to) || 1000;

    const cubicles = await getAllCubes(search, fromDifficulty, toDifficulty);

    res.render('home', {
        title: 'Home',
        cubicles,
        search,
        fromDifficulty,
        toDifficulty,
    });
});

module.exports = router;
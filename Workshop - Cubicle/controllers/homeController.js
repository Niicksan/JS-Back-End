const router = require('express').Router();
const { getAll } = require('../services/cubicleService');

router.get('/', (req, res) => {
    const search = req.query.search || '';
    const fromDifficulty = Number(req.query.from) || 1;
    const toDifficulty = Number(req.query.to) || 1000;

    const cubicles = getAll(search, fromDifficulty, toDifficulty);

    res.render('home', {
        title: 'All Cubicles',
        cubicles,
        search,
        fromDifficulty,
        toDifficulty,
    });
});

module.exports = router;
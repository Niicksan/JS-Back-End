const router = require('express').Router();


router.get('/:id', (req, res) => {
    res.render('details');
});

module.exports = router;
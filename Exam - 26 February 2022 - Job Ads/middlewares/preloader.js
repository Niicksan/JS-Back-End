const { getAdById, getAdoByIdRaw } = require("../services/adService");


module.exports = (lean) => async (req, res, next) => {
    if (lean) {
        res.locals.ad = await getAdById(req.params.id);

    } else {
        res.locals.ad = await getAdoByIdRaw(req.params.id);
    }

    next();
};
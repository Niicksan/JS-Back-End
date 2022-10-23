const { getById, getByIdRaw } = require("../services/courseService");


module.exports = (lean) => async (req, res, next) => {
    const course = await getByIdRaw(req.params.id);

    if (lean) {
        res.locals.course = await getById(req.params.id);

    } else {
        res.locals.course = await getByIdRaw(req.params.id);
    }

    next();
};
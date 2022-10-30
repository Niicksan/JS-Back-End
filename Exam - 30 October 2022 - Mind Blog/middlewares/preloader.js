const { getBlogById, getBlogByIdRaw } = require("../services/blogService");


module.exports = (lean) => async (req, res, next) => {
    if (lean) {
        res.locals.blog = await getBlogById(req.params.id);

    } else {
        res.locals.blog = await getBlogByIdRaw(req.params.id);
    }

    next();
};
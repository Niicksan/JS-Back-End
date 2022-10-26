const { getCryptoById, getCryptoByIdRaw } = require("../services/cryptoService");


module.exports = (lean) => async (req, res, next) => {
    if (lean) {
        res.locals.crypto = await getCryptoById(req.params.id);

    } else {
        res.locals.crypto = await getCryptoByIdRaw(req.params.id);
    }

    next();
};
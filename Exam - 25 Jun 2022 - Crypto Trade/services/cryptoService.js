const Crypto = require("../models/Crypto");


async function getAllCryptos() {
    return Crypto.find({}).lean();
}

async function getAllCryptosBySearch(search, selectedMethod) {
    return await Crypto
        .find({ name: new RegExp(search), method: selectedMethod })
        .lean();
}

async function getCryptoById(id) {
    return Crypto.findById(id).lean();
}

async function getCryptoByIdRaw(id) {
    return Crypto.findById(id);
}

async function createCrypto(crypto) {
    return Crypto.create(crypto);
}

async function updateCryptoById(crypto, data) {
    crypto.name = data.name;
    crypto.image = data.image;
    crypto.price = data.price;
    crypto.description = data.description;
    crypto.method = data.method;

    return crypto.save();
}

async function deleteCryptoById(id) {
    return Crypto.findByIdAndDelete(id);
}

async function buyCrypto(crypto, userId) {
    crypto.users.push(userId)
    return crypto.save();
}

module.exports = {
    getAllCryptos,
    getAllCryptosBySearch,
    getCryptoById,
    getCryptoByIdRaw,
    createCrypto,
    updateCryptoById,
    deleteCryptoById,
    buyCrypto
}
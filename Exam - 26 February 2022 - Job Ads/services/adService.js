const Ad = require("../models/Ad");
const User = require("../models/User");


async function getAllAds() {
    return Ad.find({}).lean();
}

async function getFirstThreeAds() {
    return Ad.find({}).limit(3).lean();
}

async function getAdById(id) {
    return Ad.findById(id).populate('author', 'email').populate('applications', 'email description').lean();
}

async function getAdoByIdRaw(id) {
    return Ad.findById(id);
}

async function createAd(ad) {
    return Ad.create(ad);
}

async function updateAdById(ad, data) {
    ad.headline = data.headline;
    ad.location = data.location;
    ad.companyName = data.companyName;
    ad.companyDescription = data.companyDescription;

    return ad.save();
}

async function deleteAdById(id) {
    return Ad.findByIdAndDelete(id);
}

async function getAdsByUser(search) {
    const ads = await Ad.find().populate("author").lean();
    return ads.filter(x => x.author.email == search);
}

async function applyForAd(adId, userId) {
    const ad = await getAdoByIdRaw(adId);

    ad.applications.push(userId);
    ad.applicationsCount++;
    return ad.save();
}

module.exports = {
    getAllAds,
    getFirstThreeAds,
    getAdById,
    getAdoByIdRaw,
    createAd,
    updateAdById,
    deleteAdById,
    getAdsByUser,
    applyForAd
}
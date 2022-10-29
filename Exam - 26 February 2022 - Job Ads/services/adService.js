const Ad = require("../models/Ad");
const User = require("../models/User");


async function getAllAds() {
    return Ad.find({}).lean();
}

async function getFirstThreeAds() {
    return Ad.find({}).limit(3).lean();
}

async function getAllAdsByAuthor(email, userId) {
    const query = {};

    if (author) {
        query.name = new RegExp(search, 'i');
    }

    return await Ad.find(query).collation({ locale: 'en', strength: 2 }).find({ author: userId }).lean();
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

async function getAdsByUser(email) {
    try {
        const query = new RegExp(email, "i");

        return await User.find({ email: query }).collation({ locale: 'en', strength: 2 }).populate('myAds', 'headline companyName').lean();
    } catch (error) {
        return null;
    }

    // const ads = await Ad.find().populate("author");
    // return ads.filter((x) => regEx.test(x.author.email));
}

async function applyForAd(adId, userId) {
    const ad = await getAdoByIdRaw(adId);
    console.log(ad);
    ad.applications.push(userId);
    ad.applicationsCount++;
    return ad.save();
}

module.exports = {
    getAllAds,
    getFirstThreeAds,
    getAllAdsByAuthor,
    getAdById,
    getAdoByIdRaw,
    createAd,
    updateAdById,
    deleteAdById,
    getAdsByUser,
    applyForAd
}
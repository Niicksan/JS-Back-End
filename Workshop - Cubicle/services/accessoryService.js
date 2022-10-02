const Cube = require('../models/Cube');
const Accessory = require('../models/Accessory');


async function getAllAccessories() {
    return Accessory.find({}).lean();
}

async function createAccessory(accessoryData) {
    const accessory = {
        name: accessoryData.name,
        description: accessoryData.description,
        imageUrl: accessoryData.imageUrl,
    };

    const missing = Object.entries(accessory).filter(([k, v]) => !v);

    if (missing.length > 0) {
        throw new Error(missing.map(m => `${m[0]} is required!`).join('\n'));
    }

    const result = await Accessory.create(accessory);

    return result;
}

module.exports = {
    getAllAccessories,
    createAccessory
};
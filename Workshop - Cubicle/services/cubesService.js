const Cube = require('../models/Cube');

const fs = require('fs');

const filename = './config/database.json';
const data = JSON.parse(fs.readFileSync(filename));

async function persist() {
    return new Promise((res, rej) => {
        fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
            if (err == null) {
                res();
            } else {
                rej(err);
            }
        });
    });
};

function getAll(search, fromDifficulty, toDifficulty) {
    search = search.toLowerCase();
    return data
        .filter(r => r.name.toLowerCase().includes(search) || r.description.toLowerCase().includes(search))
        .filter(r => r.difficultyLevel >= fromDifficulty && r.difficultyLevel <= toDifficulty);
}

async function getAllCubes(search, fromDifficulty, toDifficulty) {
    return await Cube
        .find({ name: new RegExp(search), difficultyLevel: { $gte: fromDifficulty, $lte: toDifficulty } })
        .sort({ difficultyLevel: 1 })
        .lean();
}

async function getCubeById(id) {
    try {
        return await Cube.findById(id).populate('accessories', 'name description imageUrl').lean();;
    } catch (error) {
        return null;
    }
}

async function create(cubicleData, ownerId) {
    const cubicle = {
        name: cubicleData.name,
        description: cubicleData.description,
        imageUrl: cubicleData.imageUrl,
        difficultyLevel: Number(cubicleData.difficultyLevel),
        owner: ownerId
    };

    const missing = Object.entries(cubicle).filter(([k, v]) => !v);

    if (missing.length > 0) {
        throw new Error(missing.map(m => `${m[0]} is required!`).join('\n'));
    }

    const result = await Cube.create(cubicle);

    return result;
}

async function update(cubicleId, cubicleData) {
    const missing = Object.entries(cubicleData).filter(([k, v]) => !v);

    if (missing.length > 0) {
        throw new Error(missing.map(m => `${m[0]} is required!`).join('\n'));
    }

    const cubicle = await Cube.findById(cubicleId);

    cubicle.name = cubicleData.name;
    cubicle.description = cubicleData.description;
    cubicle.difficultyLevel = cubicleData.difficultyLevel;
    cubicle.imageUrl = cubicleData.imageUrl;

    await cubicle.save();

    return cubicle;
}

async function deleteById(cubicleId) {
    return Cube.findByIdAndRemove(cubicleId);
}

module.exports = {
    getAllCubes,
    getCubeById,
    create,
    update,
    deleteById
};
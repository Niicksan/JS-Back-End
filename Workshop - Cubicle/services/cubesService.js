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

function getAllCubes(search, fromDifficulty, toDifficulty) {
    return Cube
        .find({ name: new RegExp('.*' + search + '.*'), difficultyLevel: { $gte: fromDifficulty, $lte: toDifficulty } })
        .sort({ difficultyLevel: 1 })
        .lean();
}

function getCubeById(id) {
    return Cube.findById(id).populate('accessories', 'name description imageUrl').lean();
}

async function create(cubicleData) {
    const cubicle = {
        name: cubicleData.name,
        description: cubicleData.description,
        imageUrl: cubicleData.imageUrl,
        difficultyLevel: cubicleData.difficultyLevel
    };

    const missing = Object.entries(cubicle).filter(([k, v]) => !v);

    if (missing.length > 0) {
        throw new Error(missing.map(m => `${m[0]} is required!`).join('\n'));
    }

    const result = await Cube.create(cubicle);

    return result;
}

module.exports = {
    getAllCubes,
    getCubeById,
    create
};
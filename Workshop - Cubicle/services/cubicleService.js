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

function getById(id) {
    return data.find(i => i.id == id);
}

async function create(cubicleData) {
    const cubicle = {
        id: getId(),
        name: cubicleData.name,
        description: cubicleData.description,
        imageUrl: cubicleData.imageUrl,
        difficultyLevel: cubicleData.difficultyLevel
    };

    const missing = Object.entries(cubicle).filter(([k, v]) => !v);
    if (missing.length > 0) {
        throw new Error(missing.map(m => `${m[0]} is required!`).join('\n'));
    }

    data.push(cubicle);
    await persist();

    return cubicle;
}

function getId() {
    return ('000000' + (Math.random() * 999999 | 0).toString(16)).slice(-6);
}

module.exports = {
    getAll,
    getById,
    create
};
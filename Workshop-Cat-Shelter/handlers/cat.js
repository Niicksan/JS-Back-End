const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname === '/cats/add-cat' && req.method === 'GET') {
        let filePath = path.normalize(path.join(__filename.slice(0, __filename.length - 8), '../views/addCat.html'));

        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);

            res.write(modifiedData);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (err) => {
            console.log(err);
        });
    } else if (pathname === '/cats/add-cat' && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            };

            const base = path.resolve('.');
            let oldPath = files.upload.filepath;
            ;
            let newPath = path.normalize(path.join(base, '/content/images/' + files.upload.originalFilename));

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    throw err;
                }

                console.log('File was uploaded successfully!');
            })

            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                };

                let allCats = JSON.parse(data);
                allCats.push({
                    id: cats.length + 1,
                    ...fields,
                    image: files.upload.originalFilename,
                });

                let json = JSON.stringify(allCats, null, 2);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(302, { location: '/' });
                    res.end();
                });
            });
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'GET') {
        let filePath = path.normalize(path.join(__filename.slice(0, __filename.length - 8), '../views/addBreed.html'));

        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            res.write(data);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (err) => {
            console.log(err);
        });
    } else if (pathname === '/cats/add-breed' && req.method === 'POST') {
        let formData = '';

        req.on('data', (data) => {
            formData += data;
        });

        req.on('end', () => {
            let body = qs.parse(formData);

            fs.readFile('./data/breeds.json', (err, data) => {
                if (err) {
                    throw err;
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile('./data/breeds.json', json, 'utf-8', () => console.log('The breed was uploaded successfully!'));
            });

            res.writeHead(302, { location: '/' });
            res.end();
        });
    } else if (pathname.includes('/cats/cat-edit') && req.method === 'GET') {
        let filePath = path.normalize(path.join(__filename.slice(0, __filename.length - 8), '../views/editCat.html'));

        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            let catId = req.url.substr(req.url.lastIndexOf('/') + 1);
            let currentCat = cats.find(i => i.id == catId);
            let modifiedData = data.toString().replace('{{id}}', catId);

            modifiedData = modifiedData.replace('{{name}}', currentCat.name);
            modifiedData = modifiedData.replace('{{description}}', currentCat.description);
            modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);

            let catBreedsAsOptions = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            modifiedData = modifiedData.replace('{{catBreeds}}', catBreedsAsOptions.join('/'));

            res.write(modifiedData);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (err) => {
            console.log(err);
        });
    } else if (pathname.includes('/cats/cat-edit') && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            };

            const base = path.resolve('.');
            let oldPath = files.upload.filepath;

            let newPath = path.normalize(path.join(base, '/content/images/' + files.upload.originalFilename));

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    throw err;
                }

                console.log('File was uploaded successfully!');
            })

            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                };

                let allCats = JSON.parse(data);
                let catId = req.url.substr(req.url.lastIndexOf('/') + 1);
                let catIndex = cats.findIndex(i => i.id == catId);

                let currentCat = {
                    id: Number(catId),
                    ...fields,
                    image: files.upload.originalFilename,
                };
                allCats.splice(catIndex, 1, currentCat);

                let json = JSON.stringify(allCats, null, 2);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(302, { location: '/' });
                    res.end();
                });
            });
        });
    } else if (pathname.includes('/cats/cat-find-new-home') && req.method === 'GET') {
        let filePath = path.normalize(path.join(__filename.slice(0, __filename.length - 8), '../views/catShelter.html'));

        const index = fs.createReadStream(filePath);

        index.on('data', (data) => {
            let catId = req.url.substr(req.url.lastIndexOf('/') + 1);
            let currentCat = cats.find(i => i.id == catId);
            let modifiedData = data.toString().replace('{{id}}', catId);

            modifiedData = modifiedData.replace('{{image}}', path.join('/content/images/' + currentCat.image));
            modifiedData = modifiedData.replace('{{name}}', currentCat.name);
            modifiedData = modifiedData.replace('{{description}}', currentCat.description);
            modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);
            modifiedData = modifiedData.replace('{{breed}}', currentCat.breed);

            res.write(modifiedData);
        });

        index.on('end', () => {
            res.end();
        });

        index.on('error', (err) => {
            console.log(err);
        });
    } else if (pathname.includes('/cats/cat-find-new-home') && req.method === 'POST') {
        let form = new formidable.IncomingForm();

        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            };

            fs.readFile('./data/cats.json', 'utf-8', (err, data) => {
                if (err) {
                    throw err;
                };

                let allCats = JSON.parse(data);
                let catId = req.url.substr(req.url.lastIndexOf('/') + 1);

                allCats = allCats.filter(c => c.id != catId);

                let json = JSON.stringify(allCats, null, 2);

                fs.writeFile('./data/cats.json', json, () => {
                    res.writeHead(302, { location: '/' });
                    res.end();
                });
            });
        });
    } else {
        return true;
    }
}
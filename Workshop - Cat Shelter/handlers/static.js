const fs = require('fs');
const url = require('url');

function getContentType(url) {
    if (url.endsWith('css')) {
        return 'text/css';
    } else if (url.endsWith('html')) {
        return 'text/html';
    } else if (url.endsWith('png')) {
        // .png = 'image/png'
        return 'image/png';
    } else if (url.endsWith('jpg')) {
        // .jpg = 'image/jpeg'
        return 'image/jpeg';
    } else if (url.endsWith('jpeg')) {
        // .jpeg = 'image/jpeg'
        return 'image/jpeg';
    } else if (url.endsWith('ico')) {
        // .ico = 'image/x-icon' or 'image/vnd.microsoft.icon'
        return 'image/x-icon';
    } else if (url.endsWith('js')) {
        return 'text/javascript';
    }
}

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;

    if (pathname.startsWith('/content') && req.method === 'GET') {
        if (pathname.endsWith('png') || pathname.endsWith('jpg') || pathname.endsWith('jpeg') || pathname.endsWith('ico')) {
            fs.readFile(`./${pathname}`, (err, data) => {
                if (err) {
                    console.log(err);

                    res.writeHead(404, {
                        'ContentType': 'text/plain'
                    })

                    res.write('Error was found');
                    res.end();
                    return;
                }

                console.log(pathname);
                res.writeHead(200, {
                    'Content-Type': getContentType(pathname)
                })

                res.write(data);
                res.end();
            });
        } else {
            fs.readFile(`./${pathname}`, 'utf-8', (err, data) => {
                if (err) {
                    console.log(err);

                    res.writeHead(404, {
                        'ContentType': 'text/plain'
                    })

                    res.write('Error was found');
                    res.end();
                    return;
                }

                console.log(pathname);
                res.writeHead(200, {
                    'Content-Type': getContentType(pathname)
                })

                res.write(data);
                res.end();
            });
        }
    } else {
        return true;
    }
}
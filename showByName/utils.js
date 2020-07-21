var fs  = require("fs")

function promisifiedReadDir (dir) {
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, function (err, files) {
            if (err) return reject(err);
            resolve (files);
        })
    })
}

function promisifiedReadFile (file) {
    return new Promise (function(resolve, reject) {
        fs.readFile(file, function (err, data) {
            if (err) return reject(err);
            resolve ({
                data,
                status: 200,
                contentType: 'image/jpeg',
            });
        })
    })
}

module.exports = {
    promisifiedReadDir,
    promisifiedReadFile
}
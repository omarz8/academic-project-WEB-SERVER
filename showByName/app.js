var http  = require("http")
var { promisifiedReadDir,promisifiedReadFile } = require ('./utils.js');

// Escribí acá tu servidor
http.createServer(function(req, res) {

promisifiedReadDir('./images')
.then(function(files) {
    const imagen = req.url.split('/').pop();
    const filteredImg = files.filter(img => img == imagen)[0];
    if (filteredImg) {
        return promisifiedReadFile(`./images/${filteredImg}`);
    }
    return Promise.resolve ({
        data: '<h1>No encontrado</h1>',
        status: 404,
        contentType: 'text/html'
    })
}).then(function(result) {
    res.writeHead(result.status, {'Content-Type': result.contentType});
    res.end(result.data);
}) 

//  res.end("Hola!!")
}).listen(4000, '127.0.0.1')
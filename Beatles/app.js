var http = require('http');
var fs   = require('fs');


var beatles=[{
  name: "John Lennon",
  birthdate: "09/10/1940",
  profilePic:"http://beatlephotoblog.com/photos/2013/05/132.jpg32.jpg"
},
{
  name: "Paul McCartney",
  birthdate: "18/06/1942",
  profilePic:"http://gazettereview.com/wp-content/uploads/2016/06/paul-mccartney.jpg"
},
{
  name: "George Harrison",
  birthdate: "25/02/1946",
  profilePic:"http://az616578.vo.msecnd.net/files/2016/03/09/635931448636931925-692833716_george-harrison-living-in-the-material-world-george-harrison-photo-credit-credit-robert-whitaker-c-apple-corps-ltd-courtesy-of-hbo.jpg"
},
{
  name: "Richard Starkey",
  birthdate: "07/08/1940",
  profilePic:"http://cp91279.biography.com/BIO_Bio-Shorts_0_Ringo-Starr_SF_HD_768x432-16x9.jpg"
}
]

function promisifiedReadFile (file) {
  return new Promise (function(resolve, reject) {
      fs.readFile(file, 'utf-8', function (err, data) {
          if (err) return reject(err);
          resolve (data);
      })
  })
}

var home= promisifiedReadFile('./index.html');

function parse(html, beatle) {
  html= html.replace ('{name}', beatle.name)
            .replace ('{birthdate}', beatle.birthdate)
            .replace ('{profilePic}', beatle.profilePic)
  return Promise.resolve(html)
}

http.createServer(function(req, res) {
  if(req.url === '/api') {
    res.writeHead(200, {'content-type':'application/json'})
    res.end(JSON.stringify(beatles))
  }
  if(req.url.substring(0,5) === '/api/' && req.url.length > 5) {
    const beatle = req.url.split('/').pop();
    const response = beatles.filter (el => encodeURI(el.name) === beatle)[0];

    if(!response){
      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.end('No es un Beatle')
      return;
    }
    res.writeHead(200, {'content-type':'application/json'})
    res.write(JSON.stringify(response))
  }
if (req.url === '/') {
  home.then(function(html) {
    res.writeHead (200, {'content-type': 'text/html'})
    res.end (html);
  })
}

if (req.url[0] === '/'){
  const beatle = req.url.split('/').pop();
    const response = beatles.filter (b => encodeURI(b.name) === beatle)[0];
    
    if(!response){
      res.writeHead(404, {'Content-Type': 'text/plain'})
      res.end('Este no es un Beatle')
      return;
  }
  promisifiedReadFile('./beatle.html')
  .then(function(html) {
    return parse(html, response)
  })
  .then (function(html) {
    res.writeHead (200, {'content-type': 'text/html'})
    res.end (html);
  })
} 

}).listen(1337, 'localhost')


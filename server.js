let http = require('http');

http.createServer((req, res) => {
    res.write("Estoy en vivo");
    res.end();
}).listen(8080);
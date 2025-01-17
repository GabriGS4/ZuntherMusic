var http = require('http');

http.createServer(function(req, res) {
    res.write("Estoy en vivo");
    res.end("Hola bots");
}).listen(8080);
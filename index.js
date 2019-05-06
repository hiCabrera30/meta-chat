var app = require('http').createServer(handler);
var fs = require('fs');
var chat = require('rs-chat')(app);
require('dotenv').config();


chat.init({
    host     : process.env.RS_SERVER_ADDRESS,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    assets   : 'assets/rs-chat',
    imagePath: '',
    storagePath: 'public',
    media: true,
    emoji: true,
});

app.listen(8080);
console.log('Server started at 8080');


function handler (req, res) {

    var filePath = '.' + req.url;
    console.log(filePath);
    
    if (filePath == './')
        filePath = './index.html';

  fs.readFile(filePath, function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}
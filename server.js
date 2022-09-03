const http = require('http'), // variable declarations
fs = require('fs'),
url = require('url');


http.createServer((request, response) => {
let addr = request.url, // gets URL from request argument
q = url.parse(addr, true); // parse URL stored on new addr variable
filePath = ''; // new empty variable declared, store path to file in empty string


if (q.pathname.includes('documentation')) {
  filePath = (__dirname + '/documentation.html');
} else {
  filePath = 'index.html'
} 
// if-else checks which exact pathname is entered in URL
// q(parsed URL) - using dot notation to access pathname of q
// includes - returns & seeing if it includes specific value or string 
// if includes 'documentation', pieces path together with _dirname & './documentation.html' in filePath(empty string)
// else - if does not include 'documentation', returns 'index.html'


fs.readFile(filePath, (err, data)=> {
    if(err){
      throw err;
    }
    response.writeHead(200, {'Content-Type' : 'text/html'});
    response.write(data);
    response.end();
  });


fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' 
+ new Date() + '\n\n', (err) => {
  if(err) {
    console.log(err);
  } else {
    console.log('Added to log');
  }
});


}).listen(8080);
console.log('Server test on Port 8080');
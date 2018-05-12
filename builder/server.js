const path = require('path');

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const Server = (options = { port: 9028, host: "localhost", routeDir: path.resolve('server') }) => {
  const public = path.join(options.routeDir, 'public');
  
  const cors = require('../utils/cors');
  const routes = require('../utils/app-route');
  
  const http = require('http');
  const app = express();

  app.use('/', express.static(public));

  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(cors);
  
  routes(app, options.routeDir);

  app.all('/*', (req, res) => res.sendFile('index.html', { root: public }));  

  return {
     start () {
      const server = http.createServer(app);
      server.listen(options.port, options.host)
        .on('listening', () => {
          const { port, address } = server.address();
          console.log(`Express server started on port ${port} at ${address}.`);   
        });  
     } 
  }
};

module.exports = Server;
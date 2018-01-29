const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { 
  appRootPath, 
  proxy, 
  getServerConfiguration, 
  cors,
  routes
} = require('./utils');

const Server = () => {
  const { createServer } = require('http');
  
  const serverConfig = getServerConfiguration(appRootPath('.devtools.json'));
  const config = Object.assign({ port: 9028, ip: '0.0.0.0', distRoot: 'dist', proxyServers: [] }, serverConfig);

  const appRootPathDist = appRootPath(config.distRoot);

  const app = express();

  app.use('/', express.static(appRootPathDist));

  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(cors);

  config.proxyServers.forEach(proxyServer => proxy(proxyServer, app));

  routes(app, appRootPath('routes'));

  app.all('/*', (req, res) => res.sendFile('index.html', { root: appRootPathDist }));  

  return {
    start () {
      const server = createServer(app);
      server.listen(config.port, config.ip)
        .on('listening', () => {
          const { port, address } = server.address();
          console.log(`Express server started on port ${port} at ${address}.`);   
        });  
    }
  }

} 

module.exports = Server;

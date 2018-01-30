const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { 
  appRootPath, 
  getServerConfiguration, 
  cors,
  routes,
  proxy
} = require('./utils');

const Server = () => {
  const { createServer } = require('http');

  const config = getServerConfiguration(appRootPath('.devtools.json'));
  const appRootPathDist = appRootPath(config.distRoot);
  
  const app = express();

  app.use('/', express.static(appRootPathDist));

  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(cors);

  if (config['staticFolders']){
    config.staticFolders.forEach(folder => {
      if (typeof(folder) === 'string'){
        app.use(`/${folder}`, express.static(appRootPath(folder)));
      } else {
        app.use(`/${folder.route}`, express.static(appRootPath(folder.path)));
      }
    });
  }

  config.proxyServers.forEach(proxyServer => proxy(proxyServer, app));

  routes(app, appRootPath('api'));

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

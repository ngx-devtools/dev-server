const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const { join, resolve } = require('path');

if (!(process.env.APP_ROOT_PATH)) process.env.APP_ROOT_PATH = resolve();

const appRootPath = (...paths) => join(process.env.APP_ROOT_PATH, ...paths);
const getServerConfiguration = require('./server-config');
const cors = require('./cors');
const routes = require('./app-route');
const proxy = require('./proxy'); 

const Server = () => {
  const { createServer } = require('http');

  const config = getServerConfiguration(appRootPath('.devtools.json'));

  const folderRoot = config.folders.find(folder => (folder['root'] && folder['root'] === true));
  const appRootPathDist = appRootPath(folderRoot.path);
  
  const app = express();

  app.use('/', express.static(appRootPathDist));

  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(cors);

  if (config['folders']){
    config.folders.forEach(folder => {
      if (typeof(folder) === 'string'){
        app.use(`/${folder}`, express.static(appRootPath(folder)));
      } else {
        app.use(`/${folder.route}`, express.static(appRootPath(folder.path)));
      }
    });
  }

  config.proxyServers.forEach(proxyServer => proxy(proxyServer, app));

  routes(app, appRootPath('server'));

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

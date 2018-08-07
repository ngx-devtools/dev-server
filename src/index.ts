import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import express, { Application } from 'express';

import { Proxy } from './proxy';
import { globFiles } from './file';
import { Process } from './process-argv';
import { ServerDefaultOptions, ServerOptions } from './server-options';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const verboseParams = [ '--verbose', '--verbose=true', '--verbose true' ];

if (!(process.env.APP_ROOT_PATH)) {
  process.env.APP_ROOT_PATH = resolve();
}

export class Server {

  private app: Application;
  private proxy: Proxy;

  private _options: ServerOptions = { ...ServerDefaultOptions }

  constructor(options?: ServerOptions) {
    (async function(self) {
      const argvPort = Process.getArgv('port', { default: self._options.port, type: 'number' });

      self._options = options || self._options;
      self._options.port = argvPort.port;
      
      self.app = express();
      self.proxy = new Proxy(self.app);
  
      if (Process.hasArgvs(verboseParams)) {
        self.app.use(morgan('dev')) 
      }

      self.app.use(self.corsHandler);  
    
      self.app.use('/', express.static(self.appRootPathDist));
      self.app.use(bodyParser.json());
  
      for (let i = 0; i < self.options.folders.length; i++) {
        self.addStaticFolder(self.options.folders[i]);
      }

      for (let i = 0; i < self.options.proxyServers.length; i++) {
        self.proxy.add(self.options.proxyServers[i]);
      }

      if (existsSync(join(process.env.APP_ROOT_PATH,  self.options.routeDir))) {
        const routeFiles = await globFiles(`${self.options.routeDir}/**/*.route.js`);
        for (let i = 0; i < routeFiles.length; i++) {
          self.app.use('/api', require(routeFiles[i]));
        }
      }
  
      self.app.all('/*', (req, res) => res.sendFile('index.html', { root: self.appRootPathDist }));  
    })(this)
  }

  private get appRootPathDist() {
    const folderRoot = this._options.folders.find(folder => (folder['root'] && folder['root'] === true));
    return this.appRootPath(folderRoot.path);
  }

  private appRootPath(...paths) {
    return join(process.env.APP_ROOT_PATH, ...paths);
  }

  private addStaticFolder(folder: any) {
    if (typeof(folder) === 'string'){
      this.app.use(`/${folder}`, express.static(this.appRootPath(folder)));
    } else {
      this.app.use(`/${folder.route}`, express.static(this.appRootPath(folder.path)));
    } 
  }

  get options() {
    return this._options;
  }

  corsHandler(req: any, res: any, next: any) {
    res.setHeader('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Authorization, Accept');
    next();
  }

  listen() {
    const server = createServer(this.app);
    server.listen(this.options.port, this.options.host)
      .on('listening', function(){
        const { port, address } = server.address() as AddressInfo;
        console.log(`Express server started on port ${port} at ${address}.`);   
      })
  }

}
import { join, resolve } from 'path';
import { existsSync } from 'fs';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import express, { Application } from 'express';

import { ProxyServer, Proxy } from 'proxy';
import { globFiles } from 'file';
import { Process } from 'process-argv';

const bodyParser = require('body-parser');
const morgan = require('morgan');

const verboseParams = [ '--verbose', '--verbose=true', '--verbose true' ];

interface StaticFolder {
  route: string;
  root?: boolean;
  path: string;
}

interface ServerOptions {
  port?: any;
  host?: string;
  proxyServers?: ProxyServer[];
  folders?: StaticFolder[];
  routeDir?: string;
}

if (!(process.env.APP_ROOT_PATH)) {
  process.env.APP_ROOT_PATH = resolve();
}

class Server {

  private app: Application;
  private proxy: Proxy;

  private static _options: ServerOptions = {
    port: Process.getArgv('port', { default: 4000, type: 'number' }), 
    host: 'localhost', 
    proxyServers: [], 
    folders: [
      { "route": "", "root": true, "path": "dist" },
      { "route": "dist", "path": "dist" },
      { "route": "node_modules", "path": "node_modules" }
    ],
    routeDir: 'server'
  }

  constructor(options?: ServerOptions) {
    (async function(self) {

      Server._options = options || Server._options;
      
      self.app = express();
      self.proxy = new Proxy(self.app);
  
      if (Process.hasArgvs(verboseParams)) {
        self.app.use(morgan('dev')) 
      }

      self.app.use(self.corsHandler);  
    
      self.app.use('/', express.static(self.appRootPathDist));
      self.app.use(bodyParser.json());
  
      for (let i = 0; i < Server._options.folders.length; i++) {
        self.addStaticFolder(Server._options.folders[i]);
      }

      for (let i = 0; i < Server._options.proxyServers.length; i++) {
        self.proxy.add(Server._options.proxyServers[i]);
      }

      if (existsSync(join(process.env.APP_ROOT_PATH, Server._options.routeDir))) {
        const routeFiles = await globFiles(`${Server._options.routeDir}/**/*.route.js`);
        for (let i = 0; i < routeFiles.length; i++) {
          self.app.use('/api', require(routeFiles[i]));
        }
      }
  
      self.app.all('/*', (req, res) => res.sendFile('index.html', { root: self.appRootPathDist }));  
    })(this)
  }

  private get appRootPathDist() {
    const folderRoot = Server._options.folders.find(folder => (folder['root'] && folder['root'] === true));
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
    return Server._options;
  }

  corsHandler(req: any, res: any, next: any) {
    res.setHeader('Access-Control-Allow-Origin', req.get('Origin') || '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Authorization, Accept');
    next();
  }

  listen() {
    const server = createServer(this.app);
    server.listen(Server._options.port, Server._options.host)
      .on('listening', function(){
        const { port, address } = server.address() as AddressInfo;
        console.log(`Express server started on port ${port} at ${address}.`);   
      })
  }

}

export { Server, StaticFolder, ServerOptions }
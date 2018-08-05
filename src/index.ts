import { join, resolve } from 'path';
import { createServer } from 'http';
import { AddressInfo } from 'net';
import express, { Application } from 'express';

import { ProxyServer, Proxy } from './proxy';
import { globFiles } from './file';

const bodyParser = require('body-parser');
const morgan = require('morgan');
const devServer = require('gulp-develop-server');
const opn = require('opn');

const verboseParams = [ '--verbose', '--verbose=true', '--verbose true' ];
const openBrowserParams = [ '--open', '--open=true', '--open true' ];

interface StaticFolder {
  route: string;
  root?: boolean;
  path: string;
}

interface DevServer {
  path: string;
  args: any;
}

interface ServerOptions {
  port?: number;
  host?: string;
  proxyServers?: ProxyServer[];
  folders?: StaticFolder[];
  routes?: string[];
}

const isProcess = (list) => {
  let result = false;
  const index = process.argv.findIndex(value => list.includes(value));
  const isBoolean = (process.argv[index + 1] === 'true' || process.argv[index + 1] === 'false');
  if (index >= 0) {
    if (isBoolean || process.argv[index + 1] !== 'false') result = true;
  }
  return result;
};

if (!(process.env.APP_ROOT_PATH)) {
  process.env.APP_ROOT_PATH = resolve();
}

class Server {

  private app: Application;
  private proxy: Proxy;

  private static _options: ServerOptions = {
    port: 4000, 
    host: 'localhost', 
    proxyServers: [], 
    folders: [
      { "route": "", "root": true, "path": "dist" },
      { "route": "dist", "path": "dist" },
      { "route": "node_modules", "path": "node_modules" }
    ],
    routes: [ 'server' ]
  }

  constructor(options?: ServerOptions) {
    (async function(self) {

      Server._options = options || Server._options;
      
      self.app = express();
      self.proxy = new Proxy(self.app);
  
      if (isProcess(verboseParams)) {
        self.app.use(morgan('dev')) 
      }

      self.app.use(self.corsHandler);  
    
      self.app.use('/', express.static(self.appRootPathDist));
      self.app.use(bodyParser.json());
  
      Server._options.folders.forEach(folder => self.addStaticFolder(folder));
  
      Server._options.proxyServers.forEach(proxyServer => self.proxy.add(proxyServer));
  
      const routeFiles = await globFiles(Server._options.routes.map(route => `${route}/**/*.route.js`));
      routeFiles.forEach(routeFile => self.app.use('/api', require(routeFile)));
  
      self.app.all('/*', (req, res) => res.sendFile('index.html', { root: self.appRootPathDist }));  
    })(this)
  }

  static async openBrowser(){
    return opn(`http://${Server._options.host}:${Server._options.port}`, {
      app: ['google chrome',  '--incognito']
    })
  }

  static async start(options?: DevServer){
    const _devServerOptions = options || { path: join(__dirname, 'start'), args: process.argv }
    return new Promise((resolve, reject) => {
      devServer.listen(_devServerOptions, error => {
        if (error) reject();
        resolve(devServer);
      });
    }).then(devServer => {
      return isProcess(openBrowserParams)
        ? Server.openBrowser().then(devServer => devServer)
        : Promise.resolve(devServer)
    });
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

export { Server, StaticFolder, ServerOptions, DevServer }
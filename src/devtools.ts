
import { existsSync } from 'fs';
import { join, resolve } from 'path';
import { ServerOptions } from './server-options';

if (!(process.env.APP_ROOT_PATH)) {
  process.env.APP_ROOT_PATH = resolve();
}

const DEVTOOLS_PATH = join(process.env.APP_ROOT_PATH, '.devtools.json');

const Devtools = {

  getServerConfig () {
    let serverConfig = {};
    if (existsSync(DEVTOOLS_PATH)) {
      const devtools = require(DEVTOOLS_PATH);
      if (devtools['server']) {
        serverConfig = { ...devtools.server }
      }
    }
    return serverConfig;
  },

  update(config: ServerOptions) {
    const options: ServerOptions = Devtools.getServerConfig();

    if (options.folders) {
      const _folders = options.folders.filter(folder => {
        return !(config.folders.find(_ => {
          return (_.path === folder.path && _.route === folder.route) 
         }));
       })
       _folders.forEach(folder => config.folders.push(folder));
    }

    if (options.proxyServers) {
      const _proxyServers = options.proxyServers.filter(proxyServer => {
        return !(config.proxyServers.find(_ => {
          return (_.route === proxyServer.route && _.target === proxyServer.target)
        }))
      })
      _proxyServers.forEach(proxyServer => config.proxyServers.push(proxyServer));
    }

  }


}

export { Devtools }

import { Browser, BrowserOptions } from 'browser';
import { join } from 'path';

import { Process } from './process-argv';
import { ServerDefaultOptions } from './server-options';

const server = require('gulp-develop-server');

interface BootstrapOptions {
  path: string;
  args: any;
}

const openBrowserParams = [ '--open', '--open=true', '--open true' ];

class DevServer {

  static async start(options?: BootstrapOptions) {
    const _options = options || { path: join(__dirname, 'start'), args: process.argv }
    return new Promise((resolve, reject) => {
      server.listen(_options, error => {
        if (error) reject();
        resolve(server);
      }) 
    }).then(server => {
      const argv = Process.getArgv('port', { default: ServerDefaultOptions.port, type: 'number' });
      const browserOptions: BrowserOptions = {
        host: ServerDefaultOptions.host,
        port: argv.port
      }
      return Process.hasArgvs(openBrowserParams)
        ? Browser.open(browserOptions).then(devServer => server)
        : Promise.resolve(server);
    });
  } 

  static async onServerFileChanged(file: string) {
    return new Promise((resolve, reject) => {
      server.changed(error => {
        if (error) reject();
        resolve(file);
      });
    });
  }
  
}

export { BootstrapOptions, DevServer }
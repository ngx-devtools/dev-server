
import { Browser, BrowserOptions } from 'browser';
import { join } from 'path';

import { Process } from './process-argv';

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
      const browserOptions: BrowserOptions = {
        host: 'localhost',
        port: Process.getArgv('port', { default: 4000, type: 'number' })
      }
      return Process.hasArgvs(openBrowserParams)
        ? Browser.open(browserOptions).then(devServer => server)
        : Promise.resolve(server);
    });
  } 
  
}



export { BootstrapOptions, DevServer }
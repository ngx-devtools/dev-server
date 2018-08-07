
const opn = require('opn');

export interface BrowserOptions {
  port: any;
  host: string;
}

export class Browser {

  static open(options: BrowserOptions){
    return opn(`http://${options.host}:${options.port}`, {
      app: [Browser.chrome,  '--incognito'], wait: false
    })
  }

  static get chrome(){
    let chrome = 'google chrome';
    switch (process.platform) {
      case 'win32': 
        chrome = 'chrome'; break;
      case 'linux': 
        chrome = 'google-chrome'; break;
    }
    return chrome;
  }

}

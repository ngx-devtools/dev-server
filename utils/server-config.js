
module.exports = (devToolsPath) => {
  let serverConfig = {};
  if (require('fs').existsSync(devToolsPath)) {
    const devTools = require(devToolsPath);
    if (devTools.hasOwnProperty('server')) {
      serverConfig = Object.assign({}, devTools.server);
    }
  } 
  const defaultConfig = { 
    port: 4000, 
    ip: '0.0.0.0', 
    distRoot: 'dist', 
    proxyServers: [], 
  };
  return Object.assign(defaultConfig, serverConfig);;
};



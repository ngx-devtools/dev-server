
module.exports = (devToolsPath) => {
  let serverConfig = {};
  if (require('fs').existsSync(devToolsPath)) {
    const devTools = require(devToolsPath);
    if (devTools.hasOwnProperty('server')) {
      serverConfig = Object.assign({}, devTools.server);
    }
  } 
  return serverConfig;
};



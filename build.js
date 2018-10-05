const { ngxBuild, writeFileAsync } =  require('@ngx-devtools/common');
const { getRollupConfig } = require('./rollup.config');

(async function(){
  const PKG_NAME = 'server';

  const startContents = [
    `const { Server } = require('./server');`,
    `const server = new Server();`,
    `server.listen();`
  ]

  await ngxBuild(PKG_NAME, getRollupConfig())
  await writeFileAsync('dist/start.js', startContents.join('\n')) 
})();
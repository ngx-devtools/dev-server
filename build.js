const { createRollupConfig, ngxBuild , mkdirp, writeFileAsync } =  require('@ngx-devtools/common');

(async function(){
  const PKG_NAME = 'server';
  const ENTRY_FILE = `.tmp/${PKG_NAME}.ts`;

  const startContents = [
    `const { Server } = require('./server');`,
    `const server = new Server();`,
    `server.listen();`
  ]

  await mkdirp('dist');

  const rollupConfig = createRollupConfig({ 
    input: ENTRY_FILE, 
    tsconfig: '.tmp/tsconfig.json',
    overrideExternal: true,
    external: [
      'request',
      'express',
      'morgan',
      'body-parser',
      'http',
      'minimatch',
      'fs',
      'util',
      'path',
      'net'
    ],
    output: {
      file: `dist/${PKG_NAME}.js`, 
      format: 'cjs'
    }
  })
  
  await Promise.all([ 
    ngxBuild(PKG_NAME, rollupConfig), 
    writeFileAsync('dist/start.js', startContents.join('\n')) 
  ])
})();
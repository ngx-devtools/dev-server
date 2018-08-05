const { buildCopyPackageFile, rollupBuild, createRollupConfig, clean, mkdirp, writeFileAsync } =  require('@ngx-devtools/common');

(async function(){
  const PKG_NAME = 'server';

  const startContents = [
    `const { Server } = require('./server');`,
    `const server = new Server();`,
    `server.listen();`
  ]

  const writeStartFile = () => {
    mkdirp('dist');
    return writeFileAsync('dist/start.js', startContents.join('\n'));
  }

  const rollupConfig = createRollupConfig({ 
    input: `src/${PKG_NAME}.ts`, 
    tsconfig: 'src/tsconfig.json',
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
  
  Promise.all([ clean('dist') ]).then(() => {
    return Promise.all([ buildCopyPackageFile(PKG_NAME), rollupBuild(rollupConfig), writeStartFile() ])
  });
})();
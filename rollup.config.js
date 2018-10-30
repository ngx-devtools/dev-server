const { createRollupConfig } = require('@ngx-devtools/common');

const getRollupConfig = (options = {}) => {
  const PKG_NAME = 'server';
  const rollupOptions = { 
    input: `.tmp/${PKG_NAME}.ts`, 
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
      'net',
      'url',
      'mime'
    ],
    output: {
      file: `dist/${PKG_NAME}.js`, 
      format: 'cjs'
    }
  }
  return createRollupConfig({ ...rollupOptions, ...options });
}

exports.getRollupConfig = getRollupConfig;
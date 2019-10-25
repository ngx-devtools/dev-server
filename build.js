const { ngxBuild } =  require('@ngx-devtools/common');
const { getRollupConfig } = require('./rollup.config');
const { onAfterBuild } = require('./build-after');

(async function(){
  const PKG_NAME = 'server';
  
  await ngxBuild(PKG_NAME, getRollupConfig())
  await onAfterBuild()
})();
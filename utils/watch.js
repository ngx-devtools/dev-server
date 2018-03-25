const livereload = require('gulp-livereload');
const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar')

const { globSync }= require('./glob');

const serverReloads = [ 
  '--server-reload', 
  '--server-reload=true', 
  '--server-reload true' 
];

const watchFiles = () => {
  let watchFiles = [ path.resolve('api') ];
  const devToolsPath = path.resolve('.devtools.json');
  if (fs.existsSync(devToolsPath)) {
    const devTools = require(devToolsPath);
    const hasProperty = (devTools['server'] && devTools.server['watchFiles']);
    if (hasProperty && Array.isArray(devTools.server.watchFiles)) {
      devTools.server.watchFiles.forEach(files => {
        if (typeof(files) === 'string') {
          watchFiles.push(files)
        } else {
          watchFiles = watchFiles.concat(globSync(files.dir, files.includes));
        }
      });
    }
  }
  return watchFiles;
};

const liveReload = file => {
  const index = process.argv.findIndex(reload => serverReloads.includes(reload));
  const isBoolean = (process.argv[index + 1] === 'true' || process.argv[index + 1] === 'false');
  if (index >= 0) {
    if (isBoolean || process.argv[index + 1] !== 'false') livereload.changed(file);
  }
};

const watch = server => {
  let isReady = false;

  const files = watchFiles();

  const onFileChanged = file => {
    return new Promise((resolve, reject) => {
      server.changed(error => {
        if (error) reject();
        liveReload(file); resolve();
      });
    }).catch(error => console.log(error));
  };

  chokidar.watch(files)
    .on('ready', () => { isReady = true; })
    .on('all', (event, path) => {
      if (isReady) {  
        switch(event) {
          case 'add':
          case 'change':
            onFileChanged(path); 
          break;
        }
      }
    });
};

module.exports = watch;

const chokidar = require('chokidar');
const livereload = require('gulp-livereload');

const injectLiveReload = require('./inject-livereload');
const isProcess = require('./to-process');

const liveReloadParams = [ 
  '--livereload', 
  '--livereload=true', 
  '--livereload true' 
], 
watchParams = [
  '--watch',
  '--watch=true',
  '--watch true'
];

let isReady = false;

const watchReady = () => {
  isReady = true;
  console.log('> Initial scan complete. Ready for changes.'); 
};

const WATCH_EVENT = {
  ADD: 'add',
  CHANGE: 'change',
  DELETE: 'unlink',
  READY: 'ready'
};

const reloadPage = (file) => {
  if (isProcess(liveReloadParams)) livereload.changed(file);
  return Promise.resolve();
};

const watcher = (server) => {
  const onServerFileChanged = (file) => {
    return new Promise((resolve, reject) => {
      server.changed(error => {
        if (error) reject();
        resolve();
      });
    })
    .then(() => reloadPage(file))
    .catch(error => console.log(error));
  };

  const onClientFileChanged = (file) => {
    try {
      const build = require('@ngx-devtools/build');
      return build.onClientFileChanged(file)
        .then(file => reloadPage(file))
        .catch(error => console.log(error));
    } catch(e) {
      console.log(e);
    }
  };
  
  chokidar.watch('.', { ignored: ['node_modules', 'dist', '.git'] })
    .on(WATCH_EVENT.READY, watchReady)
    .on('all', (event, path) => {
      if (isReady){
        switch(event) {
          case WATCH_EVENT.ADD:
          case WATCH_EVENT.CHANGE: 
            if (path.includes('src')) {
              onClientFileChanged(path);
            } else {
              onServerFileChanged(path);
            }         
            break;
          case WATCH_EVENT.DELETE:
            console.log(`> ${event}: ${path}.`); break;
        }
      } 
    });
};

const watch = (server) => {
  watcher(server); return Promise.resolve();
};

const liveReload = () => {
  const injectReload = () => injectLiveReload().then(() => {
    livereload.listen();
    return Promise.resolve();
  });
  return isProcess(liveReloadParams) ? injectReload() : Promise.resolve();
};

const watchLiveReload = (server) => {
  return (isProcess(watchParams)) ? Promise.all([ liveReload(), watch(server) ]) : Promise.resolve();
};

module.exports = watchLiveReload;
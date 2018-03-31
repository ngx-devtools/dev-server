const chokidar = require('chokidar');
const livereload = require('gulp-livereload');

const injectLiveReload = require('./inject-livereload');
const isProcess = require('./to-process');

const liveReloadParams = [ 
  '--livereload', 
  '--livereload=true', 
  '--livereload true' 
];

let isReady = false;

const log = (event, path) => console.log(`> ${event}: ${path}.`);

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
    console.log('hey')
    return new Promise((resolve, reject) => {
      server.changed(error => {
        if (error) reject();
        resolve();
      });
    })
    .then(() => reloadPage(file))
    .catch(error => console.log(error));
  };

  const onClientChanged = (event, file) => {
    try {
      const build = require('@ngx-devtools/build');
      return build.onClientChanged(event, file)
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
              console.log('Client');
              onClientChanged(event, path);
            } else {
              console.log('Server');
              onServerFileChanged(path);
            }         
            break;
          case WATCH_EVENT.DELETE:
            log(event, path); break;
        }
      } 
    });
};

const watchLiveReload = (server) => {
  const liveReload = isProcess(liveReloadParams) ? injectLiveReload : Promise.resolve;
  const watch = (server) => { watcher(server); return Promise.resolve(); }
  return Promise.all([ liveReload(), watch(server)  ]);
};

module.exports = watchLiveReload;
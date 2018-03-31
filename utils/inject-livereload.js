const path = require('path');
const fs = require('fs');
const livereload = require('gulp-livereload');

const promisify = require('util').promisify;

const injectLiveReload = () => {
  const defaults = {
    port: 35729,
    host: 'http://\' + (location.host || "localhost").split(":")[0] + \'',
    script: 'livereload.js',
    snipver: 1
  },
  template = opts => {
    const scriptSrc = opts.host + ':' + opts.port + '/' + opts.script + '?snipver=' + opts.snipver;
    return '\n<script>document.write(\'<script src="' + scriptSrc + '"></\' + \'script>\');</script>';
  };
  const file = path.resolve('dist', 'index.html');

  const readFileAsync = promisify(fs.readFile);
  const writeFileAsync = promisify(fs.writeFile);
  
  return new Promise((resolve, reject) => {
    if (!(fs.existsSync(file))) reject();
    resolve();
  })
  .then(() => readFileAsync(file))
  .then(fileBuffer => {
    const contents = fileBuffer.toString('utf8').replace('<!-- livereaload -->', template(defaults))
    return writeFileAsync(file, contents);
  })
  .then(() => {
    livereload.listen();
    return Promise.resolve();
  });
};

module.exports = injectLiveReload;
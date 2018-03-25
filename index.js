const server = require('gulp-develop-server');
const path = require('path');

const watch = require('./utils/watch');

const serverWatch = [ 
  '--server-watch', 
  '--server-watch=true', 
  '--server-watch true' 
];

const serveWatch = server => {
  const index = process.argv.findIndex(_watch => serverWatch.includes(_watch));
  const isBoolean = (process.argv[index + 1] === 'true' || process.argv[index + 1] === 'false');
  if (index >= 0) {
    if (isBoolean || process.argv[index + 1] !== 'false') watch(server);
  }
  return Promise.resolve(server);
};

const serverStart = () => {
  return new Promise((resolve, reject) => {
    server.listen({ path: path.join(__dirname, 'utils', 'start.js') },
    error => {
      if (error) reject();
      resolve(server);
    });
  });
};

exports.serverStart = () => serverStart().then(server => serveWatch(server));
const server = require('gulp-develop-server');

const { join } = require('path');
const { watcher } = require('./utils');

const serverStart = () => {
  return new Promise((resolve, reject) => {
    server.listen({ path: join(__dirname, 'utils', 'start.js') },
    error => {
      if (error) reject();
      resolve(server);
    });
  });
};

exports.serverStart = () => Promise.all([ serverStart(), watcher(server) ]);
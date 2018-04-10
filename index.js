const server = require('gulp-develop-server');

const { join } = require('path');
const { onServiceFileChanged } = require('./utils');

const serverStart = () => {
  return new Promise((resolve, reject) => {
    server.listen({ path: join(__dirname, 'utils', 'start.js') },
    error => {
      if (error) reject();
      resolve(server);
    });
  });
};

exports.serverStart = async () => await serverStart();
exports.onServerFileChanged = async (file) => await onServiceFileChanged(server, file);
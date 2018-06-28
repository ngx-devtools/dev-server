const server = require('gulp-develop-server');

const { join } = require('path');
const { onServerFileChanged } = require('./utils');
const { ROUTE_METHOD, RouterFactory } = require('./builder');

const serverStart = (options = { path: join(__dirname, 'utils', 'start.js'), args: process.argv }) => {
  return new Promise((resolve, reject) => {
    server.listen(options, error => {
      if (error) reject();
      resolve(server);
    });
  });
};

exports.onServerFileChanged = file => onServerFileChanged(server, file);

exports.serverStart = serverStart
exports.ROUTE_METHOD = ROUTE_METHOD;
exports.RouterFactory = RouterFactory;
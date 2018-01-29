
const { join, resolve } = require('path');

if (!(process.env.APP_ROOT_PATH)) process.env.APP_ROOT_PATH = resolve();

exports.appRootPath = (...paths) => join(process.env.APP_ROOT_PATH, paths);
exports.proxy = require('./proxy'); 
exports.getServerConfiguration = require('./server-config');
exports.cors = require('./cors');
exports.routes = require('./app-route');
module.exports = (app, routeDir) => {
  const routeFiles = require('glob').sync(routeDir + '/*.js');
  if (routeFiles) routeFiles.forEach(file => app.use('/api', require(file)));
};
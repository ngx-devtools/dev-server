module.exports = (app, routeDir) => {
  const routeFiles = require('./glob').globSync(routeDir, [ '.js' ]);
  if (routeFiles) routeFiles.forEach(file => app.use('/api', require(file)));
};
module.exports = (app, routeDir) => {
  const routeFiles = require('./glob').globSync(routeDir, [ '.js' ]).filter(file => file.includes('.route.js'));
  if (routeFiles) routeFiles.forEach(file => app.use('/api', require(file)));
};
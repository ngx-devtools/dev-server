const path = require('path');

const onServerFileChanged = (server, file) => {
  return new Promise((resolve, reject) => {
    server.changed(error => {
      if (error) reject();
      resolve();
    });
  });
};

module.exports = (server, file) => { 
  const config = require('./server-config')(path.resolve('.devtools.json'));
  return (file && !(file.includes('src'))) ? onServerFileChanged(server, file) : Promise.resolve();
};
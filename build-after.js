const { writeFileAsync } = require('@ngx-devtools/common');
const { join } = require('path');

const onAfterBuild = (options = {}) => {
  const filePath = join(process.env.APP_ROOT_PATH, 'dist', 'start.js');
  const startContents = [
    `const { Server } = require('./server');`,
    `const server = new Server();`,
    `server.listen();`
  ]
  return writeFileAsync(filePath, startContents.join('\n'));
}

exports.onAfterBuild = onAfterBuild;
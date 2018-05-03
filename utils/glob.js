const fs = require('fs');
const path = require('path');

const walk = (dir, includes = []) => {
  let results = [];
  const rootDir = path.resolve(dir);
  const files = fs.readdirSync(rootDir);
  files.forEach(list => {
    list = path.join(rootDir, list)
    const stat = fs.statSync(list);
    if (stat.isDirectory()) {
      results = results.concat(walk(list, includes));
    } 
    if (stat.isFile()) {
      if (includes.length <= 0) { 
        results.push(list);
      } else if (includes.includes(path.extname(list))) {
        results.push(list); 
      }
    }
  });
  return results;
};

exports.globSync = (dir, includes = []) => {
  if (!(fs.existsSync(path.resolve(dir)))) return [];
  return walk(dir, includes);
};
exports.globAsync = (dir, includes = []) => {
  return Promise.resolve(walk(dir, includes));
};
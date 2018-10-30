import { readdir, stat } from 'fs';
import { promisify } from 'util';
import { resolve, join, sep, dirname, basename } from 'path';

const minimatch = require('minimatch');

interface GlobFileOptions {
  dir: string;
  isRecursive: boolean;
  pattern: string;
}

const readdirAsync = promisify(readdir);
const statAsync = promisify(stat);

async function globFiles(src: string | string[]): Promise<string[]> {
  const files = Array.isArray(src) ? src : [ src ];
  return Promise.all(files.map(file => {
    const options: GlobFileOptions = {
      dir: dirname(resolve(file).replace(sep + '**', '')),
      isRecursive: file.includes('**'),
      pattern: basename(file)
    }
    return walkAsync(options);
  }))
  .then(results => results.join(',').split(','));
}

async function walkAsync(options: GlobFileOptions): Promise<string[]> {
  const rootDir = resolve(options.dir);
  return readdirAsync(options.dir)
    .then(contents => {
      return Promise.all(contents.map(content => {
        const result = join(rootDir, content)
        return statAsync(result)
          .then(async data => {
            const files: string[] = [];
            if (data.isDirectory() && options.isRecursive) {
              const values = await walkAsync({
                dir: result,
                isRecursive: options.isRecursive,
                pattern: options.pattern
              });
              for (let i = 0; i < values.length; i++) {
                files.push(values[i]);
              }
            }
            if (data.isFile()) {
              if (minimatch(basename(result), options.pattern)) {
                files.push(result);
              }
            }
            return files;
          })
      }))
      .then(dirs => dirs.join(',').split(','))
      .then(dirs => dirs.filter(dir => dir))
    })
}

export { walkAsync, globFiles, GlobFileOptions }

interface ArgvOptions {
  default?: any;
  type?: string;
}

class Process {
    
  static hasArgvs(list): boolean {
    let result = false;
    const index = process.argv.findIndex(value => list.includes(value));
    const isBoolean = (process.argv[index + 1] === 'true' || process.argv[index + 1] === 'false');
    if (index >= 0) {
      if (isBoolean || process.argv[index + 1] !== 'false') result = true;
    }
    return result;
  }

  static getArgv(argvParameter: string, options?: ArgvOptions) {
    let result = { [argvParameter]: options.default };
    const index = process.argv.findIndex(value => `--${argvParameter}` === value);
    if (index >= 0) {
      const value = process.argv[index + 1];
      if (value && !value.includes('--')) {
        result = {
          [argvParameter]: options.type ? ((options.type === 'number') ? parseInt(value): value): value
        }
      }
    }
    return result;
  }

}

export { ArgvOptions, Process }
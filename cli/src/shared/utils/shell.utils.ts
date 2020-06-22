import * as shell from 'shelljs';

shell.config.silent = true;

const cache: Record<string, shell.ShellReturnValue> = {};

// TODO: staging directory
// TODO: rename
export function execWithCache(
  command: string,
  { noCache = false } = {}
): shell.ShellReturnValue {
  if (!noCache && cache[command]) {
    return cache[command];
  }

  const output = shell.exec(command);

  if (!noCache) {
    cache[command] = output;
  }

  return output;
}

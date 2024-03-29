import { color } from '../utils';
import packageJson from '../../../package.json';

const startingTextByCommand: Record<CLI.Workspaces.Command, string> = {
  build: 'Compiling',
  lint: 'Linting',
  watch: 'Start watching',
  test: 'Testing'
};

const finishingTextByCommand: Record<CLI.Workspaces.Command, string> = {
  build: 'Compiled',
  lint: 'Linted',
  watch: 'Finished watching',
  test: 'Tested'
};

const testTextByCommand: Record<CLI.Workspaces.Command, string> = {
  build: 'build',
  watch: 'build',
  lint: 'lint',
  test: 'test'
};

export const workspacesMessage = {
  introduce: () => color.underline(`${packageJson.name} v${packageJson.version}`),
  running: (name: string) => color.details(`Running ${name}`),

  started: (cmd: CLI.Workspaces.Command) => `
${color.info(`${startingTextByCommand[cmd]} modules...`)}`,
  finished: (cmd: CLI.Workspaces.Command, name: string) => color.success(`${finishingTextByCommand[cmd]} ${name}`),

  failed: (cmd: CLI.Workspaces.Command) => color.error(`Failed to ${testTextByCommand[cmd]} workspaces`),

  successful: ([s, ms]: [number, number]) =>
    color.success('Done in ') + color.highlight(`${s}.${ms.toString().slice(0, 3)}s.`)
} as const;

import { Sade } from 'sade';
import execa from 'execa';
import path from 'path';

import { workspacesMessage } from '../../shared/messages';
import { convertStringArrayIntoMap, clearConsole, logError, space } from '../../shared/utils';
import { exposeWorkspaceInfo, withExcludedPackages } from './workspaces.helpers';
import packageJson from '../../../package.json';

export function workspacesTestBinCommand(prog: Sade): void {
  prog
    .command('workspaces test')
    .describe('Test all workspaces.')
    .example('workspaces test')
    .alias('wt')
    .option('exclude', 'Exclude specific workspaces', '')
    .example('workspaces test --exclude workspace1,workspace2,workspace3')
    .action(async ({ exclude }: CLI.Options.Workspaces) => {
      const { chunks, packagesLocationMap } = await exposeWorkspaceInfo();
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(workspacesMessage.introduce());
      console.log(workspacesMessage.started('test'));

      try {
        space();

        const time = process.hrtime();

        for (const chunk of chunks) {
          for (const name of withExcludedPackages(chunk, excluded)) {
            space();
            console.log(workspacesMessage.running(name));

            await execa('node', [path.resolve(__dirname, '..'), 'test', '--passWithNoTests'], {
              cwd: packagesLocationMap[name],
              stdio: 'inherit'
            });

            console.log(workspacesMessage.finished('test', name));
          }
        }

        space();

        const duration = process.hrtime(time);
        console.log(workspacesMessage.successful(duration));
        space();
      } catch (error) {
        console.log(workspacesMessage.failed('test'));
        logError(error as Error);
        process.exit(1);
      }
    });
}

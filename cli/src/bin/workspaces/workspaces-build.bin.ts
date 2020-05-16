import { Sade } from 'sade';
import execa from 'execa';
import { cpus } from 'os';
import pLimit from 'p-limit';

import { WorkspacesMessages } from '../../shared/messages/workspaces.messages';
import {
  getWorkspacesInfo,
  splitWorkspacesIntoDependencyGraph,
  readWorkspacePackages,
  error,
  clearConsole,
  logError,
  space
} from '../../shared/utils';
import { convertStringArrayIntoMap } from '../../shared/utils/dataStructures.utils';
import packageJson from '../../../package.json';

export function workspacesBuildBinCommand(prog: Sade): void {
  prog
    .command('workspaces build')
    .describe('Build each workspace')
    .example('workspaces build')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('wb')
    .option(
      'q, quiet',
      'Do not print any information about builds that are in the process',
      false
    )
    .example('workspaces build --quiet')
    .option('e, exclude', 'Exclude specific workspaces')
    .example('workspaces build --exclude  workspace1,workspace2,workspace3')
    .action(async ({ quiet, exclude }: CLI.Options.Workspaces) => {
      const {
        introduce,
        started,
        finished,
        failed,
        successful,
        running
      } = new WorkspacesMessages();
      const jobs = Math.max(1, cpus().length / 2);
      const limit = pLimit(jobs);
      const packagesInfo = await getWorkspacesInfo();
      const packagesLocationMap = Object.fromEntries(
        packagesInfo.map(({ name, location }) => [name, location])
      );
      const packageJsons = await readWorkspacePackages(packagesInfo);
      const { chunks, unprocessed } = splitWorkspacesIntoDependencyGraph(
        packageJsons
      );
      const ags = ['build'];
      const excluded = convertStringArrayIntoMap(exclude);
      excluded.set(packageJson.name, true);

      clearConsole();
      console.log(introduce());
      console.log(started('build'));

      if (!quiet) {
        space();
      }

      try {
        const time = process.hrtime();
        for (const chunk of chunks) {
          await Promise.all(
            chunk.map(async name =>
              limit(async () => {
                if (excluded.has(name)) {
                  return;
                }

                if (!quiet) {
                  console.log(running(name));
                }

                await execa('re-space', ags, {
                  cwd: packagesLocationMap[name]
                });

                if (!quiet) {
                  console.log(finished('build', name));
                }
              })
            )
          );
        }

        const duration = process.hrtime(time);

        if (!quiet) {
          space();
        }

        console.log(successful(duration));
        space();
      } catch (error) {
        console.log(failed());
        logError(error);
      }

      if (unprocessed.length > 0) {
        console.log(
          error(`Potentially circular dependency
      Please check the following packages attentively:
      ${unprocessed.map(
        ([name, dependencies]) =>
          `   ${name}  =>  ${dependencies?.join(', ') ?? ''}`
      ).join(`
      `)}
      `)
        );
      }
    });
}

import { Sade } from 'sade';
import execa from 'execa';

import { findWorkspaceRootDir } from '../../shared/utils';
import { finished } from './submodules.helpers';

export function submodulesFetchBinCommand(prog: Sade): void {
  prog
    .command('submodules fetch')
    .describe('Fetch each submodule')
    .example('submodules fetch')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sf')
    .option('s, self', 'Apply fetch for the host workspace')
    .example('submodules fetch --self')
    .action(async ({ self }: CLI.Options.Submodules) => {
      const workspaceRootPath = await findWorkspaceRootDir();
      const cmd = 'fetch';

      const { exitCode: submodulesExitCode } = await execa(
        'git',
        ['submodule', 'foreach', 'git', cmd, '--all'],
        {
          cwd: workspaceRootPath,
          stdio: [process.stdin, process.stdout, process.stderr]
        }
      );

      console.log(
        finished({
          cmd,
          code: submodulesExitCode,
          type: 'submodules'
        })
      );

      if (self) {
        console.log(`
Entering 'core'`);
        const { exitCode: coreExitCode } = await execa('git', [cmd, '--all'], {
          stdio: [process.stdin, process.stdout, process.stderr],
          cwd: workspaceRootPath
        });
        console.log(
          finished({
            cmd,
            code: coreExitCode,
            type: 'core'
          })
        );
      }
    });
}

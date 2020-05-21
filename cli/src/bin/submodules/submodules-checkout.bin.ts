import { Sade } from 'sade';

import { findWorkspaceRootDir, space } from '../../shared/utils';
import { getSubmodulesLocations } from '../../shared/utils/submodules.utils';
import { smartGitCheckout } from './submodules-checkout.helpers';
import { submodulesMessage } from '../../shared/messages/submodules.messages';

export function submodulesCheckoutBinCommand(prog: Sade): void {
  prog
    .command('submodules checkout <branch>')
    .describe('Checkout each submodule on the specific branch')
    .example('submodules checkout branch-name')
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    .alias('sc')
    .option('s, self', 'Apply checkout for the host workspace')
    .example('submodules checkout branch-name --self')
    .action(async (branch: string, { self }: CLI.Options.Submodules) => {
      const rootDir = await findWorkspaceRootDir();
      const locations = await getSubmodulesLocations();

      for (const location of locations) {
        console.log(submodulesMessage.entering(location));
        await smartGitCheckout({ rootDir, repoDir: location, branch });
        space();
      }

      if (self) {
        console.log(submodulesMessage.entering('host'));
        await smartGitCheckout({ rootDir, branch });
        space();
      }
    });
}

import { Sade } from 'sade';

import { getSubmodulesLocations, findHostDirectory, space } from '../../shared/utils';
import { submodulesMessage } from '../../shared/messages';
import { smartGitCheckout } from './submodules-checkout.helpers';

export function submodulesCheckoutBinCommand(prog: Sade): void {
  prog
    .command('submodules checkout <branch>')
    .describe('Checkout all submodules on the specific branch.')
    .example('submodules checkout branch-name')
    .alias('sc')
    .option('s, self', 'Apply checkout for the host workspace')
    .example('submodules checkout branch-name --self')
    .action(async (branch: string, { self }: CLI.Options.Submodules) => {
      const rootDir = await findHostDirectory();
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

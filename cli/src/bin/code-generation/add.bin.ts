import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import { featureSetup } from '../../setup/add';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { FeatureMessages } from '../../shared/messages';
import { findWorkspacePackageDir, logError } from '../../shared/utils';
import { validateFeatureOption } from './add.helpers';

const featureOptions = Object.keys(featureSetup);

export const addBinCommand = (prog: Sade) => {
  prog
    .command('add [featureName]')
    .describe(
      `Add available feature.
  Currently available choices: [${featureOptions.join(', ')}]`
    )
    .example('add')
    .example('add playground')
    .action(async (featureName: string = '') => {
      const {
        failed,
        successful,
        adding,
        exists,
        invalidFeatureName
      } = new FeatureMessages();

      const featureOption: CLI.Setup.AddOptionType = await validateFeatureOption(
        featureName,
        featureOptions,
        () => console.log(invalidFeatureName(featureOption))
      );
      const packageDir = await findWorkspacePackageDir();
      const packageJsonPath = path.resolve(packageDir, PACKAGE_JSON);
      const packageJson = (await fs.readJSON(
        packageJsonPath
      )) as CLI.Package.WorkspacePackageJSON;

      const bootSpinner = ora(adding(featureOption));
      bootSpinner.start();

      try {
        await fs.copy(
          path.resolve(__dirname, `../../../../templates/add/${featureOption}`),
          path.resolve(packageDir, featureSetup[featureOption].path),
          { overwrite: false, errorOnExist: true }
        );

        await fs.outputJSON(
          packageJsonPath,
          {
            ...packageJson,
            scripts: {
              ...packageJson.scripts,
              ...featureSetup[featureOption].scripts
            }
          },
          { spaces: 2 }
        );
        bootSpinner.succeed(successful(featureOption));
      } catch (err) {
        bootSpinner.fail(failed(featureOption));

        if (err.toString().includes('already exists')) {
          console.log(exists());
        }

        logError(err);
        process.exit(1);
      }
    });
};

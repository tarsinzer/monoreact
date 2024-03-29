import { Sade } from 'sade';
import path from 'path';
import ora from 'ora';
import fs from 'fs-extra';

import { featureSetup } from './setup/add';
import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { addMessage } from '../../shared/messages';
import { findPackageDirectory, logError } from '../../shared/utils';
import { addFeatureScriptsToPackageJson, copyFeatureTemplate, validateFeatureOption } from './add.helpers';

const featureOptions = Object.keys(featureSetup);

export const addBinCommand = (prog: Sade): void => {
  prog
    .command('add [featureName]')
    .describe(`Embed ready-made feature [${featureOptions.join(', ')}].`)
    .example('add')
    .example('add playground')
    .action(async (featureName = '') => {
      const featureOption: CLI.Setup.AddOptionType = await validateFeatureOption(featureName, featureOptions, () =>
        console.log(addMessage.invalidFeatureName(featureOption))
      );
      const packageDir = await findPackageDirectory();
      const packageJsonPath = path.resolve(packageDir, PACKAGE_JSON);
      const packageJson = (await fs.readJSON(packageJsonPath)) as CLI.Package.PackagePackageJSON;

      const bootSpinner = ora(addMessage.adding(featureOption));
      bootSpinner.start();

      try {
        await copyFeatureTemplate(packageDir, featureOption);
        await addFeatureScriptsToPackageJson({
          dir: packageJsonPath,
          packageJson,
          option: featureOption
        });
        bootSpinner.succeed(addMessage.successful(featureOption));
      } catch (error) {
        bootSpinner.fail(addMessage.failed(featureOption));

        if ((error as Error).toString().includes('already exists')) {
          console.log(addMessage.exists());
        }

        logError(error as Error);
        process.exit(1);
      }
    });
};

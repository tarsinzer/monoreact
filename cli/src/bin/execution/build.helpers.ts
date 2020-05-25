import { rollup } from 'rollup';

import { createBuildConfig } from './configs/build.config';
import { cleanDistFolder } from '../../shared/utils';
import { buildMessage } from '../../shared/messages';
import { readPackageJson, readTsconfigJson } from '../../shared/utils/fs.utils';

export const buildWorkspace = async (dir: string) => {
  const tsconfigJson = await readTsconfigJson(dir);
  const packageJson = await readPackageJson<CLI.Package.WorkspacePackageJSON>(
    dir
  );
  await cleanDistFolder();

  const time = process.hrtime();
  const buildConfig = createBuildConfig({
    tsconfigJson,
    packageJson,
    displayFilesize: true,
    runEslint: true,
    useClosure: false
  });
  console.log(buildMessage.bundling(packageJson));
  const bundle = await rollup(buildConfig);
  await bundle.write(buildConfig.output);
  const duration = process.hrtime(time);
  console.log(buildMessage.successful(duration));
};

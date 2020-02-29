import chalk from 'chalk';
import { getInstallCmd } from './installation';
import * as Output from './output';

export const installingPackage = function(packages: string[]) {
  const pkgText = packages
    .map(pkg => `     ${chalk.cyan(chalk.bold(pkg))}`)
    .join('\n');

  return `Installing a package with the following peer dependencies:
${pkgText}
`;
};

export const start = async function(projectName: string) {
  const cmd = await getInstallCmd();

  const commands = {
    install: cmd === 'npm' ? 'npm install' : 'yarn install',
    build: cmd === 'npm' ? 'npm run build' : 'yarn build',
    start: cmd === 'npm' ? 'npm run start' : 'yarn start',
    test: cmd === 'npm' ? 'npm test' : 'yarn test'
  };

  return `
  ${chalk.green('Awesome!')} You're now ready to start coding.
  
  I already ran ${Output.cmd(commands.install)} for you, so your next steps are:
    ${Output.cmd(`cd ${projectName}`)}  
`;
};

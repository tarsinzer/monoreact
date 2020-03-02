import chalk from 'chalk';

const command = (command: string): string => chalk.bold.cyan(command);

export const preparingPackage = (packages: string[]) => {
  const pkgText = packages
    .map(pkg => `     ${chalk.cyan(chalk.bold(pkg))}`)
    .join('\n');

  return packages.length > 0
    ? `Preparing a package with the following peer dependencies: 
${pkgText}
`
    : 'Preparing the package...';
};

export const preparedPackage = async (projectName: string) => {
  const commands = {
    install: 'yarn install',
    start: 'yarn start',
    build: 'yarn build',
    test: 'yarn test'
  };

  return `
  ${chalk.bold.green('Awesome!')} You're now ready to start coding.
  
  There is no need to run ${command(
    commands.install
  )}, since all peer dependencies are already in the workspace root
  
  So your next steps are:
    ${command(`cd ${projectName}`)}
  
  To start developing (rebuilds the bundle on changes):
    ${command(commands.start)}
  
  To build the bundle:
    ${command(commands.build)}
    
  To test the package:
    ${command(commands.test)}
    
  ${chalk.bold.yellow('Happy coding :)')}`;
};

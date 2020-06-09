import { bold, error, highlight, info, success } from '../utils';

export const newMessage = {
  initial: (name: string) => name,
  existsPrompt: (dir: string) =>
    `The folder at ${error(dir)} already exists! ${bold(
      'Choose a different name'
    )}`,

  exists: (dir: string) => error(`The folder is already exists at ${dir}`),

  failedPreparation: () => error('A preparation error has occurred'),
  preparing: () =>
    `${info(
      'Preparation in progress'
    )}: file processing, dependency installation`,
  prepared: () => success('Preparation completed successfully'),

  creating: (dir: string) => `Creating React project at ${info(dir)}`,
  failed: (name: string) => `Failed to create ${error(name)} project`,
  created: ({ name, dir }: { name: string; dir: string }) =>
    `${success('Success!')} Created new ${info(name)} project at ${info(dir)}`,

  finish: (dir: string) => `
  ${success('Awesome!')} You're now ready to start coding
  
  You might begin with:
  ${info('cd')} ${dir}
  ${info('yarn start')}
  
  ${info('yarn start')}
    Starts the development server
  
  ${info('yarn build')}
    Bundles the app into static files for production
    
  ${info('yarn test')}
    Starts the test runner
    
  ${info('yarn eject')}
    Removes this tool and copies build dependencies, configuration files and scripts into the app directory
    
  ${info('yarn lint')} / ${info('yarn stylelint')}
    Runs lint runners
    
  ${highlight('Happy coding :)')}
  `
};

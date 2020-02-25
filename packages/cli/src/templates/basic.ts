import { Template } from './template';

const basicTemplate: Template = {
  name: 'basic',
  dependencies: ['@types/jest', 'husky', 'tslib', 'typescript'],
  packageJson: {
    // name: safeName,
    version: '0.1.0',
    license: 'MIT',
    // author: author,
    main: 'dist/bundle.cjs.js',
    module: 'dist/bundle.es.js',
    'jsnext:main': 'dist/bundle.es.js',
    types: 'dist/publicApi.d.ts',
    files: ['dist'],
    engines: {
      node: '>=10'
    },
    scripts: {
      start: 'npx rollup -cw',
      build: 'npx rollup -c',
      test: 'jest --passWithNoTests',
      docz: 'docz dev -p 6010',
      'lint:es': 'eslint src/**/*.{js,jsx,ts,tsx}',
      'lint:css': 'stylelint src/**/*.{css,sass,scss}'
    },
    peerDependencies: {
      grommet: '^2.11.0',
      'grommet-icons': '^4.4.0',
      'styled-components': '^5.0.1',
      react: '^16.12.0',
      'react-dom': '^16.12.0',
      'react-router-dom': '^5.1.2'
    },
    publishConfig: {
      access: 'public'
    }
  }
};

export default basicTemplate;

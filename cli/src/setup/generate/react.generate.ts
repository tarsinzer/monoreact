import {
  WORKSPACE_PACKAGE_JSON,
  REACT_TEMPLATE_DEPENDENCIES,
  REACT_PACKAGE_SCRIPTS
} from '../../shared/constants/package.const';

export const reactTemplate: CLI.Template.GenerateOptions = {
  dependencies: [
    ...Object.keys(
      REACT_TEMPLATE_DEPENDENCIES.peerDependencies as Record<string, string>
    ),
    'typescript'
  ],
  packageJson: {
    ...WORKSPACE_PACKAGE_JSON,
    ...REACT_TEMPLATE_DEPENDENCIES,
    scripts: REACT_PACKAGE_SCRIPTS
  }
};

import { PACKAGE_JSON } from '../constants/package.const';

export class NotFoundWorkspaceRootError extends Error {
  public isNotFoundWorkspaceRootError = true;

  constructor() {
    super(`
    
    Can't find workspace
    Make sure you run the script inside the project
      `);
    this.name = 'Not Found Workspace Error';
  }
}

export class NotFoundPackageWorkspaceError extends Error {
  public isNotFoundPackageWorkspaceError = true;

  constructor() {
    super(`
    
    Can't find workspace package
    Make sure you run the script inside the package
        
    The workspace ${PACKAGE_JSON} should have:
        workspace: true;
        private: false;
      `);
    this.name = 'Not Found Workspace Error';
  }
}

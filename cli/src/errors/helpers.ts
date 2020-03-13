import { PACKAGE_JSON } from '../helpers/constants';

export class WrongWorkspaceError extends Error {
  public isWrongWorkspace = true;

  constructor(message: string) {
    super(message);
    this.name = 'Wrong Workspace';
  }
}

export class NoPackageJsonError extends Error {
  public hasNoPackageJson = true;

  constructor(script: string) {
    super(`
    Can't find ${PACKAGE_JSON}.
    Make sure you run the script ${script} from the workspace root.
      `);
  }
}

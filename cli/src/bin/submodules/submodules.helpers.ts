import { findWorkspaceRoot } from '../../helpers/utils/package.utils';
import { success, error } from '../../helpers/utils/color.utils';

export const finished = ({
  cmd,
  type,
  code
}: {
  cmd: CLI.Submodules.Command;
  type: 'core' | 'submodules';
  code: number;
}) => success(`Finished ${cmd} ${type} with code ${code}`);

const cantFindWorkspaceRoot = () => error("Cant't find workspace root");

export const getWorkspaceRootPath = async (): Promise<string> => {
  const workspaceRoot = await findWorkspaceRoot();

  if (workspaceRoot === null) {
    console.log(cantFindWorkspaceRoot());
    process.exit(1);
  }

  return workspaceRoot;
};

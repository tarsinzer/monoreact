import { exec } from 'shelljs';
import fs from 'fs-extra';
import path from 'path';
import { Input } from 'enquirer';

import { PACKAGE_JSON } from '../../shared/constants/package.const';
import { generateMessage } from '../../shared/messages';

export const buildPackage = () => exec('yarn build', { silent: true });

export const sortPackageJson = () =>
  exec('npx sort-package-json', { silent: true });

export function setAuthorName(author: CLI.Package.Author): void {
  exec(`npm config set init-author-name "${author}"`, { silent: true });
}

export const createPackageJson = ({
  dir,
  preset
}: {
  dir: string;
  preset:
    | CLI.Package.WorkspacePackageJSON
    | CLI.Package.WorkspaceRootPackageJSON;
}): Promise<void> =>
  fs.outputJSON(path.resolve(dir, PACKAGE_JSON), preset, {
    spaces: 2
  });

function getAuthorName(): CLI.Package.Author {
  let author = '';

  author = exec('npm config get init-author-name', {
    silent: true
  }).stdout.trim();

  if (author) {
    return author;
  }

  author = exec('git config user.name', { silent: true }).stdout.trim();
  if (author) {
    setAuthorName(author);
    return author;
  }

  author = exec('npm config get init-author-email', {
    silent: true
  }).stdout.trim();
  if (author) {
    return author;
  }

  author = exec('git config user.email', { silent: true }).stdout.trim();
  if (author) {
    return author;
  }

  return author;
}

export const getAuthor = async (): Promise<CLI.Package.Author> => {
  const author = getAuthorName();

  if (author) {
    return author;
  }

  const licenseInput = new Input({
    name: 'author',
    message: 'Who is the package author?'
  });
  return licenseInput.run();
};

export const copyTemplate = ({
  dir,
  bin,
  template
}: {
  dir: string;
  template: CLI.Setup.GenerateOptionType | CLI.Setup.NewOptionType;
  bin: 'generate' | 'new';
}): Promise<void> =>
  fs.copy(
    path.resolve(__dirname, `../../../../templates/${bin}/${template}`),
    dir,
    {
      overwrite: true
    }
  );

export const getSafeName = async ({
  basePath,
  name,
  onFail
}: {
  basePath: string;
  name: string;
  onFail: (name: string) => void;
}): Promise<string> => {
  const isExist = fs.existsSync(path.resolve(basePath, name));

  if (!isExist) {
    return name;
  }

  onFail(name);

  const namePrompt = new Input({
    message: generateMessage.exists(name),
    initial: generateMessage.copy(name),
    result: (v: string) => v.trim()
  });
  const newProjectName = await namePrompt.run();

  return getSafeName({
    basePath,
    name: newProjectName,
    onFail
  });
};

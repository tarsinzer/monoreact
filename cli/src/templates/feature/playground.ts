export const playgroundTemplate = {
  scripts: {
    'start:playground':
      'yarn build & concurrently --kill-others "yarn start" "cd playground & yarn start"'
  }
};

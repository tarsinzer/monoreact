export const defineDependencyFlag = (
  dev?: boolean | string,
  D?: boolean | string
): CLI.Dependency.Flag => {
  switch (true) {
    case Boolean(dev):
      return '--dev';

    case Boolean(D):
      return '-D';

    default:
      return '' as CLI.Dependency.Flag;
  }
};

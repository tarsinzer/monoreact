/* eslint-disable sonarjs/no-duplicate-string */
import { splitWorkspacesIntoDependencyGraph } from './dependency.utils';

describe('[utils.dependency]', () => {
  describe('splitWorkspacesIntoDependencyGraph', () => {
    test('should return chunks when there is no package jsons', () => {
      const packageJsons: CLI.Package.BasePackageJSON[] = [];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [],
        unprocessed: []
      });
    });

    test('should return one chunk with one dependency', async () => {
      const packageJsons = [
        {
          name: 'example-1',
          dependencies: {}
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1']],
        unprocessed: []
      });
    });

    test('should return one chunk with a few straight dependencies', async () => {
      const packageJsons = [
        {
          name: 'example-1',
          dependencies: {}
        },
        {
          name: 'example-2',
          dependencies: {}
        },
        {
          name: 'example-3',
          dependencies: {}
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1', 'example-2', 'example-3']],
        unprocessed: []
      });
    });

    test('should return one chunk with 2 packages without dependencies prop', async () => {
      const packageJsons = [
        {
          name: 'example-1'
        },
        {
          name: 'example-2'
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1', 'example-2']],
        unprocessed: []
      });
    });

    test('should return one chunk with 2 packages with empty dependencies prop', async () => {
      const packageJsons = [
        {
          name: 'example-1',
          dependencies: {}
        },
        {
          name: 'example-2',
          dependencies: {}
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1', 'example-2']],
        unprocessed: []
      });
    });

    test('should return one chunk with package without dependencies prop and another package with empty dependencies prop', async () => {
      const packageJsons = [
        {
          name: 'example-1'
        },
        {
          name: 'example-2',
          dependencies: {}
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1', 'example-2']],
        unprocessed: []
      });
    });

    test('should return two chunks with dependency between 2 packages', async () => {
      const packageJsons = [
        {
          name: 'example-1',
          dependencies: {} as CLI.Package.Dependencies
        },
        {
          name: 'example-2',
          dependencies: {
            'example-1': '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1'], ['example-2']],
        unprocessed: []
      });
    });

    test('should return two chunks when last needs both two from the first chunk', async () => {
      const packageJsons = [
        {
          name: 'example-1'
        },
        {
          name: 'example-2'
        },
        {
          name: 'example-3',
          dependencies: {
            'example-1': '*',
            'example-2': '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1', 'example-2'], ['example-3']],
        unprocessed: []
      });
    });

    test('should decompose package in chunk separately even when independent of all packages from the previous chunk', async () => {
      const packageJsons = [
        {
          name: 'example-1'
        },
        {
          name: 'example-2'
        },
        {
          name: 'example-3',
          dependencies: {
            'example-1': '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1', 'example-2'], ['example-3']],
        unprocessed: []
      });
    });

    test('should return only unprocessed packages when there is nothing to compose due to circular dependency', async () => {
      const packageJsons = [
        {
          name: 'example-1',
          dependencies: {
            'example-2': '*'
          }
        },
        {
          name: 'example-2',
          dependencies: {
            'example-1': '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [],
        unprocessed: [
          ['example-1', ['example-2']],
          ['example-2', ['example-1']]
        ]
      });
    });

    test('should return only unprocessed all packages where there is circular dependency between 3 packages', async () => {
      const packageJsons = [
        {
          name: 'example-1',
          dependencies: {
            'example-2': '*'
          }
        },
        {
          name: 'example-2',
          dependencies: {
            'example-3': '*'
          }
        },
        {
          name: 'example-3',
          dependencies: {
            'example-1': '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [],
        unprocessed: [
          ['example-1', ['example-2']],
          ['example-2', ['example-3']],
          ['example-3', ['example-1']]
        ]
      });
    });

    test('should have unprocessed chunk without dependencies which already been processed', async () => {
      const packageJsons = [
        {
          name: 'example-1'
        },
        {
          name: 'example-2',
          dependencies: {
            'example-1': '*',
            'example-3': '*'
          }
        },
        {
          name: 'example-3',
          dependencies: {
            'example-1': '*',
            'example-2': '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1']],
        unprocessed: [
          ['example-2', ['example-3']],
          ['example-3', ['example-2']]
        ]
      });
    });

    test('should return processed and unprocessed dependencies when there is a circular dependency in the middle', async () => {
      const packageJsons = [
        {
          name: 'example-1'
        },
        {
          name: 'example-2',
          dependencies: {
            'example-1': '*',
            'example-3': '*'
          }
        },
        {
          name: 'example-3',
          dependencies: {
            'example-2': '*'
          }
        },
        {
          name: 'example-4',
          dependencies: {
            'example-1': '*'
          }
        },
        {
          name: 'example-5',
          dependencies: {
            'example-1': '*',
            'example-4': '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [['example-1'], ['example-4'], ['example-5']],
        unprocessed: [
          ['example-2', ['example-3']],
          ['example-3', ['example-2']]
        ]
      });
    });

    test('should return corresponding to dependencies chunks in the real-world example', async () => {
      const packageJsons = [
        {
          name: 'components'
        },
        {
          name: 'store'
        },
        {
          name: 'profile',
          dependencies: {
            components: '*',
            store: '*'
          }
        },
        {
          name: 'products',
          dependencies: {
            components: '*',
            store: '*'
          }
        },
        {
          name: 'back-office',
          dependencies: {
            components: '*',
            store: '*'
          }
        },
        {
          name: 'landing',
          dependencies: {
            components: '*'
          }
        },
        {
          name: 'host',
          dependencies: {
            profile: '*',
            products: '*',
            landing: '*',
            'back-office': '*',
            store: '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [
          ['components', 'store'],
          ['profile', 'products', 'back-office', 'landing'],
          ['host']
        ],
        unprocessed: []
      });
    });

    test('should return corresponding to dependencies chunks and unprocessed packages due to circular dependency in the real-world example', async () => {
      const packageJsons = [
        {
          name: 'components'
        },
        {
          name: 'store'
        },
        {
          name: 'profile',
          dependencies: {
            components: '*',
            store: '*'
          }
        },
        {
          name: 'products',
          dependencies: {
            components: '*',
            store: '*'
          }
        },
        {
          name: 'back-office',
          dependencies: {
            components: '*',
            store: '*'
          }
        },
        {
          name: 'landing',
          dependencies: {
            components: '*',
            layout: '*'
          }
        },
        {
          name: 'layout',
          dependencies: {
            components: '*',
            store: '*',
            host: '*'
          }
        },
        {
          name: 'host',
          dependencies: {
            profile: '*',
            products: '*',
            landing: '*',
            'back-office': '*',
            store: '*',
            layout: '*'
          }
        }
      ];
      expect(splitWorkspacesIntoDependencyGraph(packageJsons)).toEqual({
        chunks: [
          ['components', 'store'],
          ['profile', 'products', 'back-office']
        ],
        unprocessed: [
          ['landing', ['layout']],
          ['layout', ['host']],
          ['host', ['landing', 'layout']]
        ]
      });
    });
  });
});

import type { UserConfig } from '@commitlint/types';

const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 72],
    'type-enum': [
      2,
      'always',
      [
        'chore',
        'build',
        'ci',
        'ui',
        'api',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
        'types',
      ],
    ],
    'scope-case': [0],
    'subject-exclamation-mark': [0],
  },
};

export default Configuration;

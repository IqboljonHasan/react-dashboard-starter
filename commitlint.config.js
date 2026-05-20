/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new feature
        'fix',      // bug fix
        'docs',     // documentation only
        'style',    // formatting, missing semicolons, etc — no logic change
        'refactor', // code change that neither fixes a bug nor adds a feature
        'perf',     // performance improvement
        'test',     // adding or updating tests
        'build',    // build system or external dependency changes
        'ci',       // CI/CD configuration changes
        'chore',    // other changes that don't modify src or test files
        'revert',   // reverts a previous commit
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
    'body-max-line-length': [2, 'always', 300],
  },
};
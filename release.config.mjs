/** @type {import('semantic-release').GlobalConfig} */
export default {
  branches: ['main'],
  // The fork still carries upstream's v* tags (including v3.0.0), so use a distinct tag namespace.
  // `bootstrap-v0.0.0` marks the fork point; history before it is not analyzed.
  // eslint-disable-next-line no-template-curly-in-string -- placeholder interpolated by semantic-release
  tagFormat: 'bootstrap-v${version}',
  plugins: [
    ['@semantic-release/commit-analyzer', {
      preset: 'conventionalcommits',
      releaseRules: [
        { breaking: true, release: 'major' },
        { revert: true, release: 'patch' },
        { type: 'feat', release: 'minor' },
        { type: 'fix', release: 'patch' },
        { type: 'perf', release: 'patch' },
        { type: 'refactor', release: 'patch' },
        { type: 'test', release: 'patch' },
      ],
    }],
    ['@semantic-release/release-notes-generator', {
      preset: 'conventionalcommits',
      presetConfig: {
        types: [
          { type: 'feat', section: 'Features' },
          { type: 'fix', section: 'Bug Fixes' },
          { type: 'perf', section: 'Performance' },
          { type: 'refactor', section: 'Refactor' },
          { type: 'test', section: 'Tests' },
          { type: 'revert', section: 'Revert' },
          { type: 'docs', section: 'Docs', hidden: true },
          { type: 'style', section: 'Styles', hidden: true },
          { type: 'build', section: 'Build', hidden: true },
          { type: 'ci', section: 'CI/CD', hidden: true },
        ],
      },
    }],
    ['@semantic-release/changelog', { changelogFile: 'CHANGELOG.md' }],
    '@semantic-release/npm',
    // Commit messages reference upstream issue numbers; don't comment on or label anything.
    ['@semantic-release/github', { successComment: false, failComment: false, failTitle: false, releasedLabels: false }],
    ['@semantic-release/git', {
      assets: ['CHANGELOG.md', 'package.json'],
      // eslint-disable-next-line no-template-curly-in-string -- placeholders interpolated by semantic-release
      message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
    }],
  ],
}

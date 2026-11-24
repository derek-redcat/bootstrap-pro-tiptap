import { yikoyu } from '@yikoyu/semantic-release-config'

export default yikoyu({
  branches: ['main'],
  // The fork still carries upstream's v* tags (including v3.0.0), so use a distinct tag namespace.
  // `bootstrap-v0.0.0` marks the fork point; history before it is not analyzed.
  // eslint-disable-next-line no-template-curly-in-string -- placeholder interpolated by semantic-release
  tagFormat: 'bootstrap-v${version}',
  plugins: {
    github: {
      // Commit messages reference upstream issue numbers; don't comment on or label anything.
      successComment: false,
      failComment: false,
      failTitle: false,
      releasedLabels: false,
    },
  },
})

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  overrides: [
    {
      files: ['**/*.(css|html|vue)'],
      customSyntax: 'postcss-html',
      extends: ['stylelint-config-recommended-vue', 'stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
    },
    {
      files: ['*.scss', '**/*.scss'],
      customSyntax: 'postcss-scss',
      extends: ['stylelint-config-standard-scss', 'stylelint-config-recommended-vue/scss'],
    },
  ],
  rules: {
    'at-rule-no-unknown': null,
    'selector-class-pattern': null,
  },
  ignoreFiles: ['node_modules/*', 'dist/*', 'lib/*', '**/node_modules/*', '**/*.js', '**/*.ts', '**/*.json', '**/*.md'],
}

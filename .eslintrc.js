module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:cypress/recommended',
  ],
  plugins: ['prettier', 'jest'],
  // add your custom rules here
  rules: {
    'jest/no-standalone-expect': [
      'error',
      { additionalTestBlockFunctions: ['each.test'] },
    ],
  },
}

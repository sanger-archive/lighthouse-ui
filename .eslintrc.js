module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parser: 'vue-eslint-parser', // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
    sourceType: 'module',
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'plugin:vue/recommended',
    'plugin:jest/recommended',
    'plugin:jest/style',
    'plugin:cypress/recommended',
    'prettier', // Need to be near last. https://github.com/prettier/eslint-config-prettier#installation
  ],
  plugins: ['jest'],
  // add your custom rules here
  rules: {
    'jest/no-standalone-expect': ['error', { additionalTestBlockFunctions: ['each.test'] }],
    'jest/expect-expect': [
      'warn',
      {
        assertFunctionNames: ['expect', 'cy.contains'],
      },
    ],
  },
}

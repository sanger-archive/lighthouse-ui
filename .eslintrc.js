module.exports = {
  root: true,
  env: {
    browser: true,
  },
  parser: 'vue-eslint-parser', // https://eslint.vuejs.org/user-guide/#how-to-use-a-custom-parser
  parserOptions: {
    parser: 'babel-eslint',
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
    'prettier/vue', // https://eslint.vuejs.org/user-guide/#conflict-with-prettier
  ],
  plugins: ['jest'],
  // add your custom rules here
  rules: {
    'jest/no-standalone-expect': ['error', { additionalTestBlockFunctions: ['each.test'] }],
  },
}

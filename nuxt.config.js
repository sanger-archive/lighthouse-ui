export default {
  /*
   ** Headers of the page
   */
  head: {
    title: 'Lighthouse',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  // https://nuxtjs.org/docs/2.x/features/deployment-targets#target-static
  target: 'static',

  /*
   ** Customize the generated output folder
   */
  generate: {
    dir: 'public',
  },

  /*
   ** Customize the base url
   */
  router: {
    base: process.env.base,
  },

  /*
   ** Global CSS
   */
  css: [],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/vue-pluralize.js' }],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    browserBaseURL: process.env.LIGHTHOUSE_BASE_URL,
    proxy: true,
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
  serverMiddleware: [
    { path: '/health', handler: '~/middleware/health.js' }
  ],
  proxy: {
    '/lighthouse': {
      target: process.env.LIGHTHOUSE_BASE_URL,
      pathRewrite: {'/lighthouse': ''}
    }
  },
  privateRuntimeConfig: {
    lighthouseBaseURL: '/lighthouse',
    lighthouseApiKey: process.env.LIGHTHOUSE_API_KEY || 'lighthouse_ui_read_write_dev',
    labwhereBaseURL: process.env.LABWHERE_BASE_URL || 'http://labwhere',
    sequencescapeBaseURL: process.env.SEQUENCESCAPE_BASE_URL || 'http://sequencescape',
    sprintBaseURL: process.env.SPRINT_BASE_URL || 'http://sprint',
    baracodaBaseURL: process.env.BARACODA_BASE_URL || 'http://baracoda',
  },
  publicRuntimeConfig: {
    asynchronous: process.env.ASYNCHRONOUS,
    projectId: process.env.PROJECT_ID,
    studyId: process.env.STUDY_ID,
    printers: process.env.PRINTERS || 'a,b,c',
    uatActions: process.env.FEATURE_FLAG_UAT_ACTIONS,
    bioseroCherrypick: process.env.FEATURE_FLAG_BIOSERO_CHERRYPICK,
  },
}

import crypto from 'crypto'
import * as path from 'path'
import * as fs from 'fs'
import { sortRoutes } from '@nuxt/utils'
import sitemap from './config/sitemap.js'
require('dotenv').config()
const BUILDID = crypto.randomBytes(10).toString('hex')
const title = 'ANOTRADE - Nền tảng giao dịch an toàn và miễn phí'
const description = 'Khám phá thế giới crypto với ANOTRADE - kênh giao dịch uy tín hàng đầu Việt Nam, trải nghiệm giao dịch nhanh chóng và an toàn theo cách của bạn.'
const packageJson = fs.readFileSync('./package.json')

const isProduction = process.env.NODE_ENV === 'production'
export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    htmlAttrs: {
      lang: 'vi'
    },
    title: 'ANOTRADE - Nền tảng giao dịch an toàn và miễn phí',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'google',
        content: 'notranslate'
      },
      {
        name: 'viewport',
        content: 'width=device-width, minimum-scale=1, maximum-scale=1.0, initial-scale=1, user-scalable=no, viewport-fit=true'
      },
      {
        property: 'og:title',
        content: title
      },
      {
        property: 'og:description',
        content: description
      },
      {
        property: 'og:image',
        content: process.env.STATIC_DOMAIN + '/banner-anotrade.png'
      },
      {
        property: 'og:type',
        content: 'website'
      },
      {
        property: 'og:url',
        content: process.env.STATIC_DOMAIN
      },
      {
        property: 'og:image:width',
        content: '1200'
      },
      {
        property: 'og:image:height',
        content: '630'
      },
      {
        property: 'twitter:url',
        content: process.env.STATIC_DOMAIN
      },
      {
        property: 'twitter:title',
        content: title
      },
      {
        property: 'twitter:description',
        content: description
      },
      {
        property: 'twitter:image',
        content: process.env.STATIC_DOMAIN + '/banner-anotrade.png'
      },
      {
        property: 'twitter:card',
        content: 'summary'
      },
      {
        property: 'twitter:image:width',
        content: '300'
      },
      {
        property: 'twitter:image:height',
        content: '157'
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge,chrome=1'
      },
      {
        'http-equiv': 'Content-Type',
        content: 'text/html; charset=utf-8',
        charset: 'utf-8'
      },
      {
        'http-equiv': 'content-language',
        content: 'vi'
      },
      {
        hid: 'description',
        name: 'description',
        content: description
      }
    ],
    link: [
      {
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href: ''
      },
      {
        rel: 'alternate',
        hreflang: 'vi',
        href: process.env.STATIC_DOMAIN
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico?v=2' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png?v=2' },
      { rel: 'icon', sizes: '32x32', href: '/favicon-32x32.png?v=2' },
      { rel: 'icon', sizes: '16x16', href: '/favicon-16x16.png?v=2' },
      { rel: 'icon', sizes: '48x48', href: '/favicon-48x48.png?v=2' },
      { rel: 'icon', sizes: '50x50', href: '/favicon-50x50.png?v=2' },
      { rel: 'icon', sizes: '64x64', href: '/favicon-64x64.png?v=2' },
      { rel: 'icon', sizes: '192x192', href: '/android-chrome-192x192.png?v=2' },
      { rel: 'icon', sizes: '512x512', href: '/android-chrome-512x512.png?v=2' }
    ],
    noscript: [{ innerHTML: 'This website requires JavaScript.' }]
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['static/assets/scss/app.scss'],
  /*
   ** Style resources configuration
   */
  styleResources: {
    scss: [
      'static/assets/scss/_variables.scss',
      'static/assets/scss/_mixin.scss',
      'static/assets/scss/_function.scss',
      'static/assets/scss/_animation.scss'
    ]
  },
  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    {
      src: '~/plugins/global',
      ssr: true
    },
    '~/plugins/i18n',
    '~/plugins/axios',
    {
      src: '~/plugins/socket.io.js',
      ssr: false
    },
    {
      src: '~/plugins/socket-chat.js',
      ssr: false
    },
    { src: '~/plugins/vue-awesome-swiper', ssr: true },
    { src: '~/plugins/custom-device.js', ssr: true },
    { src: '~/plugins/lighthouse.js', ssr: false }
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: false,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    '@nuxtjs/eslint-module',
    '@nuxtjs/svg',
    '@nuxtjs/style-resources',
    ['k-domains', {
      subDomains: ['operations'], // List of directories to hold te pages for your subdomains
      rootDomain: '' //  directory to hold the pages for root domain
    }
    ],
    ['@nuxtjs/router', {
      keepDefaultRouter: true // this line is mandatory...
    }
    ],
    [
      '@nuxtjs/google-fonts',
      {
        families: {
          'Roboto Condensed': {
            wght: [400, 500, 700, 900]
          }
        },
        display: 'swap',
        prefetch: false,
        preconnect: true,
        preload: true,
        download: false,
        base64: false
      }
    ]
  ],
  axios: {
    proxy: false,
    baseURL: process.env.API_BASE_URL
  },
  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/axios',
    'nuxt-clipboard2',
    '@nuxtjs/redirect-module',
    ...(isProduction ? ['@nuxtjs/sitemap', '@nuxtjs/component-cache', '@/modules/axCache', '@nuxtjs/gtm'] : []),
    '@nuxt/image',
    // TODO: Will re-open when continue implementing Notification feature
    // '@nuxtjs/onesignal',
    // '@nuxtjs/pwa',
    ['cookie-universal-nuxt', { parseJSON: false }]
  ],
  ...(isProduction ? sitemap : {
    sitemaps: []
  }),
  ...(isProduction ? {
    gtm: {
      id: process.env.GOOGLE_TAG_MANAGER_ID
    }
  } : {}),
  publicRuntimeConfig: {
    axios: {
      browserBaseURL: process.env.API_BROWSER_URL
    },
    turnstile: {
      siteKey: process.env.CF_TURNSTILE_SITE_KEY
    },
    CHAIN_ID_SIGN_MESSAGE: process.env.CHAIN_ID_SIGN_MESSAGE,
    STATEMENT_SIWE: process.env.STATEMENT_SIWE,
    DOMAIN: process.env.DOMAIN,
    STATIC_DOMAIN: process.env.STATIC_DOMAIN,
    USER_DOMAIN: process.env.USER_DOMAIN,
    OPERATION_PREFIX: process.env.OPERATION_PREFIX,
    ADMIN_PREFIX: process.env.ADMIN_PREFIX,
    ONESIGNAL_ENABLE: process.env.ONESIGNAL_ENABLE,
    ONESIGNAL_APP_ID_USER: process.env.ONESIGNAL_APP_ID_USER,
    ONESIGNAL_APP_ID_OPERATION: process.env.ONESIGNAL_APP_ID_OPERATION,
    ONESIGNAL_APP_ID_ADMIN: process.env.ONESIGNAL_APP_ID_ADMIN,
    USER_DOMAIN_URL_REDIRECT: process.env.USER_DOMAIN_URL_REDIRECT,
    ENABLE_REFERRAL_CODE: process.env.ENABLE_REFERRAL_CODE,
    BRAND_NAME: process.env.BRAND_NAME,
    BRAND_PLATFORM: process.env.BRAND_PLATFORM,
    WALLET_CONNECT_PRJ_ID: process.env.WALLET_CONNECT_PRJ_ID,
    WALLET_CONNECT_PRJ_ADMIN_ID: process.env.WALLET_CONNECT_PRJ_ADMIN_ID,
    WALLET_CONNECT_PRJ_OPERATION_ID: process.env.WALLET_CONNECT_PRJ_OPERATION_ID,
    WALLET_CONNECT_USER_DOMAIN: process.env.WALLET_CONNECT_USER_DOMAIN,
    WALLET_CONNECT_OPERATION_DOMAIN: process.env.WALLET_CONNECT_OPERATION_DOMAIN,
    WALLET_CONNECT_ADMIN_DOMAIN: process.env.WALLET_CONNECT_ADMIN_DOMAIN,
    LIMIT_ORDER_ADMIN_SUPPORTER: process.env.LIMIT_ORDER_ADMIN_SUPPORTER,
    LIMIT_ORDERS_SHOW_ALL: process.env.LIMIT_ORDERS_SHOW_ALL,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    WS_URL: process.env.WS_URL,
    FACEBOOK_URL: process.env.FACEBOOK_URL,
    TWITTER_URL: process.env.TWITTER_URL,
    TELEGRAM_URL: process.env.TELEGRAM_URL,
    REPORTER_DOMAIN: process.env.REPORTER_DOMAIN,
    APP_VERSION: process.env.npm_package_version || JSON.parse(packageJson).version || 0
  },
  privateRuntimeConfig: {
    axios: {
      baseURL: process.env.API_BASE_URL
    },
    turnstile: {
      secretKey: process.env.CF_TURNSTILE_SECRET_KEY
    },
    OPERATION_DOMAIN: process.env.OPERATION_DOMAIN,
    USER_DOMAIN: process.env.USER_DOMAIN,
    ADMIN_DOMAIN: process.env.ADMIN_DOMAIN
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: false,
    components: [
      'BAvatar',
      'BContainer',
      'BModal',
      'BFormGroup',
      'BFormRadio',
      'BFormCheckbox',
      'BFormCheckboxGroup',
      'BTooltip',
      'BSidebar',
      'BDropdown',
      'BDropdownItem',
      'BTab',
      'BTabs',
      'BToast',
      'BNavItem',
      'BTable',
      'BFormRadioGroup',
      'BCollapse',
      'BSkeleton',
      'BSkeletonImg',
      'BSkeletonTable',
      'BSkeletonWrapper',
      'BPagination',
      'BFormTextarea',
      'BPopover'
    ],
    componentPlugins: [
      'ModalPlugin'
    ],
    breakpoints: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    directives: ['VBModal', 'VBTooltip', 'VBToggle']
  },
  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    standalone: true,
    publicPath: process.env.PUBLIC_URL || '/_nuxt/',
    parallel: false,
    extractCSS: isProduction,
    optimizeCSS: isProduction,
    filenames: {
      css: ({ isDev }) => isDev ? '[name].css' : `${BUILDID}.[name].css`
    },
    transpile: [/vant.*?less/],
    babel: {
      compact: true,
      plugins: []
    },
    ...(isProduction ? {
      optimization: {
        minimize: isProduction,
        mergeDuplicateChunks: isProduction,
        splitChunks: {
          chunks: 'all',
          automaticNameDelimiter: '.',
          name: true,
          cacheGroups: {}
        }
      },
      splitChunks: {
        pages: true,
        vendor: true,
        commons: true,
        runtime: false,
        layouts: false
      }
    } : {}),
    loaders: {
      cssModules: {
        modules: {
          localIdentName: '[hash:base64:4]'
        }
      },
      scss: {
        additionalData: `$staticDomain: '${process.env.STATIC_DOMAIN}';`
      }
    },
    extend (config, { isDev, isClient, loaders: { vue } }) {
      if (isClient) {
        vue.transformAssetUrls.img = ['data-src', 'src']
        vue.transformAssetUrls.source = ['data-srcset', 'srcset']
      }
      if (isDev) {
        config.devtool = isClient ? 'source-map' : 'inline-source-map';
      }
      config.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      })
      config.module.rules.push({
        test: /node_modules[\\/]@walletconnect/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      })
      config.module.rules.push({
        test: /node_modules[\\/]@metamask/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      })
      config.module.rules.push({
        test: /node_modules[\\/]unstorage/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      })
      config.module.rules.push({
        test: /node_modules[\\/]fireworks-js/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      })
      config.resolve.alias['~imageRoot'] = path.join(__dirname, 'static/assets/images')
      config.resolve.alias['~iconRoot'] = path.join(__dirname, 'static/assets/icons')
    }
  },
  router: {
    // middleware: ['maintain'],
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'custom',
        path: '*',
        component: resolve(__dirname, 'pages/404.vue')
      })
      sortRoutes(routes)
    }
  },
  render: {
    bundleRenderer: {
      shouldPreload: (file, type) => {
        return ['script', 'style', 'font'].includes(type)
      }
    }
  },
  server: {
    timing: false
  },
  serverMiddleware: [
    { path: '/', handler: '~/serverMiddleware/whitelist.js' }
  ],
  watchers: {
    webpack: {
      ignored: /node_modules/
    }
  }
}

/**
 * 仅用于playground开发调试使用，不会对dist产生影响
 */
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devServer: {
    host: '0.0.0.0',
    port: 7749,
  },
  icon: {
    customCollections: [{
      prefix: 'custom',
      dir: './assets/icons'
    }]
  },
  // 禁用默认的 google 字体提供商
  fonts: {
    providers: {
      google: false,
      googleicons: false,
      bunny: false,
    }
  },
  modules: [
    // '@nuxt/content',
    '@nuxt/eslint',
    // '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '../src/module',
  ],
  myModule0: {
  },
  devtools: { enabled: true },
});

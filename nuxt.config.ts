// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 禁用默认的 google 字体提供商
  // fonts: {
  //   providers: {
  //     google: false,
  //     googleicons: false,
  //     bunny: false,
  //   }
  // },
  // icon: {
  //   customCollections: [{
  //     prefix: 'custom',
  //     dir: './assets/icons'
  //   }]
  // },
  vite: {
    plugins: []
  },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    // "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui"
  ]
});

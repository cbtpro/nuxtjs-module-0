import { resolve } from 'node:path';
import { defineNuxtModule, addComponentsDir, addPlugin, createResolver } from '@nuxt/kit';

// Module options TypeScript interface definition
export interface ModuleOptions {
  alias: Record<string, string>;
}

const routes = [
  {
    name: 'module-0-home',
    path: '/module-0-home',
    file: resolve(__dirname, './runtime/pages/index.vue')
  },
];
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'my-module-0',
    configKey: 'myModule0',
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'));
    // 添加组件目录
    addComponentsDir({
      path: resolver.resolve('./runtime/components')
    });
    /**
     * 暴露assets给父组件
     */
    // _nuxt.hook('nitro:config', async (nitroConfig) => {
    //   nitroConfig.publicAssets ||= [];
    //   nitroConfig.publicAssets.push({
    //     dir: resolver.resolve('./public'),
    //     maxAge: 60 * 60 * 24 * 365 // 1 year
    //   });
    // });

    _nuxt.hook('ready', async nuxt => {
      console.log('Nuxt 已准备好');
    });
  },
  hooks: {
    'pages:extend'(pages) {
      pages.push(...routes);
      console.log(`发现 ${pages.length} 个页面`);
    }
  }
});

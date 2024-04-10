import {resolve} from 'path'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'
import vueSetupExtend from 'vite-plugin-vue-setup-extend'

import AutoImport from 'unplugin-auto-import/vite'
import {ElementPlusResolver} from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import IconsResolver from 'unplugin-icons/resolver'
import VueJsx from '@vitejs/plugin-vue-jsx'

// 参考：https://cn.vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    // 配置别名
    alias: {
      '@': resolve(__dirname, './src'),
      'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js'
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  plugins: [
    vue(),
    vueSetupExtend(),
    createSvgIconsPlugin({
      iconDirs: [resolve(__dirname, 'src/assets/iot/icons/svg')],
      symbolId: 'icon-[dir]-[name]'
    }),
    VueJsx(),
    AutoImport({
      // 自动导入 Vue 相关函数
      imports: ['vue', 'vue-router', '@vueuse/core', 'pinia'],
      eslintrc: {
        enabled: false,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true
      },
      resolvers: [
        // 自动导入 Element Plus 相关函数ElMessage, ElMessageBox... (带样式)
        ElementPlusResolver(),
        IconsResolver({
          prefix: 'Icon'
        })
      ],
      vueTemplate: true, // 是否在 vue 模板中自动导入
      dts: resolve(resolve(__dirname, './src'), 'types', 'auto-imports.d.ts')
    }),
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
        IconsResolver({
          // 自动注册图标组件
          enabledCollections: ['ep']
        })
      ],
      dts: resolve(resolve(__dirname, './src'), 'types', 'components.d.ts')
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 8093, // 端口号
    open: false // 是否自动打开浏览器
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true
      },
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === 'charset') {
                atRule.remove()
              }
            }
          }
        }
      ]
    }
  },
  optimizeDeps: {
    include: [
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`
    ],
  }
})

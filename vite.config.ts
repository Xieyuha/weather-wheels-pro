import { fileURLToPath, URL } from 'node:url'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteStaticCopy } from 'vite-plugin-static-copy'

const cesiumSource = 'node_modules/cesium/Build/Cesium'
const cesiumBaseUrl = "cesiumStatic"
// https://vite.dev/config/
export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify(`/${cesiumBaseUrl}`),
  },
  plugins: [
    vue(),
    vueDevTools(),
    createSvgIconsPlugin({
      // SVG 图标文件存放目录
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // symbol id 格式，对应 SvgIcon 里的 `#icon-${name}`
      symbolId: 'icon-[name]',
    }),
    viteStaticCopy({
      targets: [
        {
          src: `${cesiumSource}/Widgets`,
          dest: cesiumBaseUrl,
        },
        {
          src: `${cesiumSource}/ThirdParty`,
          dest: cesiumBaseUrl,
        },
        {
          src: `${cesiumSource}/Assets`,
          dest: cesiumBaseUrl,
        },
        {
          src: `${cesiumSource}/Workers`,
          dest: cesiumBaseUrl,
        },
      ],
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
},
)

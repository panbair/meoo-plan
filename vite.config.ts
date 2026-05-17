/**
 * Vite 配置文件
 * @description Vite + Vue3 + TypeScript 企业级后台管理系统
 */

import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { viteMockServe } from 'vite-plugin-mock'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'

// 环境判断
const isProduction = (mode: string) => mode === 'production'
const isBuild = (mode: string) => ['production', 'test', 'staging'].includes(mode)

// 获取项目根目录
const root = process.cwd()

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root)
  const buildMode = isBuild(mode)

  return {
    // 基础路径
    base: env.VITE_BASE_PATH || '/',

    // 插件配置
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),

      // Mock 数据
      viteMockServe({
        mockPath: 'mock',
        enable: buildMode || mode === 'development',
        watchFiles: true
      }),

      // 自动导入 API
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          '@vueuse/core'
        ],
        dts: 'src/types/auto-imports.d.ts',
        eslintrc: {
          enabled: false // 禁用以避免 eslint 冲突
        },
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ]
      }),

      // 自动导入组件
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: 'sass'
          })
        ],
        dts: 'src/types/components.d.ts',
        extensions: ['vue', 'tsx', 'jsx'],
        include: [
          /\.vue$/,
          /\.vue\?vue/,
          /\.tsx$/,
          /\.jsx$/
        ],
        // 组件名称转换
        directoryAsNamespace: true,
        globalNamespaces: ['components']
      }),

      // SVG 图标
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(root, 'src/assets/icons')
        ],
        symbolId: 'icon-[name]',
        inject: 'body-last',
        customDomId: '__svg__icons__dom__'
      }),

      // HTML 模板
      createHtmlPlugin({
        minify: buildMode,
        template: 'index.html',
        inject: {
          data: {
            title: env.VITE_APP_TITLE || '管理系统',
            injectScript: buildMode
              ? `<script src="/inject.js"></script>`
              : ''
          }
        }
      }),

      // Vue I18n (禁用预编译插件以避免 esbuild 错误)
      // vue-i18n 默认可以直接工作，不需要 unplugin
      // vueI18n({
      //   strictMessage: false,
      //   ssr: false,
      //   include: path.resolve(root, './src/i18n/locales/**')
      // }),

      // 生产环境压缩
      buildMode && viteCompression({
        verbose: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz'
      }),

      // Brotli 压缩（更好的压缩率）
      buildMode && viteCompression({
        verbose: false,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br'
      }),

      // 打包体积分析
      buildMode && (visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: 'dist/stats.html',
        backgroundColor: '#f5f5f5'
      }) as Plugin)
    ].filter(Boolean) as Plugin[],

    // 路径别名
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '#': fileURLToPath(new URL('./src/types', import.meta.url))
      },
      extensions: ['.ts', '.tsx', '.vue', '.jsx', '.js', '.json']
    },

    // 依赖预构建
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'pinia-plugin-persistedstate',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        'dayjs',
        'lodash-es',
        '@vueuse/core'
      ]
    },

    // 开发服务器
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT) || 5173,
      open: env.VITE_OPEN === 'true',
      cors: true,
      hmr: {
        overlay: true
      },
      // 请求代理
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api/, ''),
          ws: true
        },
        '/upload': {
          target: env.VITE_UPLOAD_URL || 'http://localhost:8080',
          changeOrigin: true
        },
        // AI API 代理 - 解决跨域问题
        '/ai-proxy': {
          target: 'https://dashscope.aliyuncs.com',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/ai-proxy/, '/compatible-mode/v1'),
          secure: true,
          headers: {
            'Origin': 'https://dashscope.aliyuncs.com'
          }
        }
      },
      // 开发服务器监听
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', 'dist/**']
      }
    },

    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ``,
          javascriptEnabled: true,
          api: 'modern-compiler'
        }
      },
      devSourcemap: !buildMode
    },

    // 构建配置
    build: {
      target: 'esnext',
      outDir: env.VITE_OUT_DIR || 'dist',
      assetsDir: 'assets',
      sourcemap: env.VITE_SOURCEMAP === 'true' ? 'hidden' : false,
      minify: 'esbuild',
      cssCodeSplit: true,
      // 禁用 gzip 下的代码分割
      reportCompressedSize: buildMode,

      // Rollup 配置
      rollupOptions: {
        treeshake: {
          moduleSideEffects: (id: string) => {
            // 保留副作用
            if (id.includes('virtual:')) return false
            if (id.includes('element-plus/theme-chalk')) return true
            return false
          },
          propertyReadSideEffects: false,
          tryCatchDeoptimization: true
        },

        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',

          // 手动分包策略
          manualChunks: (id: string) => {
            // Node modules 分包
            if (id.includes('node_modules')) {
              // 框架核心
              if (/node_modules\/((@)?vue(-router)?|pinia|vue-i18n|@vueuse\/core)/.test(id)) {
                return 'vue-core'
              }

              // UI 库
              if (/node_modules\/element-plus/.test(id)) {
                return 'element-plus'
              }

              // 图表库
              if (/node_modules\/(echarts|zrender)/.test(id)) {
                return 'echarts'
              }

              // 工具库
              if (/node_modules\/(axios|dayjs|lodash|mitt|crypto-js|jsencrypt)/.test(id)) {
                return 'utils'
              }

              // 图标库
              if (/node_modules\/@element-plus\/icons-vue/.test(id)) {
                return 'icons'
              }

              return 'vendor'
            }

            // 业务代码按模块分包
            if (id.includes('/src/views/')) {
              const match = id.match(/\/src\/views\/([^/]+)\//)
              if (match) {
                return `views-${match[1]}`
              }
            }

            if (id.includes('/src/api/')) {
              return 'api'
            }

            if (id.includes('/src/store/')) {
              return 'store'
            }
          },

          // 静态资源内联
          assetFileNames: (assetInfo) => {
            const { name } = assetInfo
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name || '')) {
              return 'fonts/[name]-[hash][extname]'
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name || '')) {
              return 'images/[name]-[hash][extname]'
            }
            return '[ext]/[name]-[hash][extname]'
          }
        },

        // 外部依赖
        external: [
          // 生产环境可能需要外部化的依赖
        ]
      },

      // 包体积警告阈值
      chunkSizeWarningLimit: 1000,

      // 模块 ID 固定化
      moduleIds: 'deterministic',

      // 压缩配置
      esbuild: {
        drop: buildMode ? ['console', 'debugger'] : [],
        legalComments: 'none',
        minifyIdentifiers: buildMode
      }
    },

    // 预览服务器
    preview: {
      port: 4173,
      open: true
    },

    // JSON 约束
    json: {
      stringify: true
    },

    // 缓存目录
    cacheDir: 'node_modules/.vite',

    // 实验性配置
    experimental: {
      // 构建时的并行处理
      buildParallelModules: true,
      // Render chunk link
      renderBuiltUrl(filename: string) {
        if (isProduction(mode)) {
          return { runtime: `/public/${filename}` }
        }
        return { relative: true }
      }
    },

    // 日志级别
    logLevel: 'info',

    // 清除屏幕
    clearScreen: false
  }
})

// 类型声明
declare module 'vite' {
  interface UserConfig {
    // 自定义配置
  }
}

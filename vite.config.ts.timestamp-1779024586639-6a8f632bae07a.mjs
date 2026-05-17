// vite.config.ts
import { defineConfig, loadEnv } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.40_sass@1.97.2_terser@5.46.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_c7c1e3da12ccb536dbc51507e9cea273/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1._b5ca1be64fe263ce0bcfaa7fa1a6da6e/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { viteMockServe } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite-plugin-mock@3.0.2_esbu_e3ccbbfe330c2128228dad82f82fa4be/node_modules/vite-plugin-mock/dist/index.mjs";
import UnoCSS from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unocss@0.61.9_postcss@5.2.1_6330a657bffce3791a984f7dd1e321e4/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unplugin-auto-import@0.17.8_716a096b578163c29fd963d6a98a2236/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unplugin-vue-components@0.2_cba32fd87801759e2f4e412db0413a0b/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unplugin-vue-components@0.2_cba32fd87801759e2f4e412db0413a0b/node_modules/unplugin-vue-components/dist/resolvers.js";
import { createSvgIconsPlugin } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_776cb7b6e9723a80c826db6e4dbce680/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { visualizer } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0_rollup@4.55.1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite-plugin-compression@0.5_631bf6c2cca0f1bfbd0500d44ff6e9ca/node_modules/vite-plugin-compression/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";
var __vite_injected_original_import_meta_url = "file:///E:/my-work2025/meoo-plan/meoo-plan/vite.config.ts";
var isBuild = (mode) => ["production", "test", "staging"].includes(mode);
var root = process.cwd();
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, root);
  const buildMode = isBuild(mode);
  return {
    // 基础路径
    base: env.VITE_BASE_PATH || "/",
    // 插件配置
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      // Mock 数据
      viteMockServe({
        mockPath: "mock",
        enable: buildMode || mode === "development",
        watchFiles: true
      }),
      // 自动导入 API
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "pinia",
          "@vueuse/core"
        ],
        dts: "src/types/auto-imports.d.ts",
        eslintrc: {
          enabled: false
          // 禁用以避免 eslint 冲突
        },
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass"
          })
        ]
      }),
      // 自动导入组件
      Components({
        resolvers: [
          ElementPlusResolver({
            importStyle: "sass"
          })
        ],
        dts: "src/types/components.d.ts",
        extensions: ["vue", "tsx", "jsx"],
        include: [
          /\.vue$/,
          /\.vue\?vue/,
          /\.tsx$/,
          /\.jsx$/
        ],
        // 组件名称转换
        directoryAsNamespace: true,
        globalNamespaces: ["components"]
      }),
      // SVG 图标
      createSvgIconsPlugin({
        iconDirs: [
          path.resolve(root, "src/assets/icons")
        ],
        symbolId: "icon-[name]",
        inject: "body-last",
        customDomId: "__svg__icons__dom__"
      }),
      // HTML 模板（临时禁用，避免 logo.svg 处理错误）
      // createHtmlPlugin({
      //   minify: buildMode,
      //   template: 'index.html',
      //   inject: {
      //     data: {
      //       title: env.VITE_APP_TITLE || '管理系统',
      //       injectScript: buildMode
      //         ? `<script src="/inject.js"></script>`
      //         : ''
      //     },
      //     ejsOptions: {
      //       rmWhitespace: true
      //     }
      //   },
      //   transformOptions: {
      //     assetsInclude: []
      //   }
      // }),
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
        algorithm: "gzip",
        ext: ".gz"
      }),
      // Brotli 压缩（更好的压缩率）
      buildMode && viteCompression({
        verbose: false,
        threshold: 10240,
        algorithm: "brotliCompress",
        ext: ".br"
      }),
      // 打包体积分析
      buildMode && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: "dist/stats.html"
      })
    ].filter(Boolean),
    // 路径别名
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
        "#": fileURLToPath(new URL("./src/types", __vite_injected_original_import_meta_url))
      },
      extensions: [".ts", ".tsx", ".vue", ".jsx", ".js", ".json"]
    },
    // 依赖预构建
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "pinia-plugin-persistedstate",
        "element-plus",
        "@element-plus/icons-vue",
        "axios",
        "dayjs",
        "lodash-es",
        "@vueuse/core"
      ]
    },
    // 开发服务器
    server: {
      host: "0.0.0.0",
      port: Number(env.VITE_PORT) || 5173,
      open: env.VITE_OPEN === "true",
      cors: true,
      hmr: {
        overlay: true
      },
      // 请求代理
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "http://localhost:8080",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ""),
          ws: true
        },
        "/upload": {
          target: env.VITE_UPLOAD_URL || "http://localhost:8080",
          changeOrigin: true
        },
        // AI API 代理 - 解决跨域问题
        "/ai-proxy": {
          target: "https://dashscope.aliyuncs.com",
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/ai-proxy/, "/compatible-mode/v1"),
          secure: true,
          headers: {
            "Origin": "https://dashscope.aliyuncs.com"
          }
        }
      },
      // 开发服务器监听
      watch: {
        usePolling: false,
        ignored: ["**/node_modules/**", "dist/**"]
      }
    },
    // CSS 配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ``,
          javascriptEnabled: true,
          api: "modern-compiler"
        }
      },
      devSourcemap: !buildMode
    },
    // 构建配置
    build: {
      target: "esnext",
      outDir: env.VITE_OUT_DIR || "dist",
      assetsDir: "assets",
      sourcemap: env.VITE_SOURCEMAP === "true" ? "hidden" : false,
      minify: "esbuild",
      cssCodeSplit: true,
      // 禁用 gzip 下的代码分割
      reportCompressedSize: buildMode,
      // Rollup 配置
      rollupOptions: {
        treeshake: {
          moduleSideEffects: true,
          // 保留所有模块的副作用
          propertyReadSideEffects: false,
          tryCatchDeoptimization: true
        },
        output: {
          chunkFileNames: "js/[name]-[hash].js",
          entryFileNames: "js/[name]-[hash].js",
          // 手动分包策略
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (/node_modules\/((@)?vue(-router)?|pinia|vue-i18n|@vueuse\/core)/.test(id)) {
                return "vue-core";
              }
              if (/node_modules\/element-plus/.test(id)) {
                return "element-plus";
              }
              if (/node_modules\/(echarts|zrender)/.test(id)) {
                return "echarts";
              }
              if (/node_modules\/(axios|dayjs|lodash|mitt|crypto-js|jsencrypt)/.test(id)) {
                return "utils";
              }
              if (/node_modules\/@element-plus\/icons-vue/.test(id)) {
                return "icons";
              }
              return "vendor";
            }
            if (id.includes("/src/views/")) {
              const match = id.match(/\/src\/views\/([^/]+)\//);
              if (match) {
                return `views-${match[1]}`;
              }
            }
            if (id.includes("/src/api/")) {
              return "api";
            }
            if (id.includes("/src/store/")) {
              return "store";
            }
          },
          // 静态资源内联
          assetFileNames: (assetInfo) => {
            const { name } = assetInfo;
            if (/\.(woff2?|eot|ttf|otf)$/i.test(name || "")) {
              return "fonts/[name]-[hash][extname]";
            }
            if (/\.(png|jpe?g|gif|svg|webp|avif)$/i.test(name || "")) {
              return "images/[name]-[hash][extname]";
            }
            return "[ext]/[name]-[hash][extname]";
          }
        },
        // 外部依赖
        external: [
          // 生产环境可能需要外部化的依赖
        ]
      },
      // 包体积警告阈值
      chunkSizeWarningLimit: 1e3,
      // 模块 ID 固定化
      moduleIds: "deterministic",
      // 压缩配置
      esbuild: {
        drop: buildMode ? ["console", "debugger"] : [],
        legalComments: "none",
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
    cacheDir: "node_modules/.vite",
    // 实验性配置
    experimental: {
      // 构建时的并行处理
      buildParallelModules: true
      // Render chunk link（禁用，避免 HTML 脚本路径问题）
      // renderBuiltUrl(filename: string) {
      //   if (isProduction(mode)) {
      //     return { runtime: `/public/${filename}` }
      //   }
      //   return { relative: true }
      // }
    },
    // 日志级别
    logLevel: "info",
    // 清除屏幕
    clearScreen: false
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxteS13b3JrMjAyNVxcXFxtZW9vLXBsYW5cXFxcbWVvby1wbGFuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxteS13b3JrMjAyNVxcXFxtZW9vLXBsYW5cXFxcbWVvby1wbGFuXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9teS13b3JrMjAyNS9tZW9vLXBsYW4vbWVvby1wbGFuL3ZpdGUuY29uZmlnLnRzXCI7LyoqXHJcbiAqIFZpdGUgXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHJcbiAqIEBkZXNjcmlwdGlvbiBWaXRlICsgVnVlMyArIFR5cGVTY3JpcHQgXHU0RjAxXHU0RTFBXHU3RUE3XHU1NDBFXHU1M0YwXHU3QkExXHU3NDA2XHU3Q0ZCXHU3RURGXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCB0eXBlIFBsdWdpbiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnXHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXHJcblxyXG4vLyBcdTczQUZcdTU4ODNcdTUyMjRcdTY1QURcclxuY29uc3QgaXNQcm9kdWN0aW9uID0gKG1vZGU6IHN0cmluZykgPT4gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nXHJcbmNvbnN0IGlzQnVpbGQgPSAobW9kZTogc3RyaW5nKSA9PiBbJ3Byb2R1Y3Rpb24nLCAndGVzdCcsICdzdGFnaW5nJ10uaW5jbHVkZXMobW9kZSlcclxuXHJcbi8vIFx1ODNCN1x1NTNENlx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVxyXG5jb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdClcclxuICBjb25zdCBidWlsZE1vZGUgPSBpc0J1aWxkKG1vZGUpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAvLyBcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcclxuICAgIGJhc2U6IGVudi5WSVRFX0JBU0VfUEFUSCB8fCAnLycsXHJcblxyXG4gICAgLy8gXHU2M0QyXHU0RUY2XHU5MTREXHU3RjZFXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICB2dWVKc3goKSxcclxuICAgICAgVW5vQ1NTKCksXHJcblxyXG4gICAgICAvLyBNb2NrIFx1NjU3MFx1NjM2RVxyXG4gICAgICB2aXRlTW9ja1NlcnZlKHtcclxuICAgICAgICBtb2NrUGF0aDogJ21vY2snLFxyXG4gICAgICAgIGVuYWJsZTogYnVpbGRNb2RlIHx8IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXHJcbiAgICAgICAgd2F0Y2hGaWxlczogdHJ1ZVxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBBUElcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAncGluaWEnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZSdcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlIC8vIFx1Nzk4MVx1NzUyOFx1NEVFNVx1OTA3Rlx1NTE0RCBlc2xpbnQgXHU1MUIyXHU3QTgxXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBpbXBvcnRTdHlsZTogJ3Nhc3MnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIF1cclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgaW1wb3J0U3R5bGU6ICdzYXNzJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9jb21wb25lbnRzLmQudHMnLFxyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ3RzeCcsICdqc3gnXSxcclxuICAgICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgICAvXFwudnVlJC8sXHJcbiAgICAgICAgICAvXFwudnVlXFw/dnVlLyxcclxuICAgICAgICAgIC9cXC50c3gkLyxcclxuICAgICAgICAgIC9cXC5qc3gkL1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgLy8gXHU3RUM0XHU0RUY2XHU1NDBEXHU3OUYwXHU4RjZDXHU2MzYyXHJcbiAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsXHJcbiAgICAgICAgZ2xvYmFsTmFtZXNwYWNlczogWydjb21wb25lbnRzJ11cclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBTVkcgXHU1NkZFXHU2ODA3XHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICBpY29uRGlyczogW1xyXG4gICAgICAgICAgcGF0aC5yZXNvbHZlKHJvb3QsICdzcmMvYXNzZXRzL2ljb25zJylcclxuICAgICAgICBdLFxyXG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bbmFtZV0nLFxyXG4gICAgICAgIGluamVjdDogJ2JvZHktbGFzdCcsXHJcbiAgICAgICAgY3VzdG9tRG9tSWQ6ICdfX3N2Z19faWNvbnNfX2RvbV9fJ1xyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIEhUTUwgXHU2QTIxXHU2NzdGXHVGRjA4XHU0RTM0XHU2NUY2XHU3OTgxXHU3NTI4XHVGRjBDXHU5MDdGXHU1MTREIGxvZ28uc3ZnIFx1NTkwNFx1NzQwNlx1OTUxOVx1OEJFRlx1RkYwOVxyXG4gICAgICAvLyBjcmVhdGVIdG1sUGx1Z2luKHtcclxuICAgICAgLy8gICBtaW5pZnk6IGJ1aWxkTW9kZSxcclxuICAgICAgLy8gICB0ZW1wbGF0ZTogJ2luZGV4Lmh0bWwnLFxyXG4gICAgICAvLyAgIGluamVjdDoge1xyXG4gICAgICAvLyAgICAgZGF0YToge1xyXG4gICAgICAvLyAgICAgICB0aXRsZTogZW52LlZJVEVfQVBQX1RJVExFIHx8ICdcdTdCQTFcdTc0MDZcdTdDRkJcdTdFREYnLFxyXG4gICAgICAvLyAgICAgICBpbmplY3RTY3JpcHQ6IGJ1aWxkTW9kZVxyXG4gICAgICAvLyAgICAgICAgID8gYDxzY3JpcHQgc3JjPVwiL2luamVjdC5qc1wiPjwvc2NyaXB0PmBcclxuICAgICAgLy8gICAgICAgICA6ICcnXHJcbiAgICAgIC8vICAgICB9LFxyXG4gICAgICAvLyAgICAgZWpzT3B0aW9uczoge1xyXG4gICAgICAvLyAgICAgICBybVdoaXRlc3BhY2U6IHRydWVcclxuICAgICAgLy8gICAgIH1cclxuICAgICAgLy8gICB9LFxyXG4gICAgICAvLyAgIHRyYW5zZm9ybU9wdGlvbnM6IHtcclxuICAgICAgLy8gICAgIGFzc2V0c0luY2x1ZGU6IFtdXHJcbiAgICAgIC8vICAgfVxyXG4gICAgICAvLyB9KSxcclxuXHJcbiAgICAgIC8vIFZ1ZSBJMThuIChcdTc5ODFcdTc1MjhcdTk4ODRcdTdGMTZcdThCRDFcdTYzRDJcdTRFRjZcdTRFRTVcdTkwN0ZcdTUxNEQgZXNidWlsZCBcdTk1MTlcdThCRUYpXHJcbiAgICAgIC8vIHZ1ZS1pMThuIFx1OUVEOFx1OEJBNFx1NTNFRlx1NEVFNVx1NzZGNFx1NjNBNVx1NURFNVx1NEY1Q1x1RkYwQ1x1NEUwRFx1OTcwMFx1ODk4MSB1bnBsdWdpblxyXG4gICAgICAvLyB2dWVJMThuKHtcclxuICAgICAgLy8gICBzdHJpY3RNZXNzYWdlOiBmYWxzZSxcclxuICAgICAgLy8gICBzc3I6IGZhbHNlLFxyXG4gICAgICAvLyAgIGluY2x1ZGU6IHBhdGgucmVzb2x2ZShyb290LCAnLi9zcmMvaTE4bi9sb2NhbGVzLyoqJylcclxuICAgICAgLy8gfSksXHJcblxyXG4gICAgICAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzOEJcdTdGMjlcclxuICAgICAgYnVpbGRNb2RlICYmIHZpdGVDb21wcmVzc2lvbih7XHJcbiAgICAgICAgdmVyYm9zZTogZmFsc2UsXHJcbiAgICAgICAgdGhyZXNob2xkOiAxMDI0MCxcclxuICAgICAgICBhbGdvcml0aG06ICdnemlwJyxcclxuICAgICAgICBleHQ6ICcuZ3onXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gQnJvdGxpIFx1NTM4Qlx1N0YyOVx1RkYwOFx1NjZGNFx1NTk3RFx1NzY4NFx1NTM4Qlx1N0YyOVx1NzM4N1x1RkYwOVxyXG4gICAgICBidWlsZE1vZGUgJiYgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICB2ZXJib3NlOiBmYWxzZSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDEwMjQwLFxyXG4gICAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcclxuICAgICAgICBleHQ6ICcuYnInXHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gXHU2MjUzXHU1MzA1XHU0RjUzXHU3OUVGXHU1MjA2XHU2NzkwXHJcbiAgICAgIGJ1aWxkTW9kZSAmJiAodmlzdWFsaXplcih7XHJcbiAgICAgICAgb3BlbjogZmFsc2UsXHJcbiAgICAgICAgZ3ppcFNpemU6IHRydWUsXHJcbiAgICAgICAgYnJvdGxpU2l6ZTogdHJ1ZSxcclxuICAgICAgICBmaWxlbmFtZTogJ2Rpc3Qvc3RhdHMuaHRtbCdcclxuICAgICAgfSkgYXMgUGx1Z2luKVxyXG4gICAgXS5maWx0ZXIoQm9vbGVhbikgYXMgUGx1Z2luW10sXHJcblxyXG4gICAgLy8gXHU4REVGXHU1Rjg0XHU1MjJCXHU1NDBEXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgICAgJyMnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL3R5cGVzJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgfSxcclxuICAgICAgZXh0ZW5zaW9uczogWycudHMnLCAnLnRzeCcsICcudnVlJywgJy5qc3gnLCAnLmpzJywgJy5qc29uJ11cclxuICAgIH0sXHJcblxyXG4gICAgLy8gXHU0RjlEXHU4RDU2XHU5ODg0XHU2Nzg0XHU1RUZBXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgaW5jbHVkZTogW1xyXG4gICAgICAgICd2dWUnLFxyXG4gICAgICAgICd2dWUtcm91dGVyJyxcclxuICAgICAgICAncGluaWEnLFxyXG4gICAgICAgICdwaW5pYS1wbHVnaW4tcGVyc2lzdGVkc3RhdGUnLFxyXG4gICAgICAgICdlbGVtZW50LXBsdXMnLFxyXG4gICAgICAgICdAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZScsXHJcbiAgICAgICAgJ2F4aW9zJyxcclxuICAgICAgICAnZGF5anMnLFxyXG4gICAgICAgICdsb2Rhc2gtZXMnLFxyXG4gICAgICAgICdAdnVldXNlL2NvcmUnXHJcbiAgICAgIF1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgaG9zdDogJzAuMC4wLjAnLFxyXG4gICAgICBwb3J0OiBOdW1iZXIoZW52LlZJVEVfUE9SVCkgfHwgNTE3MyxcclxuICAgICAgb3BlbjogZW52LlZJVEVfT1BFTiA9PT0gJ3RydWUnLFxyXG4gICAgICBjb3JzOiB0cnVlLFxyXG4gICAgICBobXI6IHtcclxuICAgICAgICBvdmVybGF5OiB0cnVlXHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFx1OEJGN1x1NkM0Mlx1NEVFM1x1NzQwNlxyXG4gICAgICBwcm94eToge1xyXG4gICAgICAgICcvYXBpJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9BUElfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHA6IHN0cmluZykgPT4gcC5yZXBsYWNlKC9eXFwvYXBpLywgJycpLFxyXG4gICAgICAgICAgd3M6IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgICcvdXBsb2FkJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBlbnYuVklURV9VUExPQURfVVJMIHx8ICdodHRwOi8vbG9jYWxob3N0OjgwODAnLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBBSSBBUEkgXHU0RUUzXHU3NDA2IC0gXHU4OUUzXHU1MUIzXHU4REU4XHU1N0RGXHU5NUVFXHU5ODk4XHJcbiAgICAgICAgJy9haS1wcm94eSc6IHtcclxuICAgICAgICAgIHRhcmdldDogJ2h0dHBzOi8vZGFzaHNjb3BlLmFsaXl1bmNzLmNvbScsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocDogc3RyaW5nKSA9PiBwLnJlcGxhY2UoL15cXC9haS1wcm94eS8sICcvY29tcGF0aWJsZS1tb2RlL3YxJyksXHJcbiAgICAgICAgICBzZWN1cmU6IHRydWUsXHJcbiAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICdPcmlnaW4nOiAnaHR0cHM6Ly9kYXNoc2NvcGUuYWxpeXVuY3MuY29tJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgLy8gXHU1RjAwXHU1M0QxXHU2NzBEXHU1MkExXHU1NjY4XHU3NkQxXHU1NDJDXHJcbiAgICAgIHdhdGNoOiB7XHJcbiAgICAgICAgdXNlUG9sbGluZzogZmFsc2UsXHJcbiAgICAgICAgaWdub3JlZDogWycqKi9ub2RlX21vZHVsZXMvKionLCAnZGlzdC8qKiddXHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gQ1NTIFx1OTE0RFx1N0Y2RVxyXG4gICAgY3NzOiB7XHJcbiAgICAgIHByZXByb2Nlc3Nvck9wdGlvbnM6IHtcclxuICAgICAgICBzY3NzOiB7XHJcbiAgICAgICAgICBhZGRpdGlvbmFsRGF0YTogYGAsXHJcbiAgICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAgIGFwaTogJ21vZGVybi1jb21waWxlcidcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGRldlNvdXJjZW1hcDogIWJ1aWxkTW9kZVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTY3ODRcdTVFRkFcdTkxNERcdTdGNkVcclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsXHJcbiAgICAgIG91dERpcjogZW52LlZJVEVfT1VUX0RJUiB8fCAnZGlzdCcsXHJcbiAgICAgIGFzc2V0c0RpcjogJ2Fzc2V0cycsXHJcbiAgICAgIHNvdXJjZW1hcDogZW52LlZJVEVfU09VUkNFTUFQID09PSAndHJ1ZScgPyAnaGlkZGVuJyA6IGZhbHNlLFxyXG4gICAgICBtaW5pZnk6ICdlc2J1aWxkJyxcclxuICAgICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgICAvLyBcdTc5ODFcdTc1MjggZ3ppcCBcdTRFMEJcdTc2ODRcdTRFRTNcdTc4MDFcdTUyMDZcdTUyNzJcclxuICAgICAgcmVwb3J0Q29tcHJlc3NlZFNpemU6IGJ1aWxkTW9kZSxcclxuXHJcbiAgICAgIC8vIFJvbGx1cCBcdTkxNERcdTdGNkVcclxuICAgICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICAgIHRyZWVzaGFrZToge1xyXG4gICAgICAgICAgbW9kdWxlU2lkZUVmZmVjdHM6IHRydWUsIC8vIFx1NEZERFx1NzU1OVx1NjI0MFx1NjcwOVx1NkEyMVx1NTc1N1x1NzY4NFx1NTI2Rlx1NEY1Q1x1NzUyOFxyXG4gICAgICAgICAgcHJvcGVydHlSZWFkU2lkZUVmZmVjdHM6IGZhbHNlLFxyXG4gICAgICAgICAgdHJ5Q2F0Y2hEZW9wdGltaXphdGlvbjogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXHJcblxyXG4gICAgICAgICAgLy8gXHU2MjRCXHU1MkE4XHU1MjA2XHU1MzA1XHU3QjU2XHU3NTY1XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IChpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIE5vZGUgbW9kdWxlcyBcdTUyMDZcdTUzMDVcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAgIC8vIFx1Njg0Nlx1NjdCNlx1NjgzOFx1NUZDM1xyXG4gICAgICAgICAgICAgIGlmICgvbm9kZV9tb2R1bGVzXFwvKChAKT92dWUoLXJvdXRlcik/fHBpbmlhfHZ1ZS1pMThufEB2dWV1c2VcXC9jb3JlKS8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndnVlLWNvcmUnXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBVSSBcdTVFOTNcclxuICAgICAgICAgICAgICBpZiAoL25vZGVfbW9kdWxlc1xcL2VsZW1lbnQtcGx1cy8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZWxlbWVudC1wbHVzJ1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gXHU1NkZFXHU4ODY4XHU1RTkzXHJcbiAgICAgICAgICAgICAgaWYgKC9ub2RlX21vZHVsZXNcXC8oZWNoYXJ0c3x6cmVuZGVyKS8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZWNoYXJ0cydcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFx1NURFNVx1NTE3N1x1NUU5M1xyXG4gICAgICAgICAgICAgIGlmICgvbm9kZV9tb2R1bGVzXFwvKGF4aW9zfGRheWpzfGxvZGFzaHxtaXR0fGNyeXB0by1qc3xqc2VuY3J5cHQpLy50ZXN0KGlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd1dGlscydcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFx1NTZGRVx1NjgwN1x1NUU5M1xyXG4gICAgICAgICAgICAgIGlmICgvbm9kZV9tb2R1bGVzXFwvQGVsZW1lbnQtcGx1c1xcL2ljb25zLXZ1ZS8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnaWNvbnMnXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcidcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gXHU0RTFBXHU1MkExXHU0RUUzXHU3ODAxXHU2MzA5XHU2QTIxXHU1NzU3XHU1MjA2XHU1MzA1XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy92aWV3cy8nKSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gaWQubWF0Y2goL1xcL3NyY1xcL3ZpZXdzXFwvKFteL10rKVxcLy8pXHJcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYHZpZXdzLSR7bWF0Y2hbMV19YFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvc3JjL2FwaS8nKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnYXBpJ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvc3RvcmUvJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ3N0b3JlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NTE4NVx1ODA1NFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBhc3NldEluZm9cclxuICAgICAgICAgICAgaWYgKC9cXC4od29mZjI/fGVvdHx0dGZ8b3RmKSQvaS50ZXN0KG5hbWUgfHwgJycpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICdmb250cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgvXFwuKHBuZ3xqcGU/Z3xnaWZ8c3ZnfHdlYnB8YXZpZikkL2kudGVzdChuYW1lIHx8ICcnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnaW1hZ2VzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICdbZXh0XS9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIFx1NTkxNlx1OTBFOFx1NEY5RFx1OEQ1NlxyXG4gICAgICAgIGV4dGVybmFsOiBbXHJcbiAgICAgICAgICAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzRUZcdTgwRkRcdTk3MDBcdTg5ODFcdTU5MTZcdTkwRThcdTUzMTZcdTc2ODRcdTRGOURcdThENTZcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBcdTUzMDVcdTRGNTNcdTc5RUZcdThCNjZcdTU0NEFcdTk2MDhcdTUwM0NcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxyXG5cclxuICAgICAgLy8gXHU2QTIxXHU1NzU3IElEIFx1NTZGQVx1NUI5QVx1NTMxNlxyXG4gICAgICBtb2R1bGVJZHM6ICdkZXRlcm1pbmlzdGljJyxcclxuXHJcbiAgICAgIC8vIFx1NTM4Qlx1N0YyOVx1OTE0RFx1N0Y2RVxyXG4gICAgICBlc2J1aWxkOiB7XHJcbiAgICAgICAgZHJvcDogYnVpbGRNb2RlID8gWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10gOiBbXSxcclxuICAgICAgICBsZWdhbENvbW1lbnRzOiAnbm9uZScsXHJcbiAgICAgICAgbWluaWZ5SWRlbnRpZmllcnM6IGJ1aWxkTW9kZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFx1OTg4NFx1ODlDOFx1NjcwRFx1NTJBMVx1NTY2OFxyXG4gICAgcHJldmlldzoge1xyXG4gICAgICBwb3J0OiA0MTczLFxyXG4gICAgICBvcGVuOiB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEpTT04gXHU3RUE2XHU2NzVGXHJcbiAgICBqc29uOiB7XHJcbiAgICAgIHN0cmluZ2lmeTogdHJ1ZVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTdGMTNcdTVCNThcdTc2RUVcdTVGNTVcclxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlJyxcclxuXHJcbiAgICAvLyBcdTVCOUVcdTlBOENcdTYwMjdcdTkxNERcdTdGNkVcclxuICAgIGV4cGVyaW1lbnRhbDoge1xyXG4gICAgICAvLyBcdTY3ODRcdTVFRkFcdTY1RjZcdTc2ODRcdTVFNzZcdTg4NENcdTU5MDRcdTc0MDZcclxuICAgICAgYnVpbGRQYXJhbGxlbE1vZHVsZXM6IHRydWVcclxuICAgICAgLy8gUmVuZGVyIGNodW5rIGxpbmtcdUZGMDhcdTc5ODFcdTc1MjhcdUZGMENcdTkwN0ZcdTUxNEQgSFRNTCBcdTgxMUFcdTY3MkNcdThERUZcdTVGODRcdTk1RUVcdTk4OThcdUZGMDlcclxuICAgICAgLy8gcmVuZGVyQnVpbHRVcmwoZmlsZW5hbWU6IHN0cmluZykge1xyXG4gICAgICAvLyAgIGlmIChpc1Byb2R1Y3Rpb24obW9kZSkpIHtcclxuICAgICAgLy8gICAgIHJldHVybiB7IHJ1bnRpbWU6IGAvcHVibGljLyR7ZmlsZW5hbWV9YCB9XHJcbiAgICAgIC8vICAgfVxyXG4gICAgICAvLyAgIHJldHVybiB7IHJlbGF0aXZlOiB0cnVlIH1cclxuICAgICAgLy8gfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTY1RTVcdTVGRDdcdTdFQTdcdTUyMkJcclxuICAgIGxvZ0xldmVsOiAnaW5mbycsXHJcblxyXG4gICAgLy8gXHU2RTA1XHU5NjY0XHU1QzRGXHU1RTU1XHJcbiAgICBjbGVhclNjcmVlbjogZmFsc2VcclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcclxuZGVjbGFyZSBtb2R1bGUgJ3ZpdGUnIHtcclxuICBpbnRlcmZhY2UgVXNlckNvbmZpZyB7XHJcbiAgICAvLyBcdTgxRUFcdTVCOUFcdTRFNDlcdTkxNERcdTdGNkVcclxuICB9XHJcbn1cclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUtBLFNBQVMsY0FBYyxlQUE0QjtBQUNuRCxPQUFPLFNBQVM7QUFDaEIsT0FBTyxZQUFZO0FBQ25CLFNBQVMscUJBQXFCO0FBQzlCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLDJCQUEyQjtBQUNwQyxTQUFTLDRCQUE0QjtBQUVyQyxTQUFTLGtCQUFrQjtBQUMzQixPQUFPLHFCQUFxQjtBQUM1QixTQUFTLGVBQWUsV0FBVztBQUNuQyxPQUFPLFVBQVU7QUFsQmtLLElBQU0sMkNBQTJDO0FBc0JwTyxJQUFNLFVBQVUsQ0FBQyxTQUFpQixDQUFDLGNBQWMsUUFBUSxTQUFTLEVBQUUsU0FBUyxJQUFJO0FBR2pGLElBQU0sT0FBTyxRQUFRLElBQUk7QUFFekIsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxJQUFJO0FBQzlCLFFBQU0sWUFBWSxRQUFRLElBQUk7QUFFOUIsU0FBTztBQUFBO0FBQUEsSUFFTCxNQUFNLElBQUksa0JBQWtCO0FBQUE7QUFBQSxJQUc1QixTQUFTO0FBQUEs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

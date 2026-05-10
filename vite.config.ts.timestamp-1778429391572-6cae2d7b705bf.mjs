// vite.config.ts
import { defineConfig, loadEnv } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.40_sass@1.97.2_terser@5.46.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vi_c7c1e3da12ccb536dbc51507e9cea273/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1._b5ca1be64fe263ce0bcfaa7fa1a6da6e/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { viteMockServe } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite-plugin-mock@3.0.2_esbu_5fd0bbcb7e3dfc27f00885726dd52ff5/node_modules/vite-plugin-mock/dist/index.mjs";
import UnoCSS from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unocss@0.61.9_postcss@8.5.6_202a26d5240437f41fa81ed00185c1b3/node_modules/unocss/dist/vite.mjs";
import AutoImport from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unplugin-auto-import@0.17.8_716a096b578163c29fd963d6a98a2236/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unplugin-vue-components@0.2_cba32fd87801759e2f4e412db0413a0b/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/unplugin-vue-components@0.2_cba32fd87801759e2f4e412db0413a0b/node_modules/unplugin-vue-components/dist/resolvers.js";
import { createSvgIconsPlugin } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_776cb7b6e9723a80c826db6e4dbce680/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import { createHtmlPlugin } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite-plugin-html@3.2.2_vite_a5a9e1681ed6c82b16aa2809b0a3f12f/node_modules/vite-plugin-html/dist/index.mjs";
import { visualizer } from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/rollup-plugin-visualizer@5.14.0_rollup@4.55.1/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import viteCompression from "file:///E:/my-work2025/meoo-plan/meoo-plan/node_modules/.pnpm/vite-plugin-compression@0.5_631bf6c2cca0f1bfbd0500d44ff6e9ca/node_modules/vite-plugin-compression/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
import path from "node:path";
var __vite_injected_original_import_meta_url = "file:///E:/my-work2025/meoo-plan/meoo-plan/vite.config.ts";
var isProduction = (mode) => mode === "production";
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
      // HTML 模板
      createHtmlPlugin({
        minify: buildMode,
        template: "index.html",
        inject: {
          data: {
            title: env.VITE_APP_TITLE || "\u7BA1\u7406\u7CFB\u7EDF",
            injectScript: buildMode ? `<script src="/inject.js"></script>` : ""
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
        filename: "dist/stats.html",
        backgroundColor: "#f5f5f5"
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
          moduleSideEffects: (id) => {
            if (id.includes("virtual:")) return false;
            if (id.includes("element-plus/theme-chalk")) return true;
            return false;
          },
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
      buildParallelModules: true,
      // Render chunk link
      renderBuiltUrl(filename) {
        if (isProduction(mode)) {
          return { runtime: `/public/${filename}` };
        }
        return { relative: true };
      }
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxteS13b3JrMjAyNVxcXFxtZW9vLXBsYW5cXFxcbWVvby1wbGFuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxteS13b3JrMjAyNVxcXFxtZW9vLXBsYW5cXFxcbWVvby1wbGFuXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9teS13b3JrMjAyNS9tZW9vLXBsYW4vbWVvby1wbGFuL3ZpdGUuY29uZmlnLnRzXCI7LyoqXHJcbiAqIFZpdGUgXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHJcbiAqIEBkZXNjcmlwdGlvbiBWaXRlICsgVnVlMyArIFR5cGVTY3JpcHQgXHU0RjAxXHU0RTFBXHU3RUE3XHU1NDBFXHU1M0YwXHU3QkExXHU3NDA2XHU3Q0ZCXHU3RURGXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCB0eXBlIFBsdWdpbiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnXHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXHJcblxyXG4vLyBcdTczQUZcdTU4ODNcdTUyMjRcdTY1QURcclxuY29uc3QgaXNQcm9kdWN0aW9uID0gKG1vZGU6IHN0cmluZykgPT4gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nXHJcbmNvbnN0IGlzQnVpbGQgPSAobW9kZTogc3RyaW5nKSA9PiBbJ3Byb2R1Y3Rpb24nLCAndGVzdCcsICdzdGFnaW5nJ10uaW5jbHVkZXMobW9kZSlcclxuXHJcbi8vIFx1ODNCN1x1NTNENlx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVxyXG5jb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdClcclxuICBjb25zdCBidWlsZE1vZGUgPSBpc0J1aWxkKG1vZGUpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAvLyBcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcclxuICAgIGJhc2U6IGVudi5WSVRFX0JBU0VfUEFUSCB8fCAnLycsXHJcblxyXG4gICAgLy8gXHU2M0QyXHU0RUY2XHU5MTREXHU3RjZFXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICB2dWVKc3goKSxcclxuICAgICAgVW5vQ1NTKCksXHJcblxyXG4gICAgICAvLyBNb2NrIFx1NjU3MFx1NjM2RVxyXG4gICAgICB2aXRlTW9ja1NlcnZlKHtcclxuICAgICAgICBtb2NrUGF0aDogJ21vY2snLFxyXG4gICAgICAgIGVuYWJsZTogYnVpbGRNb2RlIHx8IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXHJcbiAgICAgICAgd2F0Y2hGaWxlczogdHJ1ZVxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBBUElcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAncGluaWEnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZSdcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlIC8vIFx1Nzk4MVx1NzUyOFx1NEVFNVx1OTA3Rlx1NTE0RCBlc2xpbnQgXHU1MUIyXHU3QTgxXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBpbXBvcnRTdHlsZTogJ3Nhc3MnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIF1cclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgaW1wb3J0U3R5bGU6ICdzYXNzJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9jb21wb25lbnRzLmQudHMnLFxyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ3RzeCcsICdqc3gnXSxcclxuICAgICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgICAvXFwudnVlJC8sXHJcbiAgICAgICAgICAvXFwudnVlXFw/dnVlLyxcclxuICAgICAgICAgIC9cXC50c3gkLyxcclxuICAgICAgICAgIC9cXC5qc3gkL1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgLy8gXHU3RUM0XHU0RUY2XHU1NDBEXHU3OUYwXHU4RjZDXHU2MzYyXHJcbiAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsXHJcbiAgICAgICAgZ2xvYmFsTmFtZXNwYWNlczogWydjb21wb25lbnRzJ11cclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBTVkcgXHU1NkZFXHU2ODA3XHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICBpY29uRGlyczogW1xyXG4gICAgICAgICAgcGF0aC5yZXNvbHZlKHJvb3QsICdzcmMvYXNzZXRzL2ljb25zJylcclxuICAgICAgICBdLFxyXG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bbmFtZV0nLFxyXG4gICAgICAgIGluamVjdDogJ2JvZHktbGFzdCcsXHJcbiAgICAgICAgY3VzdG9tRG9tSWQ6ICdfX3N2Z19faWNvbnNfX2RvbV9fJ1xyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIEhUTUwgXHU2QTIxXHU2NzdGXHJcbiAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICAgIG1pbmlmeTogYnVpbGRNb2RlLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBlbnYuVklURV9BUFBfVElUTEUgfHwgJ1x1N0JBMVx1NzQwNlx1N0NGQlx1N0VERicsXHJcbiAgICAgICAgICAgIGluamVjdFNjcmlwdDogYnVpbGRNb2RlXHJcbiAgICAgICAgICAgICAgPyBgPHNjcmlwdCBzcmM9XCIvaW5qZWN0LmpzXCI+PC9zY3JpcHQ+YFxyXG4gICAgICAgICAgICAgIDogJydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gVnVlIEkxOG4gKFx1Nzk4MVx1NzUyOFx1OTg4NFx1N0YxNlx1OEJEMVx1NjNEMlx1NEVGNlx1NEVFNVx1OTA3Rlx1NTE0RCBlc2J1aWxkIFx1OTUxOVx1OEJFRilcclxuICAgICAgLy8gdnVlLWkxOG4gXHU5RUQ4XHU4QkE0XHU1M0VGXHU0RUU1XHU3NkY0XHU2M0E1XHU1REU1XHU0RjVDXHVGRjBDXHU0RTBEXHU5NzAwXHU4OTgxIHVucGx1Z2luXHJcbiAgICAgIC8vIHZ1ZUkxOG4oe1xyXG4gICAgICAvLyAgIHN0cmljdE1lc3NhZ2U6IGZhbHNlLFxyXG4gICAgICAvLyAgIHNzcjogZmFsc2UsXHJcbiAgICAgIC8vICAgaW5jbHVkZTogcGF0aC5yZXNvbHZlKHJvb3QsICcuL3NyYy9pMThuL2xvY2FsZXMvKionKVxyXG4gICAgICAvLyB9KSxcclxuXHJcbiAgICAgIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTM4Qlx1N0YyOVxyXG4gICAgICBidWlsZE1vZGUgJiYgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICB2ZXJib3NlOiBmYWxzZSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDEwMjQwLFxyXG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxyXG4gICAgICAgIGV4dDogJy5neidcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBCcm90bGkgXHU1MzhCXHU3RjI5XHVGRjA4XHU2NkY0XHU1OTdEXHU3Njg0XHU1MzhCXHU3RjI5XHU3Mzg3XHVGRjA5XHJcbiAgICAgIGJ1aWxkTW9kZSAmJiB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICAgIHZlcmJvc2U6IGZhbHNlLFxyXG4gICAgICAgIHRocmVzaG9sZDogMTAyNDAsXHJcbiAgICAgICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLFxyXG4gICAgICAgIGV4dDogJy5icidcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBcdTYyNTNcdTUzMDVcdTRGNTNcdTc5RUZcdTUyMDZcdTY3OTBcclxuICAgICAgYnVpbGRNb2RlICYmICh2aXN1YWxpemVyKHtcclxuICAgICAgICBvcGVuOiBmYWxzZSxcclxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcclxuICAgICAgICBicm90bGlTaXplOiB0cnVlLFxyXG4gICAgICAgIGZpbGVuYW1lOiAnZGlzdC9zdGF0cy5odG1sJyxcclxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjZjVmNWY1J1xyXG4gICAgICB9KSBhcyBQbHVnaW4pXHJcbiAgICBdLmZpbHRlcihCb29sZWFuKSBhcyBQbHVnaW5bXSxcclxuXHJcbiAgICAvLyBcdThERUZcdTVGODRcdTUyMkJcdTU0MERcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICAnIyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvdHlwZXMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICB9LFxyXG4gICAgICBleHRlbnNpb25zOiBbJy50cycsICcudHN4JywgJy52dWUnLCAnLmpzeCcsICcuanMnLCAnLmpzb24nXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICdwaW5pYScsXHJcbiAgICAgICAgJ3BpbmlhLXBsdWdpbi1wZXJzaXN0ZWRzdGF0ZScsXHJcbiAgICAgICAgJ2VsZW1lbnQtcGx1cycsXHJcbiAgICAgICAgJ0BlbGVtZW50LXBsdXMvaWNvbnMtdnVlJyxcclxuICAgICAgICAnYXhpb3MnLFxyXG4gICAgICAgICdkYXlqcycsXHJcbiAgICAgICAgJ2xvZGFzaC1lcycsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZSdcclxuICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIHBvcnQ6IE51bWJlcihlbnYuVklURV9QT1JUKSB8fCA1MTczLFxyXG4gICAgICBvcGVuOiBlbnYuVklURV9PUEVOID09PSAndHJ1ZScsXHJcbiAgICAgIGNvcnM6IHRydWUsXHJcbiAgICAgIGhtcjoge1xyXG4gICAgICAgIG92ZXJsYXk6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgLy8gXHU4QkY3XHU2QzQyXHU0RUUzXHU3NDA2XHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQSV9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocDogc3RyaW5nKSA9PiBwLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgICAgICB3czogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJy91cGxvYWQnOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1VQTE9BRF9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIFx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1NzZEMVx1NTQyQ1xyXG4gICAgICB3YXRjaDoge1xyXG4gICAgICAgIHVzZVBvbGxpbmc6IGZhbHNlLFxyXG4gICAgICAgIGlnbm9yZWQ6IFsnKiovbm9kZV9tb2R1bGVzLyoqJywgJ2Rpc3QvKionXVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIENTUyBcdTkxNERcdTdGNkVcclxuICAgIGNzczoge1xyXG4gICAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XHJcbiAgICAgICAgc2Nzczoge1xyXG4gICAgICAgICAgYWRkaXRpb25hbERhdGE6IGBgLFxyXG4gICAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgICBhcGk6ICdtb2Rlcm4tY29tcGlsZXInXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBkZXZTb3VyY2VtYXA6ICFidWlsZE1vZGVcclxuICAgIH0sXHJcblxyXG4gICAgLy8gXHU2Nzg0XHU1RUZBXHU5MTREXHU3RjZFXHJcbiAgICBidWlsZDoge1xyXG4gICAgICB0YXJnZXQ6ICdlc25leHQnLFxyXG4gICAgICBvdXREaXI6IGVudi5WSVRFX09VVF9ESVIgfHwgJ2Rpc3QnLFxyXG4gICAgICBhc3NldHNEaXI6ICdhc3NldHMnLFxyXG4gICAgICBzb3VyY2VtYXA6IGVudi5WSVRFX1NPVVJDRU1BUCA9PT0gJ3RydWUnID8gJ2hpZGRlbicgOiBmYWxzZSxcclxuICAgICAgbWluaWZ5OiAnZXNidWlsZCcsXHJcbiAgICAgIGNzc0NvZGVTcGxpdDogdHJ1ZSxcclxuICAgICAgLy8gXHU3OTgxXHU3NTI4IGd6aXAgXHU0RTBCXHU3Njg0XHU0RUUzXHU3ODAxXHU1MjA2XHU1MjcyXHJcbiAgICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBidWlsZE1vZGUsXHJcblxyXG4gICAgICAvLyBSb2xsdXAgXHU5MTREXHU3RjZFXHJcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgICB0cmVlc2hha2U6IHtcclxuICAgICAgICAgIG1vZHVsZVNpZGVFZmZlY3RzOiAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAvLyBcdTRGRERcdTc1NTlcdTUyNkZcdTRGNUNcdTc1MjhcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCd2aXJ0dWFsOicpKSByZXR1cm4gZmFsc2VcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdlbGVtZW50LXBsdXMvdGhlbWUtY2hhbGsnKSkgcmV0dXJuIHRydWVcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgcHJvcGVydHlSZWFkU2lkZUVmZmVjdHM6IGZhbHNlLFxyXG4gICAgICAgICAgdHJ5Q2F0Y2hEZW9wdGltaXphdGlvbjogdHJ1ZVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdqcy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXHJcblxyXG4gICAgICAgICAgLy8gXHU2MjRCXHU1MkE4XHU1MjA2XHU1MzA1XHU3QjU2XHU3NTY1XHJcbiAgICAgICAgICBtYW51YWxDaHVua3M6IChpZDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIE5vZGUgbW9kdWxlcyBcdTUyMDZcdTUzMDVcclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICAgIC8vIFx1Njg0Nlx1NjdCNlx1NjgzOFx1NUZDM1xyXG4gICAgICAgICAgICAgIGlmICgvbm9kZV9tb2R1bGVzXFwvKChAKT92dWUoLXJvdXRlcik/fHBpbmlhfHZ1ZS1pMThufEB2dWV1c2VcXC9jb3JlKS8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndnVlLWNvcmUnXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBVSSBcdTVFOTNcclxuICAgICAgICAgICAgICBpZiAoL25vZGVfbW9kdWxlc1xcL2VsZW1lbnQtcGx1cy8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZWxlbWVudC1wbHVzJ1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gXHU1NkZFXHU4ODY4XHU1RTkzXHJcbiAgICAgICAgICAgICAgaWYgKC9ub2RlX21vZHVsZXNcXC8oZWNoYXJ0c3x6cmVuZGVyKS8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnZWNoYXJ0cydcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFx1NURFNVx1NTE3N1x1NUU5M1xyXG4gICAgICAgICAgICAgIGlmICgvbm9kZV9tb2R1bGVzXFwvKGF4aW9zfGRheWpzfGxvZGFzaHxtaXR0fGNyeXB0by1qc3xqc2VuY3J5cHQpLy50ZXN0KGlkKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuICd1dGlscydcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFx1NTZGRVx1NjgwN1x1NUU5M1xyXG4gICAgICAgICAgICAgIGlmICgvbm9kZV9tb2R1bGVzXFwvQGVsZW1lbnQtcGx1c1xcL2ljb25zLXZ1ZS8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAnaWNvbnMnXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICByZXR1cm4gJ3ZlbmRvcidcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gXHU0RTFBXHU1MkExXHU0RUUzXHU3ODAxXHU2MzA5XHU2QTIxXHU1NzU3XHU1MjA2XHU1MzA1XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy92aWV3cy8nKSkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IG1hdGNoID0gaWQubWF0Y2goL1xcL3NyY1xcL3ZpZXdzXFwvKFteL10rKVxcLy8pXHJcbiAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYHZpZXdzLSR7bWF0Y2hbMV19YFxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvc3JjL2FwaS8nKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnYXBpJ1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvc3RvcmUvJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ3N0b3JlJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgIC8vIFx1OTc1OVx1NjAwMVx1OEQ0NFx1NkU5MFx1NTE4NVx1ODA1NFxyXG4gICAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBuYW1lIH0gPSBhc3NldEluZm9cclxuICAgICAgICAgICAgaWYgKC9cXC4od29mZjI/fGVvdHx0dGZ8b3RmKSQvaS50ZXN0KG5hbWUgfHwgJycpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICdmb250cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICgvXFwuKHBuZ3xqcGU/Z3xnaWZ8c3ZnfHdlYnB8YXZpZikkL2kudGVzdChuYW1lIHx8ICcnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnaW1hZ2VzL1tuYW1lXS1baGFzaF1bZXh0bmFtZV0nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICdbZXh0XS9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIFx1NTkxNlx1OTBFOFx1NEY5RFx1OEQ1NlxyXG4gICAgICAgIGV4dGVybmFsOiBbXHJcbiAgICAgICAgICAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzRUZcdTgwRkRcdTk3MDBcdTg5ODFcdTU5MTZcdTkwRThcdTUzMTZcdTc2ODRcdTRGOURcdThENTZcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcblxyXG4gICAgICAvLyBcdTUzMDVcdTRGNTNcdTc5RUZcdThCNjZcdTU0NEFcdTk2MDhcdTUwM0NcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDAwLFxyXG5cclxuICAgICAgLy8gXHU2QTIxXHU1NzU3IElEIFx1NTZGQVx1NUI5QVx1NTMxNlxyXG4gICAgICBtb2R1bGVJZHM6ICdkZXRlcm1pbmlzdGljJyxcclxuXHJcbiAgICAgIC8vIFx1NTM4Qlx1N0YyOVx1OTE0RFx1N0Y2RVxyXG4gICAgICBlc2J1aWxkOiB7XHJcbiAgICAgICAgZHJvcDogYnVpbGRNb2RlID8gWydjb25zb2xlJywgJ2RlYnVnZ2VyJ10gOiBbXSxcclxuICAgICAgICBsZWdhbENvbW1lbnRzOiAnbm9uZScsXHJcbiAgICAgICAgbWluaWZ5SWRlbnRpZmllcnM6IGJ1aWxkTW9kZVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFx1OTg4NFx1ODlDOFx1NjcwRFx1NTJBMVx1NTY2OFxyXG4gICAgcHJldmlldzoge1xyXG4gICAgICBwb3J0OiA0MTczLFxyXG4gICAgICBvcGVuOiB0cnVlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIEpTT04gXHU3RUE2XHU2NzVGXHJcbiAgICBqc29uOiB7XHJcbiAgICAgIHN0cmluZ2lmeTogdHJ1ZVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTdGMTNcdTVCNThcdTc2RUVcdTVGNTVcclxuICAgIGNhY2hlRGlyOiAnbm9kZV9tb2R1bGVzLy52aXRlJyxcclxuXHJcbiAgICAvLyBcdTVCOUVcdTlBOENcdTYwMjdcdTkxNERcdTdGNkVcclxuICAgIGV4cGVyaW1lbnRhbDoge1xyXG4gICAgICAvLyBcdTY3ODRcdTVFRkFcdTY1RjZcdTc2ODRcdTVFNzZcdTg4NENcdTU5MDRcdTc0MDZcclxuICAgICAgYnVpbGRQYXJhbGxlbE1vZHVsZXM6IHRydWUsXHJcbiAgICAgIC8vIFJlbmRlciBjaHVuayBsaW5rXHJcbiAgICAgIHJlbmRlckJ1aWx0VXJsKGZpbGVuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAoaXNQcm9kdWN0aW9uKG1vZGUpKSB7XHJcbiAgICAgICAgICByZXR1cm4geyBydW50aW1lOiBgL3B1YmxpYy8ke2ZpbGVuYW1lfWAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4geyByZWxhdGl2ZTogdHJ1ZSB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgLy8gXHU2NUU1XHU1RkQ3XHU3RUE3XHU1MjJCXHJcbiAgICBsb2dMZXZlbDogJ2luZm8nLFxyXG5cclxuICAgIC8vIFx1NkUwNVx1OTY2NFx1NUM0Rlx1NUU1NVxyXG4gICAgY2xlYXJTY3JlZW46IGZhbHNlXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gXHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHJcbmRlY2xhcmUgbW9kdWxlICd2aXRlJyB7XHJcbiAgaW50ZXJmYWNlIFVzZXJDb25maWcge1xyXG4gICAgLy8gXHU4MUVBXHU1QjlBXHU0RTQ5XHU5MTREXHU3RjZFXHJcbiAgfVxyXG59XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFLQSxTQUFTLGNBQWMsZUFBNEI7QUFDbkQsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsU0FBUyw0QkFBNEI7QUFDckMsU0FBUyx3QkFBd0I7QUFDakMsU0FBUyxrQkFBa0I7QUFDM0IsT0FBTyxx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

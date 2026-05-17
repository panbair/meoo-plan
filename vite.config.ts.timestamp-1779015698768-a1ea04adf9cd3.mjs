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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxteS13b3JrMjAyNVxcXFxtZW9vLXBsYW5cXFxcbWVvby1wbGFuXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxteS13b3JrMjAyNVxcXFxtZW9vLXBsYW5cXFxcbWVvby1wbGFuXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9FOi9teS13b3JrMjAyNS9tZW9vLXBsYW4vbWVvby1wbGFuL3ZpdGUuY29uZmlnLnRzXCI7LyoqXHJcbiAqIFZpdGUgXHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XHJcbiAqIEBkZXNjcmlwdGlvbiBWaXRlICsgVnVlMyArIFR5cGVTY3JpcHQgXHU0RjAxXHU0RTFBXHU3RUE3XHU1NDBFXHU1M0YwXHU3QkExXHU3NDA2XHU3Q0ZCXHU3RURGXHJcbiAqL1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52LCB0eXBlIFBsdWdpbiB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmltcG9ydCB7IHZpdGVNb2NrU2VydmUgfSBmcm9tICd2aXRlLXBsdWdpbi1tb2NrJ1xyXG5pbXBvcnQgVW5vQ1NTIGZyb20gJ3Vub2Nzcy92aXRlJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tICd1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlJ1xyXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xyXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN2Zy1pY29ucydcclxuaW1wb3J0IHsgY3JlYXRlSHRtbFBsdWdpbiB9IGZyb20gJ3ZpdGUtcGx1Z2luLWh0bWwnXHJcbmltcG9ydCB7IHZpc3VhbGl6ZXIgfSBmcm9tICdyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXInXHJcbmltcG9ydCB2aXRlQ29tcHJlc3Npb24gZnJvbSAndml0ZS1wbHVnaW4tY29tcHJlc3Npb24nXHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gJ25vZGU6dXJsJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXHJcblxyXG4vLyBcdTczQUZcdTU4ODNcdTUyMjRcdTY1QURcclxuY29uc3QgaXNQcm9kdWN0aW9uID0gKG1vZGU6IHN0cmluZykgPT4gbW9kZSA9PT0gJ3Byb2R1Y3Rpb24nXHJcbmNvbnN0IGlzQnVpbGQgPSAobW9kZTogc3RyaW5nKSA9PiBbJ3Byb2R1Y3Rpb24nLCAndGVzdCcsICdzdGFnaW5nJ10uaW5jbHVkZXMobW9kZSlcclxuXHJcbi8vIFx1ODNCN1x1NTNENlx1OTg3OVx1NzZFRVx1NjgzOVx1NzZFRVx1NUY1NVxyXG5jb25zdCByb290ID0gcHJvY2Vzcy5jd2QoKVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcm9vdClcclxuICBjb25zdCBidWlsZE1vZGUgPSBpc0J1aWxkKG1vZGUpXHJcblxyXG4gIHJldHVybiB7XHJcbiAgICAvLyBcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcclxuICAgIGJhc2U6IGVudi5WSVRFX0JBU0VfUEFUSCB8fCAnLycsXHJcblxyXG4gICAgLy8gXHU2M0QyXHU0RUY2XHU5MTREXHU3RjZFXHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICB2dWVKc3goKSxcclxuICAgICAgVW5vQ1NTKCksXHJcblxyXG4gICAgICAvLyBNb2NrIFx1NjU3MFx1NjM2RVxyXG4gICAgICB2aXRlTW9ja1NlcnZlKHtcclxuICAgICAgICBtb2NrUGF0aDogJ21vY2snLFxyXG4gICAgICAgIGVuYWJsZTogYnVpbGRNb2RlIHx8IG1vZGUgPT09ICdkZXZlbG9wbWVudCcsXHJcbiAgICAgICAgd2F0Y2hGaWxlczogdHJ1ZVxyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBBUElcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogW1xyXG4gICAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgICAndnVlLXJvdXRlcicsXHJcbiAgICAgICAgICAncGluaWEnLFxyXG4gICAgICAgICAgJ0B2dWV1c2UvY29yZSdcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9hdXRvLWltcG9ydHMuZC50cycsXHJcbiAgICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlIC8vIFx1Nzk4MVx1NzUyOFx1NEVFNVx1OTA3Rlx1NTE0RCBlc2xpbnQgXHU1MUIyXHU3QTgxXHJcbiAgICAgICAgfSxcclxuICAgICAgICByZXNvbHZlcnM6IFtcclxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xyXG4gICAgICAgICAgICBpbXBvcnRTdHlsZTogJ3Nhc3MnXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIF1cclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTdFQzRcdTRFRjZcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbXHJcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHtcclxuICAgICAgICAgICAgaW1wb3J0U3R5bGU6ICdzYXNzJ1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICBdLFxyXG4gICAgICAgIGR0czogJ3NyYy90eXBlcy9jb21wb25lbnRzLmQudHMnLFxyXG4gICAgICAgIGV4dGVuc2lvbnM6IFsndnVlJywgJ3RzeCcsICdqc3gnXSxcclxuICAgICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgICAvXFwudnVlJC8sXHJcbiAgICAgICAgICAvXFwudnVlXFw/dnVlLyxcclxuICAgICAgICAgIC9cXC50c3gkLyxcclxuICAgICAgICAgIC9cXC5qc3gkL1xyXG4gICAgICAgIF0sXHJcbiAgICAgICAgLy8gXHU3RUM0XHU0RUY2XHU1NDBEXHU3OUYwXHU4RjZDXHU2MzYyXHJcbiAgICAgICAgZGlyZWN0b3J5QXNOYW1lc3BhY2U6IHRydWUsXHJcbiAgICAgICAgZ2xvYmFsTmFtZXNwYWNlczogWydjb21wb25lbnRzJ11cclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBTVkcgXHU1NkZFXHU2ODA3XHJcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcclxuICAgICAgICBpY29uRGlyczogW1xyXG4gICAgICAgICAgcGF0aC5yZXNvbHZlKHJvb3QsICdzcmMvYXNzZXRzL2ljb25zJylcclxuICAgICAgICBdLFxyXG4gICAgICAgIHN5bWJvbElkOiAnaWNvbi1bbmFtZV0nLFxyXG4gICAgICAgIGluamVjdDogJ2JvZHktbGFzdCcsXHJcbiAgICAgICAgY3VzdG9tRG9tSWQ6ICdfX3N2Z19faWNvbnNfX2RvbV9fJ1xyXG4gICAgICB9KSxcclxuXHJcbiAgICAgIC8vIEhUTUwgXHU2QTIxXHU2NzdGXHJcbiAgICAgIGNyZWF0ZUh0bWxQbHVnaW4oe1xyXG4gICAgICAgIG1pbmlmeTogYnVpbGRNb2RlLFxyXG4gICAgICAgIHRlbXBsYXRlOiAnaW5kZXguaHRtbCcsXHJcbiAgICAgICAgaW5qZWN0OiB7XHJcbiAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIHRpdGxlOiBlbnYuVklURV9BUFBfVElUTEUgfHwgJ1x1N0JBMVx1NzQwNlx1N0NGQlx1N0VERicsXHJcbiAgICAgICAgICAgIGluamVjdFNjcmlwdDogYnVpbGRNb2RlXHJcbiAgICAgICAgICAgICAgPyBgPHNjcmlwdCBzcmM9XCIvaW5qZWN0LmpzXCI+PC9zY3JpcHQ+YFxyXG4gICAgICAgICAgICAgIDogJydcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG5cclxuICAgICAgLy8gVnVlIEkxOG4gKFx1Nzk4MVx1NzUyOFx1OTg4NFx1N0YxNlx1OEJEMVx1NjNEMlx1NEVGNlx1NEVFNVx1OTA3Rlx1NTE0RCBlc2J1aWxkIFx1OTUxOVx1OEJFRilcclxuICAgICAgLy8gdnVlLWkxOG4gXHU5RUQ4XHU4QkE0XHU1M0VGXHU0RUU1XHU3NkY0XHU2M0E1XHU1REU1XHU0RjVDXHVGRjBDXHU0RTBEXHU5NzAwXHU4OTgxIHVucGx1Z2luXHJcbiAgICAgIC8vIHZ1ZUkxOG4oe1xyXG4gICAgICAvLyAgIHN0cmljdE1lc3NhZ2U6IGZhbHNlLFxyXG4gICAgICAvLyAgIHNzcjogZmFsc2UsXHJcbiAgICAgIC8vICAgaW5jbHVkZTogcGF0aC5yZXNvbHZlKHJvb3QsICcuL3NyYy9pMThuL2xvY2FsZXMvKionKVxyXG4gICAgICAvLyB9KSxcclxuXHJcbiAgICAgIC8vIFx1NzUxRlx1NEVBN1x1NzNBRlx1NTg4M1x1NTM4Qlx1N0YyOVxyXG4gICAgICBidWlsZE1vZGUgJiYgdml0ZUNvbXByZXNzaW9uKHtcclxuICAgICAgICB2ZXJib3NlOiBmYWxzZSxcclxuICAgICAgICB0aHJlc2hvbGQ6IDEwMjQwLFxyXG4gICAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxyXG4gICAgICAgIGV4dDogJy5neidcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBCcm90bGkgXHU1MzhCXHU3RjI5XHVGRjA4XHU2NkY0XHU1OTdEXHU3Njg0XHU1MzhCXHU3RjI5XHU3Mzg3XHVGRjA5XHJcbiAgICAgIGJ1aWxkTW9kZSAmJiB2aXRlQ29tcHJlc3Npb24oe1xyXG4gICAgICAgIHZlcmJvc2U6IGZhbHNlLFxyXG4gICAgICAgIHRocmVzaG9sZDogMTAyNDAsXHJcbiAgICAgICAgYWxnb3JpdGhtOiAnYnJvdGxpQ29tcHJlc3MnLFxyXG4gICAgICAgIGV4dDogJy5icidcclxuICAgICAgfSksXHJcblxyXG4gICAgICAvLyBcdTYyNTNcdTUzMDVcdTRGNTNcdTc5RUZcdTUyMDZcdTY3OTBcclxuICAgICAgYnVpbGRNb2RlICYmICh2aXN1YWxpemVyKHtcclxuICAgICAgICBvcGVuOiBmYWxzZSxcclxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcclxuICAgICAgICBicm90bGlTaXplOiB0cnVlLFxyXG4gICAgICAgIGZpbGVuYW1lOiAnZGlzdC9zdGF0cy5odG1sJ1xyXG4gICAgICB9KSBhcyBQbHVnaW4pXHJcbiAgICBdLmZpbHRlcihCb29sZWFuKSBhcyBQbHVnaW5bXSxcclxuXHJcbiAgICAvLyBcdThERUZcdTVGODRcdTUyMkJcdTU0MERcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgICAgICAnIyc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMvdHlwZXMnLCBpbXBvcnQubWV0YS51cmwpKVxyXG4gICAgICB9LFxyXG4gICAgICBleHRlbnNpb25zOiBbJy50cycsICcudHN4JywgJy52dWUnLCAnLmpzeCcsICcuanMnLCAnLmpzb24nXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTRGOURcdThENTZcdTk4ODRcdTY3ODRcdTVFRkFcclxuICAgIG9wdGltaXplRGVwczoge1xyXG4gICAgICBpbmNsdWRlOiBbXHJcbiAgICAgICAgJ3Z1ZScsXHJcbiAgICAgICAgJ3Z1ZS1yb3V0ZXInLFxyXG4gICAgICAgICdwaW5pYScsXHJcbiAgICAgICAgJ3BpbmlhLXBsdWdpbi1wZXJzaXN0ZWRzdGF0ZScsXHJcbiAgICAgICAgJ2VsZW1lbnQtcGx1cycsXHJcbiAgICAgICAgJ0BlbGVtZW50LXBsdXMvaWNvbnMtdnVlJyxcclxuICAgICAgICAnYXhpb3MnLFxyXG4gICAgICAgICdkYXlqcycsXHJcbiAgICAgICAgJ2xvZGFzaC1lcycsXHJcbiAgICAgICAgJ0B2dWV1c2UvY29yZSdcclxuICAgICAgXVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcclxuICAgIHNlcnZlcjoge1xyXG4gICAgICBob3N0OiAnMC4wLjAuMCcsXHJcbiAgICAgIHBvcnQ6IE51bWJlcihlbnYuVklURV9QT1JUKSB8fCA1MTczLFxyXG4gICAgICBvcGVuOiBlbnYuVklURV9PUEVOID09PSAndHJ1ZScsXHJcbiAgICAgIGNvcnM6IHRydWUsXHJcbiAgICAgIGhtcjoge1xyXG4gICAgICAgIG92ZXJsYXk6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgLy8gXHU4QkY3XHU2QzQyXHU0RUUzXHU3NDA2XHJcbiAgICAgIHByb3h5OiB7XHJcbiAgICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQSV9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocDogc3RyaW5nKSA9PiBwLnJlcGxhY2UoL15cXC9hcGkvLCAnJyksXHJcbiAgICAgICAgICB3czogdHJ1ZVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJy91cGxvYWQnOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1VQTE9BRF9VUkwgfHwgJ2h0dHA6Ly9sb2NhbGhvc3Q6ODA4MCcsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWVcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEFJIEFQSSBcdTRFRTNcdTc0MDYgLSBcdTg5RTNcdTUxQjNcdThERThcdTU3REZcdTk1RUVcdTk4OThcclxuICAgICAgICAnL2FpLXByb3h5Jzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly9kYXNoc2NvcGUuYWxpeXVuY3MuY29tJyxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwOiBzdHJpbmcpID0+IHAucmVwbGFjZSgvXlxcL2FpLXByb3h5LywgJy9jb21wYXRpYmxlLW1vZGUvdjEnKSxcclxuICAgICAgICAgIHNlY3VyZTogdHJ1ZSxcclxuICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgJ09yaWdpbic6ICdodHRwczovL2Rhc2hzY29wZS5hbGl5dW5jcy5jb20nXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAvLyBcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTc2RDFcdTU0MkNcclxuICAgICAgd2F0Y2g6IHtcclxuICAgICAgICB1c2VQb2xsaW5nOiBmYWxzZSxcclxuICAgICAgICBpZ25vcmVkOiBbJyoqL25vZGVfbW9kdWxlcy8qKicsICdkaXN0LyoqJ11cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBDU1MgXHU5MTREXHU3RjZFXHJcbiAgICBjc3M6IHtcclxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xyXG4gICAgICAgIHNjc3M6IHtcclxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgYCxcclxuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZGV2U291cmNlbWFwOiAhYnVpbGRNb2RlXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFx1Njc4NFx1NUVGQVx1OTE0RFx1N0Y2RVxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgICAgb3V0RGlyOiBlbnYuVklURV9PVVRfRElSIHx8ICdkaXN0JyxcclxuICAgICAgYXNzZXRzRGlyOiAnYXNzZXRzJyxcclxuICAgICAgc291cmNlbWFwOiBlbnYuVklURV9TT1VSQ0VNQVAgPT09ICd0cnVlJyA/ICdoaWRkZW4nIDogZmFsc2UsXHJcbiAgICAgIG1pbmlmeTogJ2VzYnVpbGQnLFxyXG4gICAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICAgIC8vIFx1Nzk4MVx1NzUyOCBnemlwIFx1NEUwQlx1NzY4NFx1NEVFM1x1NzgwMVx1NTIwNlx1NTI3MlxyXG4gICAgICByZXBvcnRDb21wcmVzc2VkU2l6ZTogYnVpbGRNb2RlLFxyXG5cclxuICAgICAgLy8gUm9sbHVwIFx1OTE0RFx1N0Y2RVxyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgdHJlZXNoYWtlOiB7XHJcbiAgICAgICAgICBtb2R1bGVTaWRlRWZmZWN0czogKGlkOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAgICAgLy8gXHU0RkREXHU3NTU5XHU1MjZGXHU0RjVDXHU3NTI4XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygndmlydHVhbDonKSkgcmV0dXJuIGZhbHNlXHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnZWxlbWVudC1wbHVzL3RoZW1lLWNoYWxrJykpIHJldHVybiB0cnVlXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHByb3BlcnR5UmVhZFNpZGVFZmZlY3RzOiBmYWxzZSxcclxuICAgICAgICAgIHRyeUNhdGNoRGVvcHRpbWl6YXRpb246IHRydWVcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG5cclxuICAgICAgICAgIC8vIFx1NjI0Qlx1NTJBOFx1NTIwNlx1NTMwNVx1N0I1Nlx1NzU2NVxyXG4gICAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQ6IHN0cmluZykgPT4ge1xyXG4gICAgICAgICAgICAvLyBOb2RlIG1vZHVsZXMgXHU1MjA2XHU1MzA1XHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgICAvLyBcdTY4NDZcdTY3QjZcdTY4MzhcdTVGQzNcclxuICAgICAgICAgICAgICBpZiAoL25vZGVfbW9kdWxlc1xcLygoQCk/dnVlKC1yb3V0ZXIpP3xwaW5pYXx2dWUtaTE4bnxAdnVldXNlXFwvY29yZSkvLnRlc3QoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ3Z1ZS1jb3JlJ1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgLy8gVUkgXHU1RTkzXHJcbiAgICAgICAgICAgICAgaWYgKC9ub2RlX21vZHVsZXNcXC9lbGVtZW50LXBsdXMvLnRlc3QoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2VsZW1lbnQtcGx1cydcclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIC8vIFx1NTZGRVx1ODg2OFx1NUU5M1xyXG4gICAgICAgICAgICAgIGlmICgvbm9kZV9tb2R1bGVzXFwvKGVjaGFydHN8enJlbmRlcikvLnRlc3QoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2VjaGFydHMnXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBcdTVERTVcdTUxNzdcdTVFOTNcclxuICAgICAgICAgICAgICBpZiAoL25vZGVfbW9kdWxlc1xcLyhheGlvc3xkYXlqc3xsb2Rhc2h8bWl0dHxjcnlwdG8tanN8anNlbmNyeXB0KS8udGVzdChpZCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiAndXRpbHMnXHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAvLyBcdTU2RkVcdTY4MDdcdTVFOTNcclxuICAgICAgICAgICAgICBpZiAoL25vZGVfbW9kdWxlc1xcL0BlbGVtZW50LXBsdXNcXC9pY29ucy12dWUvLnRlc3QoaWQpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2ljb25zJ1xyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFx1NEUxQVx1NTJBMVx1NEVFM1x1NzgwMVx1NjMwOVx1NkEyMVx1NTc1N1x1NTIwNlx1NTMwNVxyXG4gICAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoJy9zcmMvdmlld3MvJykpIHtcclxuICAgICAgICAgICAgICBjb25zdCBtYXRjaCA9IGlkLm1hdGNoKC9cXC9zcmNcXC92aWV3c1xcLyhbXi9dKylcXC8vKVxyXG4gICAgICAgICAgICAgIGlmIChtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGB2aWV3cy0ke21hdGNoWzFdfWBcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnL3NyYy9hcGkvJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ2FwaSdcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCcvc3JjL3N0b3JlLycpKSB7XHJcbiAgICAgICAgICAgICAgcmV0dXJuICdzdG9yZSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAvLyBcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTUxODVcdTgwNTRcclxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgbmFtZSB9ID0gYXNzZXRJbmZvXHJcbiAgICAgICAgICAgIGlmICgvXFwuKHdvZmYyP3xlb3R8dHRmfG90ZikkL2kudGVzdChuYW1lIHx8ICcnKSkge1xyXG4gICAgICAgICAgICAgIHJldHVybiAnZm9udHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoL1xcLihwbmd8anBlP2d8Z2lmfHN2Z3x3ZWJwfGF2aWYpJC9pLnRlc3QobmFtZSB8fCAnJykpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gJ2ltYWdlcy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAnW2V4dF0vW25hbWVdLVtoYXNoXVtleHRuYW1lXSdcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBcdTU5MTZcdTkwRThcdTRGOURcdThENTZcclxuICAgICAgICBleHRlcm5hbDogW1xyXG4gICAgICAgICAgLy8gXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU1M0VGXHU4MEZEXHU5NzAwXHU4OTgxXHU1OTE2XHU5MEU4XHU1MzE2XHU3Njg0XHU0RjlEXHU4RDU2XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG5cclxuICAgICAgLy8gXHU1MzA1XHU0RjUzXHU3OUVGXHU4QjY2XHU1NDRBXHU5NjA4XHU1MDNDXHJcbiAgICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcclxuXHJcbiAgICAgIC8vIFx1NkEyMVx1NTc1NyBJRCBcdTU2RkFcdTVCOUFcdTUzMTZcclxuICAgICAgbW9kdWxlSWRzOiAnZGV0ZXJtaW5pc3RpYycsXHJcblxyXG4gICAgICAvLyBcdTUzOEJcdTdGMjlcdTkxNERcdTdGNkVcclxuICAgICAgZXNidWlsZDoge1xyXG4gICAgICAgIGRyb3A6IGJ1aWxkTW9kZSA/IFsnY29uc29sZScsICdkZWJ1Z2dlciddIDogW10sXHJcbiAgICAgICAgbGVnYWxDb21tZW50czogJ25vbmUnLFxyXG4gICAgICAgIG1pbmlmeUlkZW50aWZpZXJzOiBidWlsZE1vZGVcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBcdTk4ODRcdTg5QzhcdTY3MERcdTUyQTFcdTU2NjhcclxuICAgIHByZXZpZXc6IHtcclxuICAgICAgcG9ydDogNDE3MyxcclxuICAgICAgb3BlbjogdHJ1ZVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBKU09OIFx1N0VBNlx1Njc1RlxyXG4gICAganNvbjoge1xyXG4gICAgICBzdHJpbmdpZnk6IHRydWVcclxuICAgIH0sXHJcblxyXG4gICAgLy8gXHU3RjEzXHU1QjU4XHU3NkVFXHU1RjU1XHJcbiAgICBjYWNoZURpcjogJ25vZGVfbW9kdWxlcy8udml0ZScsXHJcblxyXG4gICAgLy8gXHU1QjlFXHU5QThDXHU2MDI3XHU5MTREXHU3RjZFXHJcbiAgICBleHBlcmltZW50YWw6IHtcclxuICAgICAgLy8gXHU2Nzg0XHU1RUZBXHU2NUY2XHU3Njg0XHU1RTc2XHU4ODRDXHU1OTA0XHU3NDA2XHJcbiAgICAgIGJ1aWxkUGFyYWxsZWxNb2R1bGVzOiB0cnVlLFxyXG4gICAgICAvLyBSZW5kZXIgY2h1bmsgbGlua1xyXG4gICAgICByZW5kZXJCdWlsdFVybChmaWxlbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKGlzUHJvZHVjdGlvbihtb2RlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHsgcnVudGltZTogYC9wdWJsaWMvJHtmaWxlbmFtZX1gIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHsgcmVsYXRpdmU6IHRydWUgfVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFx1NjVFNVx1NUZEN1x1N0VBN1x1NTIyQlxyXG4gICAgbG9nTGV2ZWw6ICdpbmZvJyxcclxuXHJcbiAgICAvLyBcdTZFMDVcdTk2NjRcdTVDNEZcdTVFNTVcclxuICAgIGNsZWFyU2NyZWVuOiBmYWxzZVxyXG4gIH1cclxufSlcclxuXHJcbi8vIFx1N0M3Qlx1NTc4Qlx1NThGMFx1NjYwRVxyXG5kZWNsYXJlIG1vZHVsZSAndml0ZScge1xyXG4gIGludGVyZmFjZSBVc2VyQ29uZmlnIHtcclxuICAgIC8vIFx1ODFFQVx1NUI5QVx1NEU0OVx1OTE0RFx1N0Y2RVxyXG4gIH1cclxufVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBS0EsU0FBUyxjQUFjLGVBQTRCO0FBQ25ELE9BQU8sU0FBUztBQUNoQixPQUFPLFlBQVk7QUFDbkIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxZQUFZO0FBQ25CLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZ0JBQWdCO0FBQ3ZCLFNBQVMsMkJBQTJCO0FBQ3BDLFNBQVMsNEJBQTRCO0FBQ3JDLFNBQVMsd0JBQXdCO0FBQ2pDLFNBQVMsa0JBQWtCO0FBQzNCLE9BQU8scUJBQXFCO0FBQzVCLFNBQVMsZUFBZSxXQUFXO0FBQ25DLE9BQU8sVUFBVTtBQWxCa0ssSUFBTSwyQ0FBMkM7QUFxQnBPLElBQU0sZUFBZSxDQUFDLFNBQWlCLFNBQVM7QUFDaEQsSUFBTSxVQUFVLENBQUMsU0FBaUIsQ0FBQyxjQUFjLFFBQVEsU0FBUyxFQUFFLFNBQVMsSUFBSTtBQUdqRixJQUFNLE9BQU8sUUFBUSxJQUFJO0FBRXpCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sSUFBSTtBQUM5QixRQUFNLFlBQVksUUFBUSxJQUFJO0FBRTlCLFNBQU87QUFBQTtBQUFBLElBRUwsTUFBTSxJQUFJLGtCQUFrQjtBQUFBO0FBQUEsSUFHNUIsU0FBUztBQUFBLE1BQ1AsSUFBSTtBQUFBLE1BQ0osT0FBTztBQUFBLE1BQ1AsT0FBTztBQUFBO0FBQUEsTUFHUCxjQUFjO0FBQUEsUUFDWixVQUFVO0FBQUEsUUFDVixRQUFRLGFBQWEsU0FBUztBQUFBLFFBQzlCLFlBQVk7QUFBQSxNQUNkLENBQUM7QUFBQTtBQUFBLE1BR0QsV0FBVztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1A7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

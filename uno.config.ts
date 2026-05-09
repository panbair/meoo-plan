/**
 * UnoCSS 配置
 * @description 原子化 CSS 配置
 */

import { defineConfig, presetUno, presetAttributify, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    // Uno preset
    presetUno({
      dark: 'class'
    }),

    // Attributify preset
    presetAttributify(),

    // Icons preset
    presetIcons({
      scale: 1.2,
      cdn: 'https://esm.sh/'
    }),

    // Web Fonts preset
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'JetBrains Mono:400,500'
      }
    })
  ],

  // Shortcuts
  shortcuts: {
    // 布局相关
    'wh-full': 'w-full h-full',
    'wh-screen': 'w-screen h-screen',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',
    'flex-between': 'flex justify-between items-center',
    'flex-around': 'flex justify-around items-center',
    'flex-col-between': 'flex flex-col justify-between items-center',

    // 定位相关
    'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'absolute-full': 'absolute inset-0',
    'fixed-center': 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',

    // 文本相关
    'text-ellipsis': 'truncate overflow-hidden text-ellipsis whitespace-nowrap',
    'text-ellipsis-2': 'line-clamp-2 overflow-hidden text-ellipsis',

    // 按钮
    'btn': 'px-4 py-2 rounded cursor-pointer transition-all duration-300',
    'btn-primary': 'btn bg-primary text-white hover:bg-primary-light active:bg-primary-dark',
    'btn-default': 'btn bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',

    // 卡片
    'card': 'bg-white rounded-lg shadow-sm border border-gray-200',
    'card-hover': 'card hover:shadow-md transition-shadow duration-300'
  },

  // 主题扩展
  theme: {
    colors: {
      primary: {
        DEFAULT: 'var(--el-color-primary)',
        light: 'var(--el-color-primary-light-3)',
        lighter: 'var(--el-color-primary-light-5)',
        dark: 'var(--el-color-primary-dark-2)'
      },
      success: {
        DEFAULT: 'var(--el-color-success)',
        light: 'var(--el-color-success-light-3)',
        lighter: 'var(--el-color-success-light-5)',
        dark: 'var(--el-color-success-dark-2)'
      },
      warning: {
        DEFAULT: 'var(--el-color-warning)',
        light: 'var(--el-color-warning-light-3)',
        lighter: 'var(--el-color-warning-light-5)',
        dark: 'var(--el-color-warning-dark-2)'
      },
      danger: {
        DEFAULT: 'var(--el-color-danger)',
        light: 'var(--el-color-danger-light-3)',
        lighter: 'var(--el-color-danger-light-5)',
        dark: 'var(--el-color-danger-dark-2)'
      },
      info: {
        DEFAULT: 'var(--el-color-info)',
        light: 'var(--el-color-info-light-3)',
        lighter: 'var(--el-color-info-light-5)',
        dark: 'var(--el-color-info-dark-2)'
      }
    }
  },

  // 规则扩展
  rules: [
    // Flex gap
    [/^gap-(\d+)$/, ([, d]) => ({ gap: `${Number(d) * 4}px` })],
    // 行高
    [/^leading-(\d+)$/, ([, d]) => ({ 'line-height': `${Number(d) * 4}px` })],
    // 透明度
    [/^opacity-(\d+)$/, ([, d]) => ({ opacity: `${Number(d) / 100}` })]
  ],

  // Transformers
  transformers: [
    // Transformer Directives
    // Transformer Variant Group
  ],

  // Safelist
  safelist: [
    'i-ri-home-line',
    'i-ri-user-line',
    'i-ri-settings-line',
    'i-ri-search-line',
    'i-ri-notification-line'
  ]
})


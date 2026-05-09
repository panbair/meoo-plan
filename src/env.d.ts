/// <reference types="vite/client" />

/**
 * Vue 组件类型声明
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

/**
 * SVG 模块声明
 */
declare module '*.svg' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

/**
 * 图片模块声明
 */
declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

/**
 * 样式模块声明
 */
declare module '*.scss' {
  const content: Record<string, string>
  export default content
}

declare module '*.sass' {
  const content: Record<string, string>
  export default content
}

declare module '*.css' {
  const content: Record<string, string>
  export default content
}

/**
 * JSON 模块声明
 */
declare module '*.json' {
  const value: Record<string, unknown>
  export default value
}

/**
 * 环境变量类型定义
 */
interface ImportMetaEnv {
  /** 应用标题 */
  readonly VITE_APP_TITLE: string
  /** 基础路径 */
  readonly VITE_BASE_PATH: string
  /** 开发服务器端口 */
  readonly VITE_PORT: string
  /** 是否自动打开浏览器 */
  readonly VITE_OPEN: string
  /** API 基础地址 */
  readonly VITE_API_URL: string
  /** 上传服务地址 */
  readonly VITE_UPLOAD_URL: string
  /** 构建输出目录 */
  readonly VITE_OUT_DIR: string
  /** 是否生成 SourceMap */
  readonly VITE_SOURCEMAP: string
  /** 是否移除控制台 */
  readonly VITE_DROP_CONSOLE: string
  /** 是否移除 debugger */
  readonly VITE_DROP_DEBUGGER: string
  /** 租户功能开关 */
  readonly VITE_APP_TENANT_ENABLE: string
  /** 验证码功能开关 */
  readonly VITE_APP_CAPTCHA_ENABLE: string
  /** API 加密开关 */
  readonly VITE_APP_API_ENCRYPT_ENABLE: string
  /** 构建模式 */
  readonly MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Window 类型扩展
 */
interface Window {
  /** Performance API */
  performance: Performance & {
    memory?: {
      jsHeapSizeLimit: number
      totalJSHeapSize: number
      usedJSHeapSize: number
    }
  }

  /** 取消加载提示 */
  __UNIQUE_LOADING_INDICATOR__?: {
    finish: () => void
  }
}


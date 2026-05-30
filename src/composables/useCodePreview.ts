/**
 * useCodePreview - iframe 沙箱代码实时预览
 *
 * 用于方案一（端到端代码生成引擎），将生成的 HTML 代码在安全沙箱中渲染预览。
 *
 * 安全措施：
 * - Sandbox 属性限制脚本权限
 * - 内容通过 srcdoc 注入，避免跨域
 * - 支持暗色主题切换
 */

import { ref, watch, onUnmounted } from 'vue'

export interface PreviewOptions {
  /** 是否显示暗色背景 */
  darkMode?: boolean
  /** 缩放比例 (0.25 - 2.0) */
  scale?: number
  /** 设备模拟宽度 (null = 自适应) */
  deviceWidth?: number | null
}

export function useCodePreview(options: PreviewOptions = {}) {
  const iframeRef = ref<HTMLIFrameElement | null>(null)
  const code = ref('')
  const isReady = ref(false)
  const isError = ref(false)
  const errorMessage = ref('')
  const isLoading = ref(false)
  const scale = ref(options.scale || 1)
  const deviceWidth = ref(options.deviceWidth || null)
  const darkMode = ref(options.darkMode ?? true)

  /**
   * 注入代码到 iframe
   */
  function setCode(htmlCode: string) {
    code.value = htmlCode
    renderCode()
  }

  /**
   * 追加代码（流式场景）
   */
  function appendCode(chunk: string) {
    code.value += chunk
    // 流式场景下节流渲染，避免频繁重绘
    if (chunk.includes('\n') || code.value.length % 500 === 0) {
      renderCode()
    }
  }

  /**
   * 渲染代码到 iframe
   */
  function renderCode() {
    if (!iframeRef.value) return

    isLoading.value = false
    isError.value = false

    try {
      const iframe = iframeRef.value

      const safeCode = code.value || '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:rgba(255,255,255,0.3);font-size:1.2rem;">等待生成代码...</div>'

      // 检测是否为完整的 HTML 文档（AI生成的 E2E 代码）
      const isCompleteHtml = /^\s*<!DOCTYPE\s+html/i.test(safeCode.trim())
                          || /^\s*<html/i.test(safeCode.trim())

      if (isCompleteHtml) {
        // 完整 HTML 文档：直接用 srcdoc，避免双层嵌套导致 GSAP 动画失效
        iframe.srcdoc = safeCode
      } else {
        // 非完整 HTML：用 doc.write 包裹（兼容旧逻辑）
        const doc = iframe.contentDocument || iframe.contentWindow?.document
        if (!doc) {
          throw new Error('iframe document 不可用')
        }

        const baseStyle = darkMode.value
          ? `html,body{background:#111827;color:#e5e7eb;margin:0;padding:0;font-family:system-ui,sans-serif;}`
          : `html,body{background:#fff;color:#111;margin:0;padding:0;font-family:system-ui,sans-serif;}`

        const scaleStyle = scale.value !== 1
          ? `body{transform:scale(${scale.value});transform-origin:top left;width:${100 / scale.value}%;}`
          : ''

        const deviceStyle = deviceWidth.value
          ? `body{max-width:${deviceWidth.value}px;margin:0 auto;overflow-x:hidden;}`
          : ''

        doc.open()
        doc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              ${baseStyle}
              ${scaleStyle}
              ${deviceStyle}
            </style>
          </head>
          <body>
            ${safeCode}
          </body>
          </html>
        `)
        doc.close()
      }

      isReady.value = true
    } catch (e: any) {
      isError.value = true
      errorMessage.value = e.message || '预览渲染失败'
    }
  }

  /**
   * 清除预览
   */
  function clear() {
    code.value = ''
    if (iframeRef.value) {
      const doc = iframeRef.value.contentDocument
      if (doc) {
        doc.open()
        doc.write('<html><body></body></html>')
        doc.close()
      }
    }
    isError.value = false
    errorMessage.value = ''
    isLoading.value = false
  }

  /**
   * 下载当前代码
   */
  function download(filename = 'website.html') {
    if (!code.value) return
    const blob = new Blob([code.value], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  // 监听 iframe 消息
  function handleMessage(e: MessageEvent) {
    if (e.data?.type === 'preview-ready') {
      isReady.value = true
    } else if (e.data?.type === 'preview-error') {
      console.warn('预览运行时错误:', e.data)
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('message', handleMessage)
  }

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('message', handleMessage)
    }
  })

  return {
    iframeRef,
    code,
    isReady,
    isError,
    errorMessage,
    isLoading,
    scale,
    deviceWidth,
    darkMode,
    setCode,
    appendCode,
    renderCode,
    clear,
    download
  }
}

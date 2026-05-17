================================================================================
🎯 企业网站开发需求 - 请在 meoo AI 平台生成 React 代码
================================================================================

📌 **优先级说明**：
- 🔴 **必须遵守**：不遵守会导致功能错误或性能问题
- 🟡 **强烈建议**：最佳实践，显著提升代码质量
- 🟢 **可选优化**：锦上添花，有时间再实现

⚠️ **Token 警告**
--------------------------------------------------------------------------------
当前内容约 50,726 tokens，可能超出模型上下文限制。
建议：
1. 减少选中组件数量
2. 或分批生成（先生成部分模块的代码）

📌 角色设定
--------------------------------------------------------------------------------
你是一位资深的 React + GSAP 动画专家。你必须基于用户选配的 Vue 组件，
直接开发完整的、可运行的 React 企业网站代码。

⚙️ 核心技术要求（必须遵守）
--------------------------------------------------------------------------------
1. **技术栈**: React 18 + TypeScript + Tailwind CSS + GSAP (ScrollTrigger)
2. **Vue → React 转换规则**:
  - `v-for="item in list"` → `{list.map(item => (...))}`
  - `v-if="condition"` → `{condition && (...)}`
  - `ref="elementRef"` → `const elementRef = useRef<HTMLDivElement>(null)`
  - `onMounted(() => {...})` → `useEffect(() => {...}, [])`
  - `onUnmounted(() => {...})` → `useEffect(() => { return () => {...} }, [])`
  - `defineProps<Props>()` → `interface Props {...}; const Component: React.FC<Props> = (props) => {...}`
3. **GSAP 插件注册**: 每个使用 ScrollTrigger 的组件文件顶部必须写 `gsap.registerPlugin(ScrollTrigger)`
4. **图片地址**: 使用 Unsplash 格式 `https://images.unsplash.com/photo-XXXXXXXX?w=1920&q=80`，每个模块至少1-2张图片，首屏必须有震撼的背景图
5. **Canvas API**: 如果组件使用 Canvas，必须在 React 中用 `useRef` + `useEffect` 完整重写
6. **ScrollTrigger 模式**: 必须严格基于源码判断 `scrub` 或 `toggleActions`，不可推断
7. **Section 层处理**: 如果组件内部已有 scrollTrigger 配置，Section 层不要重复创建
8. **首屏动画时机**: 首屏（Hero）模块的 GSAP 动画必须在页面加载时立即执行，使用 `useEffect(() => { gsap.fromTo(...) }, [])` 确保组件挂载后自动播放动画，禁止使用 ScrollTrigger 控制首屏动画。只有非首屏模块才使用 ScrollTrigger 根据滚动触发
9. **图片与动画结合**: 图片必须参与 GSAP 动画（如滚动时缩放、平移、淡入），不能只是静态展示。例如：`gsap.from(imageRef.current, { scale: 0.8, opacity: 0, scrollTrigger: { trigger: sectionRef, start: "top 80%" } })`
10. **动画时长约束**: 基础动画 0.3-0.6s，复杂入场动画 0.8-1.2s，ScrollTrigger 持续动画根据内容长度计算，禁止使用过长动画（>2s），过度动画影响用户体验

📋 企业信息
--------------------------------------------------------------------------------
企业名称: 深圳未来 AI 网络科技有限公司
所属行业: 科技/互联网
企业简介: AI 快速部署、智能系统开发、企业数字化 AI 解决方案、人工智能工具研发与技术服务，为各行各业提供轻量化高效 AI 应用落地服务
目标受众: 30-45 岁企业创始人、企业管理层、技术负责人、中小型实体商家与互联网从业者，集中在一二线及珠三角城市，需求为低成本快速接入 AI 功能、提升办公与经营效率、数字化转型升级、定制专属智能业务系统
品牌主色: 科技蓝
网站类型: 企业官网
设计理念: 智能、高效、前沿、专业、极速

🎨 品牌主色（设计约束 - 必须遵守）
--------------------------------------------------------------------------------
主色配置: 科技蓝
⚠️ 约束: 整体配色以该主色为核心，所有组件的 primary/accent 颜色必须基于此色值
• 可使用 CSS 变量 `--primary-color` 统一管理
• 按钮、强调色使用品牌主色
• Hover 状态可加深/加亮 10-20%
• 渐变色使用 `tint()` 或 `shade()` 派生辅助色

💡 设计理念（风格约束 - 必须体现）
--------------------------------------------------------------------------------
设计理念: 智能、高效、前沿、专业、极速
⚠️ 约束: 所有组件的设计风格、动画节奏、视觉层次必须契合此理念
• 排版间距、圆角大小、阴影强度需统一
• 动画曲线(ease)选择应匹配设计调性
• 图片风格、图标粗细保持一致

🧩 模块组件规划（用户已指定，不可更改）
--------------------------------------------------------------------------------

1. 【首屏 Hero】
   描述：全屏首图/视频开场
   📦 使用组件 (2个)

  1. CardImageCurtainRise (card-image)
   ----------------------------------------------------------------------
   • Props 定义:
   默认值:
   imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
   title: '帷幕聚拢',
   subtitle: '合幕成光开幕'
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <div class="card-image-curtain-rise" ref="parentRef">
         <div class="scene-container" ref="sceneRef">
           <!-- 背景图片 -->
           <div class="image-container" ref="imageContainerRef">
             <img
               ref="imageRef"
               :src="imageUrl"
               :alt="title"
               class="main-image"
             />
           </div>
     
           <!-- 左帷幕 -->
           <div class="curtain-wrapper curtain-left" ref="leftCurtainRef">
             <div class="curtain-panel" ref="leftPanelRef">
               <div class="curtain-texture"></div>
               <div class="curtain-fringe"></div>
               <div class="curtain-glow-edge"></div>
             </div>
           </div>
     
           <!-- 右帷幕 -->
           <div class="curtain-wrapper curtain-right" ref="rightCurtainRef">
             <div class="curtain-panel" ref="rightPanelRef">
               <div class="curtain-texture"></div>
               <div class="curtain-fringe"></div>
               <div class="curtain-glow-edge"></div>
             </div>
           </div>
     
           <!-- 中线光缝 -->
           <div class="center-light-seam" ref="lightSeamRef">
             <div class="seam-inner"></div>
           </div>
     
           <!-- 四角暗影 -->
           <div class="corner-vignette" ref="vignetteRef"></div>
         </div>
     
         <!-- 内容 -->
         <div class="content-overlay" ref="contentRef">
           <h2 class="title">{{ title }}</h2>
           <p class="subtitle">{{ subtitle }}</p>
         </div>
       </div>
     </template>
     
     <script setup lang="ts">
     import { ref, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import { ScrollTrigger } from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     type TweenCleanup = { revert: () => void }
     
     const props = withDefaults(defineProps<{
       imageUrl?: string
       title?: string
       subtitle?: string
     }>(), {
       imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
       title: '帷幕聚拢',
       subtitle: '合幕成光开幕'
     })
     
     const parentRef = ref<HTMLElement | null>(null)
     const sceneRef = ref<HTMLElement | null>(null)
     const imageContainerRef = ref<HTMLElement | null>(null)
     const imageRef = ref<HTMLImageElement | null>(null)
     const leftCurtainRef = ref<HTMLElement | null>(null)
     const rightCurtainRef = ref<HTMLElement | null>(null)
     const leftPanelRef = ref<HTMLElement | null>(null)
     const rightPanelRef = ref<HTMLElement | null>(null)
     const lightSeamRef = ref<HTMLElement | null>(null)
     const vignetteRef = ref<HTMLElement | null>(null)
     const contentRef = ref<HTMLElement | null>(null)
     
     let cleanupFns: TweenCleanup[] = []
     
     onMounted(() => {
       if (!parentRef.value) return
     
       const ctx = gsap.context(() => {
         // ========== 主动画 Timeline ==========
         // 统一管理帷幕、图片、光缝效果
         const mainTl = gsap.timeline({
           scrollTrigger: {
             trigger: parentRef.value,
             start: 'top bottom',    // 元素底部进入视口顶部时开始
             end: 'bottom top',       // 元素顶部离开视口底部时结束
             scrub: 1.5
           }
         })
     
         cleanupFns.push({
           revert: () => {
             mainTl.kill()
             ScrollTrigger.getAll().forEach(st => {
               if (st.vars.trigger === parentRef.value) {
                 st.kill()
               }
             })
           }
         })
     
         // ========== 帷幕聚拢/分开动画 ==========
         // 向下滚动(0→1): 帷幕从外侧合拢
         // 向上滚动(1→0): 帷幕从中间分开
         if (leftCurtainRef.value && rightCurtainRef.value) {
           // 左帷幕：-120% → 0%
           mainTl.to(leftCurtainRef.value, {
             x: '0%',
             ease: 'power2.inOut',
             duration: 1
           }, 0)
     
           // 右帷幕：+120% → 0%
           mainTl.to(rightCurtainRef.value, {
             x: '0%',
             ease: 'power2.inOut',
             duration: 1
           }, 0)
         }
     
         // 帷幕可见性：合拢后渐隐
         if (leftPanelRef.value && rightPanelRef.value) {
           mainTl.to([leftPanelRef.value, rightPanelRef.value], {
             opacity: 0,
             ease: 'power2.in',
             duration: 0.5
           }, 1.2)
         }
     
         // ========== 中线金色光缝 ==========
         if (lightSeamRef.value) {
           // 光缝在帷幕即将合拢时闪现
           mainTl.fromTo(lightSeamRef.value,
             { opacity: 0, scaleX: 0 },
             { opacity: 0.95, scaleX: 1, ease: 'power4.out', duration: 0.15 },
             0.85
           )
     
           // 光缝快速消散
           mainTl.to(lightSeamRef.value, {
             opacity: 0,
             scaleX: 0.5,
             ease: 'power2.in',
             duration: 0.2
           }, 1.0)
         }
     
         // ========== 帷幕光泽涌动 ==========
         if (leftPanelRef.value && rightPanelRef.value) {
           mainTl.fromTo([leftPanelRef.value, rightPanelRef.value],
             { boxShadow: 'inset 0 0 30px rgba(139, 90, 43, 0.3)' },
             { boxShadow: 'inset 0 0 80px rgba(255, 215, 100, 0.5), inset 0 0 40px rgba(200, 160, 80, 0.4)', ease: 'power2.inOut', duration: 0.2 },
             0.85
           )
         }
     
         // ========== 帷幕弹性回缩 ==========
         if (leftCurtainRef.value && rightCurtainRef.value) {
           mainTl.to(leftCurtainRef.value, { x: '+=3', ease: 'power2.out', duration: 0.05 }, 1.2)
           mainTl.to(leftCurtainRef.value, { x: '-=3', ease: 'back.out(1.2)', duration: 0.1 }, 1.25)
     
           mainTl.to(rightCurtainRef.value, { x: '-=3', ease: 'power2.out', duration: 0.05 }, 1.2)
           mainTl.to(rightCurtainRef.value, { x: '+=3', ease: 'back.out(1.2)', duration: 0.1 }, 1.25)
         }
     
         // ========== 图片亮度与色温 ==========
         // 向下滚动：图片从暗淡变明亮
         // 向上滚动：图片从明亮变暗淡
         if (imageRef.value) {
           mainTl.fromTo(imageRef.value,
             { filter: 'brightness(0.7) saturate(0.85)' },
             { filter: 'brightness(1.0) saturate(1.0)', ease: 'power2.out', duration: 1 },
             0
           )
     
           mainTl.fromTo(imageRef.value,
             { filter: 'hue-rotate(-8deg)' },
             { filter: 'hue-rotate(0deg)', ease: 'power2.inOut', duration: 0.8 },
             0
           )
         }
     
         // ========== 四角暗影 ==========
         if (vignetteRef.value) {
           mainTl.fromTo(vignetteRef.value,
             { opacity: 0 },
             { opacity: 1, ease: 'power2.inOut', duration: 0.6 },
             1.4
           )
     
           // 低频呼吸 5s 周期
           mainTl.to(vignetteRef.value, { opacity: 0.5, duration: 2.5, ease: 'sine.inOut' }, 2)
           mainTl.to(vignetteRef.value, { opacity: 0.25, duration: 2.5, ease: 'sine.inOut' }, 4.5)
         }
     
         // ========== 内容入场动画 ==========
         if (contentRef.value) {
           const contentTl = gsap.timeline({
             scrollTrigger: {
               trigger: parentRef.value,
               start: 'top 75%',
               end: 'top 20%',
               scrub: 1
             }
           })
     
           cleanupFns.push({
             revert: () => contentTl.kill()
           })
     
           contentTl.fromTo(contentRef.value,
             { opacity: 0, y: 50 },
             { opacity: 1, y: 0, ease: 'power3.out' },
             0
           )
         }
     
       }, parentRef.value)
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn.revert?.())
       ScrollTrigger.getAll().forEach(st => st.kill())
     })
     </script>
     
     <style scoped lang="scss">
     .card-image-curtain-rise {
       position: relative;
       width: 100vw;
       height: 100vh;
       overflow: hidden;
       background: #0a0806;
     }
     
     .scene-container {
       position: relative;
       width: 100%;
       height: 100%;
     }
     
     // ========== 背景图片 ==========
     .image-container {
       position: absolute;
       inset: 0;
       display: flex;
       align-items: center;
       justify-content: center;
     }
     
     .main-image {
       width: 100%;
       height: 100%;
       object-fit: cover;
       filter: brightness(0.7) saturate(0.85);
     }
     
     // ========== 帷幕 ==========
     .curtain-wrapper {
       position: absolute;
       top: 0;
       width: 55%;
       height: 100%;
       z-index: 5;
       overflow: hidden;
     }
     
     .curtain-left {
       left: 0;
       transform: translateX(-120%);
     }
     
     .curtain-right {
       right: 0;
       transform: translateX(120%);
     }
     
     .curtain-panel {
       position: absolute;
       inset: 0;
       background: linear-gradient(
         180deg,
         #1a1208 0%,
         #2d1f0f 15%,
         #3d2a14 30%,
         #4a3419 50%,
         #3d2a14 70%,
         #2d1f0f 85%,
         #1a1208 100%
       );
       box-shadow:
         inset 0 0 30px rgba(139, 90, 43, 0.3),
         inset 0 0 60px rgba(100, 60, 20, 0.2);
     
       &::before {
         content: '';
         position: absolute;
         inset: 0;
         background:
           repeating-linear-gradient(90deg, rgba(60, 40, 20, 0.15) 0px, rgba(80, 50, 25, 0.2) 1px, rgba(60, 40, 20, 0.15) 3px),
           repeating-linear-gradient(0deg, rgba(80, 50, 25, 0.1) 0px, rgba(100, 70, 35, 0.15) 2px, rgba(80, 50, 25, 0.1) 4px);
         background-size: 6px 8px, 8px 6px;
         opacity: 0.8;
       }
     
       &::after {
         content: '';
         position: absolute;
         inset: 0;
         background: linear-gradient(90deg, rgba(180, 140, 80, 0.1) 0%, transparent 20%, transparent 80%, rgba(180, 140, 80, 0.05) 100%);
       }
     }
     
     .curtain-texture {
       position: absolute;
       inset: 0;
       background: radial-gradient(ellipse 80% 60% at 50% 30%, rgba(200, 160, 100, 0.08) 0%, transparent 60%);
     }
     
     .curtain-fringe {
       position: absolute;
       bottom: 0;
       left: 0;
       right: 0;
       height: 40px;
       background: repeating-linear-gradient(90deg, #2d1f0f 0px, #3d2a14 4px, #2d1f0f 8px);
       box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.5);
     
       &::before {
         content: '';
         position: absolute;
         top: -20px;
         left: 0;
         right: 0;
         height: 20px;
         background: linear-gradient(to bottom, transparent, rgba(60, 40, 20, 0.5));
       }
     }
     
     .curtain-glow-edge {
       position: absolute;
       top: 0;
       bottom: 0;
       width: 4px;
       background: linear-gradient(180deg, rgba(255, 215, 100, 0.3) 0%, rgba(255, 200, 80, 0.5) 50%, rgba(255, 180, 60, 0.3) 100%);
       filter: blur(2px);
     }
     
     .curtain-left .curtain-glow-edge { right: 0; }
     .curtain-right .curtain-glow-edge { left: 0; }
     
     // ========== 中线光缝 ==========
     .center-light-seam {
       position: absolute;
       left: 50%;
       top: 0;
       bottom: 0;
       width: 4px;
       transform: translateX(-50%);
       background: linear-gradient(180deg, rgba(255, 230, 150, 0.9) 0%, rgba(255, 215, 0, 1) 30%, rgba(255, 240, 180, 0.95) 50%, rgba(255, 215, 0, 1) 70%, rgba(255, 230, 150, 0.9) 100%);
       box-shadow: 0 0 30px rgba(255, 215, 0, 0.9), 0 0 60px rgba(255, 200, 50, 0.6), 0 0 100px rgba(255, 180, 0, 0.4);
       z-index: 10;
       opacity: 0;
       scaleX: 0;
     
       &::before {
         content: '';
         position: absolute;
         inset: -20px 0;
         background: radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
       }
     }
     
     .seam-inner {
       position: absolute;
       inset: 0;
       background: linear-gradient(180deg, rgba(255, 245, 200, 0.8) 0%, rgba(255, 255, 220, 0.9) 50%, rgba(255, 245, 200, 0.8) 100%);
     }
     
     // ========== 四角暗影 ==========
     .corner-vignette {
       position: absolute;
       inset: 0;
       z-index: 3;
       pointer-events: none;
       opacity: 0;
       box-shadow: inset 0 0 150px rgba(10, 8, 6, 0.6), inset 0 0 250px rgba(10, 8, 6, 0.4);
     
       &::before {
         content: '';
         position: absolute;
         inset: 40px;
         border: 1px solid rgba(139, 90, 43, 0.15);
       }
     
       &::after {
         content: '';
         position: absolute;
         inset: 0;
         background:
           radial-gradient(ellipse 30% 30% at 0% 0%, rgba(45, 31, 15, 0.4) 0%, transparent 100%),
           radial-gradient(ellipse 30% 30% at 100% 0%, rgba(45, 31, 15, 0.4) 0%, transparent 100%),
           radial-gradient(ellipse 30% 30% at 0% 100%, rgba(45, 31, 15, 0.4) 0%, transparent 100%),
           radial-gradient(ellipse 30% 30% at 100% 100%, rgba(45, 31, 15, 0.4) 0%, transparent 100%);
       }
     }
     
     // ========== 内容层 ==========
     .content-overlay {
       position: absolute;
       bottom: 12vh;
       left: 50%;
       transform: translateX(-50%);
       z-index: 10;
       text-align: center;
       opacity: 0;
     }
     
     .title {
       font-family: 'Noto Serif SC', 'STSong', serif;
       font-size: clamp(2rem, 5vw, 3.5rem);
       font-weight: 700;
       color: transparent;
       background: linear-gradient(135deg, #f5e6d0 0%, #e8d4b8 30%, #d4c4a8 70%, #f0e0c8 100%);
       background-clip: text;
       -webkit-background-clip: text;
       letter-spacing: 0.5em;
       text-shadow: 0 0 40px rgba(245, 230, 208, 0.3);
       margin-bottom: 1rem;
     }
     
     .subtitle {
       font-family: 'Noto Sans SC', sans-serif;
       font-size: clamp(0.9rem, 2vw, 1.2rem);
       color: rgba(220, 200, 170, 0.7);
       letter-spacing: 0.6em;
       font-weight: 300;
     }
     </style>
     
     ```

  2. CardTextVoidRebirth (card-text)
   ----------------------------------------------------------------------
   • 🎨 Canvas 特殊处理:
   ⚠️ 使用 Canvas 2D API
   1. React 中必须使用 useRef<HTMLCanvasElement>() 获取画布引用
   2. Canvas 绑定必须在 useEffect 中执行（DOM 渲染后）
   3. 动画循环需在 useEffect 中设置 requestAnimationFrame
   4. 清理函数中必须取消动画帧 cancelAnimationFrame
   5. 监听 resize 事件，及时更新 canvas 尺寸
   • 检测到渐变填充
   • 检测到 GSAP + requestAnimationFrame 混合动画，需确保两者的 RAF 同步
   📌 性能建议：Canvas 动画建议添加 visibilitychange 监听，页面不可见时暂停
   • Props 定义:
   title?: string
   subtitle?: string
   vortexIntensity?: number
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <div ref="parentRef" class="void-rebirth-239">
         <!-- 黑洞背景 -->
         <div class="void-bg-239">
           <div class="void-core-239"></div>
           <div class="void-ring-239 ring-1"></div>
           <div class="void-ring-239 ring-2"></div>
           <div class="void-ring-239 ring-3"></div>
           <div class="void-particles-239"></div>
         </div>
     
         <!-- 粒子画布 -->
         <canvas ref="particleCanvasRef" class="void-particle-canvas-239"></canvas>
     
         <!-- 字符容器 -->
         <div class="void-char-container-239" ref="charContainerRef">
           <span
             v-for="(item, index) in charData"
             :key="item.key"
             :ref="el => setCharRef(el as HTMLElement, index)"
             class="void-char-239"
             :style="{
               '--delay': (index * 0.15) + 's',
               '--angle': (index * 25) + 'deg'
             }"
           >{{ item.char }}</span>
         </div>
     
         <!-- 副标题 -->
         <p class="void-subtitle-239" ref="subtitleRef">
           <span v-for="(char, i) in subtitle.split('')" :key="i" class="subtitle-char-239">{{ char }}</span>
         </p>
     
         <!-- 进度条 -->
         <div class="void-progress-239" :style="{ width: progress + '%' }"></div>
     
         <!-- 装饰线条 -->
         <div class="void-decor-239">
           <svg viewBox="0 0 1200 100" preserveAspectRatio="none">
             <path
               v-for="i in 40"
               :key="i"
               :d="`M ${i * 30} 50 Q ${i * 30 + 15} ${30 + Math.sin(i) * 20} ${i * 30 + 30} 50`"
               fill="none"
               :stroke="`rgba(120, 80, 180, ${0.1 + Math.random() * 0.15})`"
               stroke-width="1"
             />
           </svg>
         </div>
       </div>
     </template>
     
     <script setup lang="ts">
     import { ref, computed, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import ScrollTrigger from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     // Props
     interface Props {
       title?: string
       subtitle?: string
       vortexIntensity?: number
     }
     
     const props = withDefaults(defineProps<Props>(), {
       title: '时空漩涡',
       subtitle: '从虚无中重生 · 诡异的美感',
       vortexIntensity: 1
     })
     
     // Refs
     const parentRef = ref<HTMLElement | null>(null)
     const charContainerRef = ref<HTMLElement | null>(null)
     const subtitleRef = ref<HTMLElement | null>(null)
     const particleCanvasRef = ref<HTMLCanvasElement | null>(null)
     
     const charRefs = ref<Map<number, HTMLElement>>(new Map())
     
     // 状态
     const progress = ref(0)
     
     // 字符数据
     const charData = computed(() => {
       return props.title.split('').map((char, index) => ({
         char,
         index,
         key: `void-char-${index}`
       }))
     })
     
     // 粒子数据
     interface VoidParticle {
       x: number
       y: number
       angle: number
       radius: number
       speed: number
       size: number
       alpha: number
       color: string
       life: number
       targetX: number
       targetY: number
       phase: number
     }
     
     const particles: VoidParticle[] = []
     const particleRefs: HTMLElement[] = []
     
     // 清理函数
     type TweenCleanup = () => void
     const cleanupFns: TweenCleanup[] = []
     let ctx: gsap.Context | null = null
     let scrollTriggerInstance: ScrollTrigger | null = null
     let animationFrameId: number | null = null
     let vortexAnimationId: number | null = null
     
     // 设置字符 ref
     function setCharRef(el: HTMLElement | null, index: number) {
       if (el) {
         charRefs.value.set(index, el)
       }
     }
     
     // 初始化粒子
     function initParticles() {
       if (!parentRef.value) return
       
       const rect = parentRef.value.getBoundingClientRect()
       const centerX = rect.width / 2
       const centerY = rect.height / 2
       
       const colors = [
         'rgba(120, 80, 200, 0.8)',
         'rgba(180, 100, 255, 0.6)',
         'rgba(80, 140, 220, 0.7)',
         'rgba(200, 150, 255, 0.5)',
         'rgba(100, 200, 255, 0.6)'
       ]
       
       for (let i = 0; i < 200; i++) {
         const angle = Math.random() * Math.PI * 2
         const radius = 100 + Math.random() * 400 * props.vortexIntensity
         
         particles.push({
           x: centerX + Math.cos(angle) * radius,
           y: centerY + Math.sin(angle) * radius,
           angle: angle,
           radius: radius,
           speed: (0.002 + Math.random() * 0.003) * props.vortexIntensity,
           size: Math.random() * 3 + 1,
           alpha: Math.random() * 0.5 + 0.3,
           color: colors[Math.floor(Math.random() * colors.length)],
           life: Math.random() * 300 + 200,
           targetX: 0,
           targetY: 0,
           phase: Math.random() * Math.PI * 2
         })
       }
     }
     
     // 动画粒子
     function animateParticles() {
       const canvas = particleCanvasRef.value
       if (!canvas) return
       
       const ctx2d = canvas.getContext('2d')
       if (!ctx2d) return
       
       const rect = parentRef.value?.getBoundingClientRect()
       if (!rect) return
       
       canvas.width = rect.width
       canvas.height = rect.height
       
       const centerX = rect.width / 2
       const centerY = rect.height / 2
       const time = Date.now() * 0.001
       
       ctx2d.clearRect(0, 0, canvas.width, canvas.height)
       
       particles.forEach(p => {
         // 螺旋向心运动
         p.angle += p.speed
         p.radius -= 0.3 * props.vortexIntensity
         
         // 重生到外围
         if (p.radius < 20) {
           p.radius = 300 + Math.random() * 200 * props.vortexIntensity
           p.angle = Math.random() * Math.PI * 2
         }
         
         // 计算位置
         const spiralX = centerX + Math.cos(p.angle) * p.radius
         const spiralY = centerY + Math.sin(p.angle) * p.radius
         
         // 添加波动
         p.x = spiralX + Math.sin(time * 2 + p.phase) * 10
         p.y = spiralY + Math.cos(time * 1.5 + p.phase) * 10
         
         // 闪烁
         p.alpha = 0.3 + Math.sin(time * 3 + p.phase) * 0.3
         p.life--
         
         // 绘制
         const gradient = ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 5)
         gradient.addColorStop(0, p.color.replace('0.8', String(p.alpha)))
         gradient.addColorStop(1, 'transparent')
         
         ctx2d.beginPath()
         ctx2d.fillStyle = gradient
         ctx2d.arc(p.x, p.y, p.size * 5, 0, Math.PI * 2)
         ctx2d.fill()
       })
       
       vortexAnimationId = requestAnimationFrame(animateParticles)
     }
     
     // 字符螺旋动画
     function animateCharVortex() {
       const chars = Array.from(charRefs.value.values())
       const container = charContainerRef.value
       if (!container) return
       
       const rect = container.getBoundingClientRect()
       const centerX = rect.width / 2
       const centerY = rect.height / 2
       const time = Date.now() * 0.001
       
       chars.forEach((char, index) => {
         const p = particles[index % particles.length]
         if (!p) return
         
         // 字符跟随粒子位置
         const targetX = p.x - rect.left - centerX
         const targetY = p.y - rect.top - centerY
         
         // 旋转效果
         const rotation = time * 50 + index * 10
         
         char.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${rotation}deg) scale(${0.8 + p.alpha * 0.4})`
         char.style.opacity = String(0.5 + p.alpha * 0.5)
       })
       
       animationFrameId = requestAnimationFrame(animateCharVortex)
     }
     
     // 入场动画
     function playEntryAnimation() {
       const chars = Array.from(charRefs.value.values())
       
       // 初始状态 - 从黑洞中心爆发
       chars.forEach((char, index) => {
         gsap.set(char, {
           opacity: 0,
           scale: 0,
           rotation: index * 30,
           filter: 'blur(10px)'
         })
       })
       
       if (subtitleRef.value) {
         const subtitleChars = subtitleRef.value.querySelectorAll('.subtitle-char-239')
         gsap.set(subtitleChars, {
           opacity: 0,
           y: 20,
           filter: 'blur(5px)'
         })
       }
       
       // 爆发动画
       gsap.to(chars, {
         opacity: 1,
         scale: 1,
         rotation: '+=360',
         filter: 'blur(0px)',
         duration: 1.5,
         stagger: 0.1,
         ease: 'elastic.out(1, 0.5)'
       })
       
       // 副标题动画
       if (subtitleRef.value) {
         const subtitleChars = subtitleRef.value.querySelectorAll('.subtitle-char-239')
         gsap.to(subtitleChars, {
           opacity: 0.6,
           y: 0,
           filter: 'blur(0px)',
           duration: 1,
           stagger: 0.05,
           delay: chars.length * 0.1,
           ease: 'power2.out'
         })
       }
     }
     
     // 初始化
     onMounted(() => {
       if (!parentRef.value) return
       
       // 初始化粒子
       initParticles()
       
       setTimeout(() => {
         ctx = gsap.context(() => {
           // 入场动画
           playEntryAnimation()
           
           // ScrollTrigger
           scrollTriggerInstance = ScrollTrigger.create({
             trigger: parentRef.value,
             start: 'top 80%',
             end: 'top 20%',
             scrub: 1.5,
             onUpdate: (self) => {
               progress.value = self.progress * 100
               
               // 漩涡强度变化
               if (parentRef.value) {
                 const intensity = 0.5 + self.progress * 1.5
                 parentRef.value.style.setProperty('--vortex-intensity', String(intensity))
               }
             },
             onEnter: () => {
               playEntryAnimation()
             },
             onLeaveBack: () => {
               // 重置
               const chars = Array.from(charRefs.value.values())
               chars.forEach((char, index) => {
                 gsap.set(char, {
                   opacity: 0,
                   scale: 0,
                   rotation: index * 30,
                   filter: 'blur(10px)'
                 })
               })
               
               if (subtitleRef.value) {
                 const subtitleChars = subtitleRef.value.querySelectorAll('.subtitle-char-239')
                 gsap.set(subtitleChars, { opacity: 0, y: 20, filter: 'blur(5px)' })
               }
             }
           })
           
           cleanupFns.push(() => scrollTriggerInstance?.kill())
         }, parentRef.value)
       }, 100)
       
       // 启动动画
       animateParticles()
       animateCharVortex()
     })
     
     // 清理
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn())
       cleanupFns.length = 0
       
       ctx?.revert()
       ctx = null
       
       if (animationFrameId !== null) {
         cancelAnimationFrame(animationFrameId)
         animationFrameId = null
       }
       
       if (vortexAnimationId !== null) {
         cancelAnimationFrame(vortexAnimationId)
         vortexAnimationId = null
       }
       
       scrollTriggerInstance?.kill()
       ScrollTrigger.getAll().forEach(st => st.kill())
       
       particles.length = 0
       charRefs.value.clear()
     })
     </script>
     
     <style scoped>
     .void-rebirth-239 {
       --vortex-intensity: 1;
       
       width: 100vw;
       height: 100vh;
       position: relative;
       overflow: hidden;
       background: radial-gradient(
         ellipse at center,
         #1a0a2e 0%,
         #0d0518 40%,
         #050208 100%
       );
       font-family: 'Orbitron', 'Rajdhani', sans-serif;
     }
     
     /* 黑洞背景 */
     .void-bg-239 {
       position: absolute;
       inset: 0;
       pointer-events: none;
     }
     
     .void-core-239 {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 100px;
       height: 100px;
       transform: translate(-50%, -50%);
       background: radial-gradient(
         circle,
         #000 0%,
         #000 40%,
         transparent 70%
       );
       border-radius: 50%;
       box-shadow: 
         0 0 50px 20px rgba(100, 50, 200, 0.3),
         0 0 100px 50px rgba(150, 100, 255, 0.1);
       animation: core-pulse-239 3s ease-in-out infinite;
     }
     
     @keyframes core-pulse-239 {
       0%, 100% { transform: translate(-50%, -50%) scale(1); }
       50% { transform: translate(-50%, -50%) scale(1.2); }
     }
     
     .void-ring-239 {
       position: absolute;
       top: 50%;
       left: 50%;
       border: 2px solid;
       border-radius: 50%;
       transform: translate(-50%, -50%);
       animation: ring-rotate-239 20s linear infinite;
     }
     
     .ring-1 {
       width: 250px;
       height: 250px;
       border-color: rgba(150, 100, 255, 0.3);
       animation-direction: normal;
     }
     
     .ring-2 {
       width: 400px;
       height: 400px;
       border-color: rgba(100, 150, 255, 0.2);
       animation-direction: reverse;
       animation-duration: 30s;
     }
     
     .ring-3 {
       width: 550px;
       height: 550px;
       border-color: rgba(200, 150, 255, 0.1);
       animation-duration: 40s;
     }
     
     @keyframes ring-rotate-239 {
       0% { transform: translate(-50%, -50%) rotate(0deg); }
       100% { transform: translate(-50%, -50%) rotate(360deg); }
     }
     
     .void-particles-239 {
       position: absolute;
       inset: 0;
       background-image: 
         radial-gradient(2px 2px at 20px 30px, rgba(150, 100, 255, 0.5), transparent),
         radial-gradient(2px 2px at 40px 70px, rgba(100, 150, 255, 0.3), transparent),
         radial-gradient(1px 1px at 90px 40px, rgba(200, 150, 255, 0.4), transparent);
       background-size: 200px 200px;
       animation: star-drift-239 60s linear infinite;
     }
     
     @keyframes star-drift-239 {
       0% { transform: translateY(0); }
       100% { transform: translateY(-200px); }
     }
     
     /* 粒子画布 */
     .void-particle-canvas-239 {
       position: absolute;
       inset: 0;
       pointer-events: none;
       z-index: 5;
     }
     
     /* 字符容器 */
     .void-char-container-239 {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       display: flex;
       gap: 0.2em;
       z-index: 10;
     }
     
     .void-char-239 {
       display: inline-block;
       font-size: clamp(2rem, 7vw, 4.5rem);
       font-weight: 700;
       color: rgba(200, 180, 255, 0.9);
       text-shadow: 
         0 0 20px rgba(150, 100, 255, 0.8),
         0 0 40px rgba(100, 150, 255, 0.5),
         0 0 60px rgba(200, 150, 255, 0.3);
       user-select: none;
       will-change: transform, opacity;
       transition: text-shadow 0.3s ease;
     }
     
     /* 副标题 */
     .void-subtitle-239 {
       position: absolute;
       top: calc(50% + 100px);
       left: 50%;
       transform: translateX(-50%);
       font-size: clamp(0.75rem, 1.5vw, 1rem);
       color: rgba(150, 120, 200, 0.6);
       letter-spacing: 0.3em;
       white-space: nowrap;
       z-index: 10;
       display: flex;
       gap: 0.1em;
     }
     
     .subtitle-char-239 {
       display: inline-block;
     }
     
     /* 进度条 */
     .void-progress-239 {
       position: fixed;
       top: 0;
       left: 0;
       height: 2px;
       background: linear-gradient(90deg, 
         rgba(150, 100, 255, 0.5), 
         rgba(200, 150, 255, 0.8),
         rgba(100, 200, 255, 0.6));
       z-index: 100;
       transition: width 0.1s ease;
       box-shadow: 0 0 15px rgba(150, 100, 255, 0.5);
     }
     
     /* 装饰 */
     .void-decor-239 {
       position: absolute;
       bottom: 15%;
       left: 0;
       right: 0;
       height: 100px;
       z-index: 3;
       opacity: 0.6;
     
       svg {
         width: 100%;
         height: 100%;
       }
     }
     
     /* 响应式 */
     @media (max-width: 768px) {
       .void-char-container-239 {
         flex-wrap: wrap;
         justify-content: center;
         max-width: 90vw;
       }
     
       .void-char-239 {
         font-size: clamp(1.5rem, 8vw, 3rem);
       }
     
       .void-subtitle-239 {
         letter-spacing: 0.15em;
         font-size: 0.7rem;
       }
     
       .void-core-239 {
         width: 60px;
         height: 60px;
       }
     
       .void-ring-239 {
         display: none;
       }
     }
     </style>
     
     ```


2. 【特色模块】
   描述：产品特点/服务优势
   📦 使用组件 (3个)

  1. CardImageDeepSeaCoffin (card-image)
   ----------------------------------------------------------------------
   • Props 定义:
   默认值:
   imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
   title: '深海悬棺',
   subtitle: '多维空间沉浸视差'
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <div class="card-image-deep-sea-coffin" ref="parentRef">
         <div class="scene-container" ref="sceneRef">
           <!-- 远景水体层 -->
           <div class="water-layer" ref="waterRef">
             <div class="water-texture"></div>
           </div>
     
           <!-- 中景青铜棺椁 -->
           <div class="coffin-container" ref="coffinRef">
             <div class="coffin-frame">
               <div class="coffin-body">
                 <div class="coffin-image-wrapper" ref="imageWrapperRef">
                   <img
                     ref="imageRef"
                     :src="imageUrl"
                     :alt="title"
                     class="coffin-image"
                   />
                 </div>
                 <!-- 青铜锈蚀纹理层 -->
                 <div class="rust-overlay" ref="rustRef"></div>
                 <!-- 光柱效果 -->
                 <div class="light-beam" ref="lightBeamRef"></div>
               </div>
             </div>
           </div>
     
           <!-- 近景深海雪屑 -->
           <div class="particles-layer" ref="particlesRef">
             <div
               v-for="i in 40"
               :key="i"
               class="particle"
               :ref="el => { if (el) particleRefs[i - 1] = el as HTMLElement }"
               :style="getParticleStyle(i)"
             ></div>
           </div>
         </div>
     
         <!-- 内容 -->
         <div class="content-overlay" ref="contentRef">
           <h2 class="title">{{ title }}</h2>
           <p class="subtitle">{{ subtitle }}</p>
         </div>
       </div>
     </template>
     
     <script setup lang="ts">
     import { ref, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import { ScrollTrigger } from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     type TweenCleanup = { revert: () => void }
     
     const props = withDefaults(defineProps<{
       imageUrl?: string
       title?: string
       subtitle?: string
     }>(), {
       imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
       title: '深海悬棺',
       subtitle: '多维空间沉浸视差'
     })
     
     const parentRef = ref<HTMLElement | null>(null)
     const sceneRef = ref<HTMLElement | null>(null)
     const waterRef = ref<HTMLElement | null>(null)
     const coffinRef = ref<HTMLElement | null>(null)
     const imageWrapperRef = ref<HTMLElement | null>(null)
     const rustRef = ref<HTMLElement | null>(null)
     const lightBeamRef = ref<HTMLElement | null>(null)
     const particlesRef = ref<HTMLElement | null>(null)
     const contentRef = ref<HTMLElement | null>(null)
     const imageRef = ref<HTMLImageElement | null>(null)
     
     const particleRefs = ref<(HTMLElement | null)[]>([])
     
     let cleanupFns: TweenCleanup[] = []
     
     const getParticleStyle = (index: number) => {
       const size = Math.random() * 3 + 1
       const xPos = Math.random() * 100
       const yPos = Math.random() * 100
       const delay = Math.random() * 5
       const duration = Math.random() * 3 + 4
     
       return {
         width: `${size}px`,
         height: `${size}px`,
         left: `${xPos}%`,
         top: `${yPos}%`,
         animationDelay: `${delay}s`,
         animationDuration: `${duration}s`
       }
     }
     
     onMounted(() => {
       if (!parentRef.value) return
     
       const ctx = gsap.context(() => {
         // ========== 远景水体层 ==========
         const waterTimeline = gsap.timeline({
           scrollTrigger: {
             trigger: parentRef.value,
             start: 'top 100%',
             end: 'bottom 20%',
             scrub: 1.5
           }
         })
     
         cleanupFns.push({
           revert: () => waterTimeline.kill()
         })
     
         if (waterRef.value) {
           // 远景水体初始在上方，向下滚动时下沉
           waterTimeline.fromTo(waterRef.value,
             { y: -100 },
             { y: 50, ease: 'none' },
             0
           )
     
           // 水体透明度随深度降低
           waterTimeline.fromTo(waterRef.value,
             { opacity: 0.5 },
             { opacity: 0.3, ease: 'sine.inOut' },
             0
           )
         }
     
         // ========== 中景青铜棺椁 ==========
         const coffinTimeline = gsap.timeline({
           scrollTrigger: {
             trigger: parentRef.value,
             start: 'top 100%',
             end: 'bottom 20%',
             scrub: 1.5
           }
         })
     
         cleanupFns.push({
           revert: () => coffinTimeline.kill()
         })
     
         if (coffinRef.value && imageRef.value) {
           // 棺椁初始在上方，向下滚动时下沉
           coffinTimeline.fromTo(coffinRef.value,
             { y: -40 },
             { y: 40, ease: 'sine.inOut' },
             0
           )
     
           // 棺椁绕Y轴旋转 -1.5deg 至 +1.5deg
           coffinTimeline.fromTo(coffinRef.value,
             { rotateY: 0 },
             { rotateY: 3, ease: 'sine.inOut' },
             0
           )
     
           // 亮度与对比度联动：初始清晰，向下滚动时略暗增强氛围
           coffinTimeline.fromTo(imageRef.value,
             { filter: 'brightness(1.0) contrast(1.0)' },
             { filter: 'brightness(0.9) contrast(1.05)', ease: 'sine.inOut' },
             0
           )
         }
     
         // ========== 光柱效果 ==========
         if (lightBeamRef.value && imageWrapperRef.value) {
           const lightTimeline = gsap.timeline({
             scrollTrigger: {
               trigger: parentRef.value,
               start: 'top 100%',
               end: 'bottom 20%',
               scrub: 1.5
             }
           })
     
           cleanupFns.push({
             revert: () => lightTimeline.kill()
           })
     
           // 光柱从左上向右下移动
           lightTimeline.fromTo(lightBeamRef.value,
             { x: -200, y: -100, opacity: 0.05 },
             { x: 200, y: 100, opacity: 0.12, ease: 'sine.inOut' },
             0
           )
         }
     
         // ========== 锈蚀纹理联动 ==========
         if (rustRef.value) {
           const rustTimeline = gsap.timeline({
             scrollTrigger: {
               trigger: parentRef.value,
               start: 'top 100%',
               end: 'bottom 20%',
               scrub: 1.5
             }
           })
     
           cleanupFns.push({
             revert: () => rustTimeline.kill()
           })
     
           // 锈蚀纹理随光柱显现
           rustTimeline.fromTo(rustRef.value,
             { opacity: 0.08 },
             { opacity: 0.25, ease: 'sine.inOut' },
             0
           )
         }
     
         // ========== 近景雪屑层 ==========
         const particlesTimeline = gsap.timeline({
           scrollTrigger: {
             trigger: parentRef.value,
             start: 'top 100%',
             end: 'bottom 20%',
             scrub: 1.5
           }
         })
     
         cleanupFns.push({
           revert: () => particlesTimeline.kill()
         })
     
         if (particlesRef.value) {
           // 雪屑上浮
           particlesTimeline.fromTo(particlesRef.value,
             { y: 0 },
             { y: -200, ease: 'none' },
             0
           )
         }
     
         // 粒子闪烁动画
         particleRefs.value.forEach((particle, index) => {
           if (!particle) return
     
           const flickerDuration = Math.random() * 2 + 1.5
           const flickerDelay = Math.random() * 3
     
           gsap.set(particle, { opacity: 0 })
     
           const flickerTl = gsap.timeline({
             repeat: -1,
             delay: flickerDelay
           })
     
           flickerTl.to(particle, {
             opacity: Math.random() * 0.6 + 0.2,
             duration: flickerDuration * 0.3,
             ease: 'power2.in'
           })
             .to(particle, {
               opacity: Math.random() * 0.3,
               duration: flickerDuration * 0.4,
               ease: 'power2.out'
             })
             .to(particle, {
               opacity: Math.random() * 0.5 + 0.1,
               duration: flickerDuration * 0.3,
               ease: 'power2.inOut'
             })
     
           cleanupFns.push({
             revert: () => flickerTl.kill()
           })
         })
     
         // ========== 内容入场动画 ==========
         const contentTl = gsap.timeline({
           scrollTrigger: {
             trigger: parentRef.value,
             start: 'top 80%',
             end: 'top 20%',
             scrub: 1
           }
         })
     
         cleanupFns.push({
           revert: () => contentTl.kill()
         })
     
         if (contentRef.value) {
           contentTl.fromTo(contentRef.value,
             { opacity: 0, y: 40 },
             { opacity: 1, y: 0, ease: 'power3.out' },
             0
           )
         }
     
       }, parentRef.value)
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn.revert?.())
       ScrollTrigger.getAll().forEach(st => st.kill())
     })
     </script>
     
     <style scoped lang="scss">
     .card-image-deep-sea-coffin {
       position: relative;
       width: 100vw;
       height: 100vh;
       overflow: hidden;
       background: linear-gradient(180deg,
         #0a1628 0%,
         #0d2137 30%,
         #112942 60%,
         #0a1628 100%
       );
     }
     
     .scene-container {
       position: relative;
       width: 100%;
       height: 100%;
       perspective: 1200px;
       overflow: hidden;
     }
     
     // ========== 远景水体层 ==========
     .water-layer {
       position: absolute;
       inset: 0;
       z-index: 1;
       opacity: 0.5;
     
       .water-texture {
         position: absolute;
         inset: 0;
         background:
           radial-gradient(ellipse at 30% 20%, rgba(20, 60, 100, 0.3) 0%, transparent 50%),
           radial-gradient(ellipse at 70% 60%, rgba(15, 50, 90, 0.25) 0%, transparent 40%),
           repeating-linear-gradient(
             0deg,
             transparent,
             transparent 2px,
             rgba(30, 80, 130, 0.03) 2px,
             rgba(30, 80, 130, 0.03) 4px
           );
         animation: waterFlow 20s linear infinite;
       }
     }
     
     @keyframes waterFlow {
       0% { transform: translateY(0); }
       100% { transform: translateY(-50px); }
     }
     
     // ========== 中景青铜棺椁 ==========
     .coffin-container {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       z-index: 2;
       perspective: 1000px;
     }
     
     .coffin-frame {
       position: relative;
       width: 75vw;
       max-width: 900px;
       aspect-ratio: 16 / 10;
       transform-style: preserve-3d;
     }
     
     .coffin-body {
       position: relative;
       width: 100%;
       height: 100%;
       background: linear-gradient(135deg,
         #2a3a2a 0%,
         #1a2518 25%,
         #2d3d2d 50%,
         #1a2518 75%,
         #2a3a2a 100%
       );
       border-radius: 12px;
       box-shadow:
         0 0 60px rgba(0, 0, 0, 0.8),
         inset 0 0 30px rgba(0, 0, 0, 0.5),
         0 0 120px rgba(20, 50, 40, 0.3);
     
       // 青铜边框
       &::before {
         content: '';
         position: absolute;
         inset: 0;
         border-radius: 12px;
         border: 3px solid transparent;
         border-image: linear-gradient(
           135deg,
           #4a5a3a 0%,
           #2a3525 25%,
           #5a6a4a 50%,
           #2a3525 75%,
           #4a5a3a 100%
         ) 1;
         pointer-events: none;
       }
     
       // 青铜装饰纹
       &::after {
         content: '';
         position: absolute;
         inset: 8px;
         border-radius: 8px;
         border: 1px solid rgba(90, 106, 74, 0.3);
         pointer-events: none;
       }
     }
     
     .coffin-image-wrapper {
       position: absolute;
       inset: 16px;
       border-radius: 6px;
       overflow: hidden;
       background: #000;
     }
     
     .coffin-image {
       width: 100%;
       height: 100%;
       object-fit: cover;
       filter: brightness(1.0) contrast(1.0);
     }
     
     // 锈蚀纹理层
     .rust-overlay {
       position: absolute;
       inset: 16px;
       border-radius: 6px;
       background:
         radial-gradient(ellipse at 25% 30%, rgba(80, 100, 60, 0.15) 0%, transparent 30%),
         radial-gradient(ellipse at 75% 70%, rgba(60, 80, 50, 0.12) 0%, transparent 25%),
         radial-gradient(ellipse at 50% 50%, rgba(70, 90, 55, 0.1) 0%, transparent 40%);
       opacity: 0.08;
       mix-blend-mode: overlay;
       pointer-events: none;
     }
     
     // 光柱效果
     .light-beam {
       position: absolute;
       inset: 0;
       background: linear-gradient(
         135deg,
         rgba(150, 200, 255, 0.15) 0%,
         rgba(100, 180, 220, 0.08) 50%,
         transparent 100%
       );
       opacity: 0.05;
       pointer-events: none;
       border-radius: 6px;
     }
     
     // ========== 近景雪屑层 ==========
     .particles-layer {
       position: absolute;
       inset: 0;
       z-index: 3;
       pointer-events: none;
     }
     
     .particle {
       position: absolute;
       background: radial-gradient(circle, rgba(180, 220, 255, 0.8) 0%, transparent 70%);
       border-radius: 50%;
       opacity: 0;
       animation: particleFloat 5s ease-in-out infinite;
     }
     
     @keyframes particleFloat {
       0%, 100% {
         opacity: 0;
         transform: translateY(0) translateX(0);
       }
       20% {
         opacity: 0.6;
       }
       50% {
         opacity: 0.3;
         transform: translateY(-30px) translateX(10px);
       }
       80% {
         opacity: 0.5;
       }
     }
     
     // ========== 内容层 ==========
     .content-overlay {
       position: absolute;
       bottom: 12vh;
       left: 50%;
       transform: translateX(-50%);
       z-index: 10;
       text-align: center;
       opacity: 0;
     }
     
     .title {
       font-family: 'Noto Serif SC', 'STSong', serif;
       font-size: clamp(2rem, 5vw, 3.5rem);
       font-weight: 700;
       color: transparent;
       background: linear-gradient(135deg,
         #a8c8d8 0%,
         #c8e0e8 30%,
         #88b0c8 70%,
         #a0c0d0 100%
       );
       background-clip: text;
       -webkit-background-clip: text;
       letter-spacing: 0.3em;
       text-shadow: 0 0 40px rgba(150, 200, 220, 0.3);
       margin-bottom: 1rem;
     }
     
     .subtitle {
       font-family: 'Noto Sans SC', sans-serif;
       font-size: clamp(0.9rem, 2vw, 1.2rem);
       color: rgba(160, 190, 210, 0.7);
       letter-spacing: 0.5em;
       font-weight: 300;
     }
     </style>
     
     ```

  2. CardTextSynapse (card-text)
   ----------------------------------------------------------------------
   • 🎨 Canvas 特殊处理:
   ⚠️ 使用 Canvas 2D API
   1. React 中必须使用 useRef<HTMLCanvasElement>() 获取画布引用
   2. Canvas 绑定必须在 useEffect 中执行（DOM 渲染后）
   3. 动画循环需在 useEffect 中设置 requestAnimationFrame
   4. 清理函数中必须取消动画帧 cancelAnimationFrame
   5. 监听 resize 事件，及时更新 canvas 尺寸
   • 检测到路径绘制（圆/线条/矩形）
   • 检测到 GSAP + requestAnimationFrame 混合动画，需确保两者的 RAF 同步
   📌 性能建议：Canvas 动画建议添加 visibilitychange 监听，页面不可见时暂停
   • Props 定义:
   title?: string
   subtitle?: string
   paragraphs?: string[]
   autoPlay?: boolean
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <section ref="sectionRef" class="synapse-section-114" @mousemove="handleMouseMove">
         <!-- 神经网络背景 -->
         <canvas ref="bgCanvasRef" class="synapse-canvas-114"></canvas>
     
         <!-- 主内容 -->
         <div class="synapse-content-114">
           <!-- 标题 -->
           <h1 class="synapse-title-114">
             <span v-for="(char, idx) in displayTitle" :key="idx" class="synapse-char-114">{{ char }}</span>
           </h1>
     
           <!-- 副标题 -->
           <p class="synapse-subtitle-114">{{ subtitle }}</p>
     
           <!-- 段落 -->
           <div class="synapse-paragraphs-114">
             <p v-for="(para, idx) in paragraphs" :key="idx" class="synapse-para-114">{{ para }}</p>
           </div>
         </div>
     
         <!-- 放电粒子容器 -->
         <div ref="particleContainerRef" class="synapse-particles-114"></div>
     
         <!-- 滚动提示 -->
         <div class="synapse-scroll-hint-114" :class="{ hidden: scrollHintHidden }">
           <span>滚动探索</span>
           <div class="synapse-scroll-arrow-114">
             <svg viewBox="0 0 24 24" fill="none">
               <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="2"/>
             </svg>
           </div>
         </div>
     
         <!-- 进度 -->
         <div class="synapse-progress-114">
           <div class="synapse-progress-bar-114" :style="{ width: `${progress}%` }"></div>
         </div>
       </section>
     </template>
     
     <script setup lang="ts">
     import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
     import gsap from 'gsap'
     import { ScrollTrigger } from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     interface Props {
       title?: string
       subtitle?: string
       paragraphs?: string[]
       autoPlay?: boolean
     }
     
     const props = withDefaults(defineProps<Props>(), {
       title: 'SYNAPSE',
       subtitle: 'Neural Pulse Activation',
       paragraphs: () => [
         'Bio-digital consciousness emerging from silicon dreams',
         'Synaptic pathways illuminate the path to digital evolution'
       ],
       autoPlay: true
     })
     
     const emit = defineEmits<{
       'scroll-progress': [progress: number]
       'animation-start': []
       'animation-complete': []
     }>()
     
     // Refs
     const sectionRef = ref<HTMLElement | null>(null)
     const bgCanvasRef = ref<HTMLCanvasElement | null>(null)
     const particleContainerRef = ref<HTMLElement | null>(null)
     
     // State
     const progress = ref(0)
     const scrollHintHidden = ref(false)
     const isActivated = ref(false)
     const displayTitle = ref(props.title.split('').map(c => c === ' ' ? '\u00A0' : c))
     
     // Animation state
     let ctx: gsap.Context | null = null
     let scrollTriggerInstance: ScrollTrigger | null = null
     let animationFrameId: number | null = null
     let bgAnimationId: number | null = null
     let breathAnimId: number | null = null
     let particles: { el: HTMLElement; x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = []
     const cleanupFns: (() => void)[] = []
     
     // Mouse state
     const mouseState = ref({ x: 0, y: 0 })
     
     // Create spark particle
     const createSpark = (x: number, y: number) => {
       const container = particleContainerRef.value
       if (!container) return
     
       const spark = document.createElement('div')
       spark.className = 'synapse-spark-114'
       spark.style.cssText = `left:${x}px;top:${y}px;position:absolute;width:6px;height:6px;border-radius:50%;background:radial-gradient(circle, rgba(180,220,255,1) 0%, rgba(120,180,255,0.5) 50%, transparent 100%);pointer-events:none;box-shadow:0 0 10px rgba(120,180,255,0.8),0 0 20px rgba(180,100,255,0.5);`
     
       container.appendChild(spark)
     
       const angle = Math.random() * Math.PI * 2
       const speed = Math.random() * 80 + 40
     
       particles.push({
         el: spark,
         x,
         y,
         vx: Math.cos(angle) * speed,
         vy: Math.sin(angle) * speed,
         life: 0,
         maxLife: 30 + Math.random() * 20
       })
     }
     
     // Animate particles
     const animateParticles = () => {
       particles = particles.filter(p => {
         p.life++
         p.x += p.vx * 0.05
         p.y += p.vy * 0.05
         p.vy += 0.5
     
         const opacity = 1 - p.life / p.maxLife
         p.el.style.opacity = String(opacity)
         p.el.style.transform = `translate(${p.x - parseFloat(p.el.style.left)}px, ${p.y - parseFloat(p.el.style.top)}px) scale(${opacity})`
     
         if (p.life >= p.maxLife) {
           p.el.remove()
           return false
         }
         return true
       })
     
       if (particles.length > 0) {
         animationFrameId = requestAnimationFrame(animateParticles)
       }
     }
     
     // Mouse handler
     const handleMouseMove = (e: MouseEvent) => {
       mouseState.value.x = (e.clientX / window.innerWidth - 0.5) * 20
       mouseState.value.y = (e.clientY / window.innerHeight - 0.5) * 20
     
       if (isActivated.value && Math.random() > 0.95) {
         const section = sectionRef.value
         if (section) {
           const rect = section.getBoundingClientRect()
           createSpark(e.clientX - rect.left, e.clientY - rect.top)
         }
       }
     }
     
     // Background canvas animation
     const initBackgroundCanvas = () => {
       const canvas = bgCanvasRef.value
       if (!canvas) return
     
       const ctx = canvas.getContext('2d')
       if (!ctx) return
     
       canvas.width = window.innerWidth
       canvas.height = window.innerHeight
     
       const networkParticles: { x: number; y: number; vx: number; vy: number; size: number }[] = []
       for (let i = 0; i < 80; i++) {
         networkParticles.push({
           x: Math.random() * canvas.width,
           y: Math.random() * canvas.height,
           vx: (Math.random() - 0.5) * 0.3,
           vy: (Math.random() - 0.5) * 0.3,
           size: Math.random() * 2 + 1
         })
       }
     
       const animate = () => {
         ctx.fillStyle = 'rgba(5, 5, 15, 0.08)'
         ctx.fillRect(0, 0, canvas.width, canvas.height)
     
         networkParticles.forEach(p => {
           p.x += p.vx
           p.y += p.vy
           if (p.x < 0 || p.x > canvas.width) p.vx *= -1
           if (p.y < 0 || p.y > canvas.height) p.vy *= -1
     
           ctx.beginPath()
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
           ctx.fillStyle = `rgba(100, 150, 255, ${0.3 + Math.sin(Date.now() * 0.001 + p.x) * 0.15})`
           ctx.fill()
         })
     
         // Draw connections
         for (let i = 0; i < networkParticles.length; i++) {
           for (let j = i + 1; j < networkParticles.length; j++) {
             const dx = networkParticles[i].x - networkParticles[j].x
             const dy = networkParticles[i].y - networkParticles[j].y
             const dist = Math.sqrt(dx * dx + dy * dy)
             if (dist < 120) {
               ctx.beginPath()
               ctx.moveTo(networkParticles[i].x, networkParticles[i].y)
               ctx.lineTo(networkParticles[j].x, networkParticles[j].y)
               ctx.strokeStyle = `rgba(100, 150, 255, ${(1 - dist / 120) * 0.15})`
               ctx.stroke()
             }
           }
         }
     
         bgAnimationId = requestAnimationFrame(animate)
       }
     
       animate()
     }
     
     // Play activation animation
     const playActivation = () => {
       if (isActivated.value) return
       isActivated.value = true
       emit('animation-start')
     
       const chars = document.querySelectorAll('.synapse-char-114')
       const subtitle = document.querySelector('.synapse-subtitle-114')
       const paras = document.querySelectorAll('.synapse-para-114')
     
       if (!chars.length) return
     
       const tl = gsap.timeline({
         onComplete: () => {
           startBreathingGlow()
           emit('animation-complete')
         }
       })
     
       // Animate characters with pulse effect
       tl.fromTo(chars,
         {
           opacity: 0,
           textShadow: '0 0 0px rgba(120, 180, 255, 0)',
           filter: 'brightness(1)'
         },
         {
           opacity: 1,
           textShadow: '0 0 20px rgba(120, 180, 255, 0.8), 0 0 40px rgba(180, 100, 255, 0.5)',
           filter: 'brightness(1.5)',
           duration: 0.4,
           stagger: 0.1,
           ease: 'power2.out'
         }
       )
     
       // Create sparks
       tl.call(() => {
         chars.forEach((char, idx) => {
           if (idx % 2 === 0) {
             const rect = char.getBoundingClientRect()
             const section = sectionRef.value
             if (section && rect) {
               const sRect = section.getBoundingClientRect()
               const x = rect.left - sRect.left + rect.width / 2
               const y = rect.top - sRect.top + rect.height / 2
               for (let i = 0; i < 3; i++) {
                 setTimeout(() => createSpark(x, y), i * 50)
               }
             }
           }
         })
       })
     
       // Subtitle
       if (subtitle) {
         tl.fromTo(subtitle,
           { opacity: 0, y: 20 },
           { opacity: 0.7, y: 0, duration: 0.8, ease: 'power2.out' },
           '-=0.3'
         )
       }
     
       // Paragraphs
       if (paras.length) {
         tl.fromTo(paras,
           { opacity: 0, y: 30 },
           { opacity: 0.6, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.2 },
           '-=0.5'
         )
       }
     }
     
     // Breathing glow
     const startBreathingGlow = () => {
       const chars = document.querySelectorAll('.synapse-char-114')
       if (!chars.length) return
     
       const animate = () => {
         const time = Date.now() * 0.002
         chars.forEach((char, idx) => {
           const breath = Math.sin(time + idx * 0.2) * 0.3 + 0.7
           ;(char as HTMLElement).style.textShadow = `0 0 ${10 + breath * 20}px rgba(120, 180, 255, ${breath * 0.8}), 0 0 ${20 + breath * 30}px rgba(180, 100, 255, ${breath * 0.4})`
         })
         breathAnimId = requestAnimationFrame(animate)
       }
       animate()
     }
     
     const stopBreathingGlow = () => {
       if (breathAnimId) {
         cancelAnimationFrame(breathAnimId)
         breathAnimId = null
       }
     }
     
     // Reset
     const resetAnimation = () => {
       isActivated.value = false
       stopBreathingGlow()
     
       const chars = document.querySelectorAll('.synapse-char-114')
       chars.forEach(char => {
         ;(char as HTMLElement).style.textShadow = '0 0 0px rgba(120, 180, 255, 0)'
         gsap.set(char, { opacity: 0, filter: 'brightness(1)' })
       })
     
       const subtitle = document.querySelector('.synapse-subtitle-114')
       if (subtitle) gsap.set(subtitle, { opacity: 0, y: 20 })
     
       const paras = document.querySelectorAll('.synapse-para-114')
       paras.forEach(para => gsap.set(para, { opacity: 0, y: 30 }))
     
       // Clear particles
       particles.forEach(p => p.el.remove())
       particles = []
     }
     
     // Initialize
     const init = () => {
       const rootEl = sectionRef.value
       if (!rootEl) return
     
       // Initial states
       gsap.set('.synapse-char-114', { opacity: 0, filter: 'brightness(1)', textShadow: '0 0 0px rgba(120, 180, 255, 0)' })
       gsap.set('.synapse-subtitle-114', { opacity: 0, y: 20 })
       gsap.set('.synapse-para-114', { opacity: 0, y: 30 })
     
       ctx = gsap.context(() => {
         scrollTriggerInstance = ScrollTrigger.create({
           trigger: rootEl,
           start: 'top 80%',
           end: 'top 20%',
           scrub: 1.5,
           onUpdate: (self) => {
             progress.value = self.progress * 100
             emit('scroll-progress', self.progress)
             if (self.progress > 0.05) scrollHintHidden.value = true
           },
           onEnter: () => {
             if (props.autoPlay) playActivation()
           },
           onLeaveBack: () => {
             resetAnimation()
           }
         })
         cleanupFns.push(() => scrollTriggerInstance?.kill())
       }, rootEl)
     }
     
     onMounted(() => {
       initBackgroundCanvas()
       nextTick(() => init())
       animateParticles()
     
       window.addEventListener('resize', () => {
         const canvas = bgCanvasRef.value
         if (canvas) {
           canvas.width = window.innerWidth
           canvas.height = window.innerHeight
         }
       })
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn())
       ctx?.revert()
       scrollTriggerInstance?.kill()
       stopBreathingGlow()
       if (animationFrameId) cancelAnimationFrame(animationFrameId)
       if (bgAnimationId) cancelAnimationFrame(bgAnimationId)
       particles.forEach(p => p.el.remove())
     })
     
     watch(() => props.title, (newTitle) => {
       displayTitle.value = newTitle.split('').map(c => c === ' ' ? '\u00A0' : c)
     })
     </script>
     
     <style lang="scss" scoped>
     .synapse-section-114 {
       position: relative;
       width: 100vw;
       height: 100vh;
       display: flex;
       align-items: center;
       justify-content: center;
       overflow: hidden;
       background: linear-gradient(135deg, #030308 0%, #0a0a1a 50%, #050510 100%);
       font-family: 'Orbitron', 'Rajdhani', system-ui, sans-serif;
     }
     
     .synapse-canvas-114 {
       position: absolute;
       inset: 0;
       pointer-events: none;
     }
     
     .synapse-content-114 {
       position: relative;
       z-index: 10;
       text-align: center;
       padding: 2rem;
       max-width: 900px;
     }
     
     .synapse-title-114 {
       font-size: clamp(4rem, 15vw, 12rem);
       font-weight: 900;
       letter-spacing: 0.15em;
       margin: 0 0 1.5rem;
       line-height: 1.1;
       display: flex;
       justify-content: center;
       flex-wrap: wrap;
       gap: 0.05em;
     }
     
     .synapse-char-114 {
       display: inline-block;
       color: #e0e8ff;
       background: linear-gradient(180deg, #ffffff 0%, #a0c0ff 50%, #6080d0 100%);
       -webkit-background-clip: text;
       -webkit-text-fill-color: transparent;
       background-clip: text;
       text-shadow: none;
       filter: drop-shadow(0 0 10px rgba(120, 180, 255, 0.3));
       cursor: default;
       transition: transform 0.1s ease;
     }
     
     .synapse-subtitle-114 {
       font-size: clamp(1rem, 2.5vw, 1.5rem);
       color: rgba(160, 200, 255, 0.7);
       letter-spacing: 0.4em;
       text-transform: uppercase;
       margin: 0 0 3rem;
       font-weight: 300;
     }
     
     .synapse-paragraphs-114 {
       display: flex;
       flex-direction: column;
       gap: 1.5rem;
     }
     
     .synapse-para-114 {
       font-size: clamp(0.9rem, 1.8vw, 1.2rem);
       color: rgba(180, 200, 230, 0.6);
       line-height: 1.8;
       margin: 0;
       font-weight: 300;
       letter-spacing: 0.05em;
     }
     
     .synapse-particles-114 {
       position: absolute;
       inset: 0;
       pointer-events: none;
       z-index: 20;
     }
     
     .synapse-scroll-hint-114 {
       position: absolute;
       bottom: 3rem;
       left: 50%;
       transform: translateX(-50%);
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 0.5rem;
       color: rgba(120, 160, 220, 0.5);
       font-size: 0.85rem;
       letter-spacing: 0.2em;
       transition: opacity 0.5s ease;
     
       &.hidden {
         opacity: 0;
         pointer-events: none;
       }
     }
     
     .synapse-scroll-arrow-114 {
       width: 24px;
       height: 24px;
       animation: bounce 2s infinite;
     
       svg {
         width: 100%;
         height: 100%;
       }
     }
     
     @keyframes bounce {
       0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
       40% { transform: translateY(8px); }
       60% { transform: translateY(4px); }
     }
     
     .synapse-progress-114 {
       position: absolute;
       bottom: 0;
       left: 0;
       right: 0;
       height: 3px;
       background: rgba(60, 80, 120, 0.3);
     }
     
     .synapse-progress-bar-114 {
       height: 100%;
       background: linear-gradient(90deg, rgba(120, 180, 255, 0.8), rgba(180, 100, 255, 0.8));
       transition: width 0.1s ease;
       box-shadow: 0 0 10px rgba(120, 180, 255, 0.5);
     }
     </style>
     
     ```

  3. CardAudioWave (card-list)
   ----------------------------------------------------------------------
   • 🎨 Canvas 特殊处理:
   ⚠️ 使用 Canvas 2D API
   1. React 中必须使用 useRef<HTMLCanvasElement>() 获取画布引用
   2. Canvas 绑定必须在 useEffect 中执行（DOM 渲染后）
   3. 动画循环需在 useEffect 中设置 requestAnimationFrame
   4. 清理函数中必须取消动画帧 cancelAnimationFrame
   5. 监听 resize 事件，及时更新 canvas 尺寸
   • 检测到路径绘制（圆/线条/矩形）
   • 检测到 GSAP + requestAnimationFrame 混合动画，需确保两者的 RAF 同步
   📌 性能建议：Canvas 动画建议添加 visibilitychange 监听，页面不可见时暂停
   • Props 定义: 该组件无外部Props，内容在组件内部定义
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <section class="audio-section">
         <!-- 背景波形 -->
         <div class="wave-bg">
           <canvas ref="bgCanvas" class="wave-canvas"></canvas>
         </div>
     
         <!-- 网格线 -->
         <div class="grid-overlay"></div>
     
         <!-- 频谱光效 -->
         <div class="spectrum-glow" ref="spectrumGlow"></div>
     
         <div class="audio-container">
           <div
             v-for="(card, index) in cards"
             :key="card.id"
             class="audio-card"
             :ref="(el) => setCardRef(el, index)"
             :style="{ '--audio-color': card.color }"
           >
             <!-- 波形可视化 -->
             <div class="waveform-visual" :ref="(el) => setWaveRef(el, index)">
               <canvas :ref="(el) => setCanvasRef(el, index)" class="wave-canvas-card"></canvas>
             </div>
     
             <!-- 圆形频谱 -->
             <div class="circle-spectrum" :ref="(el) => setCircleRef(el, index)">
               <div
                 v-for="i in 32"
                 :key="i"
                 class="spectrum-bar"
                 :ref="(el) => setBarRef(el, index, i)"
                 :style="{ '--bar-index': i }"
               ></div>
             </div>
     
             <!-- 圆形中心 -->
             <div class="circle-center">
               <div class="center-icon" :ref="(el) => setIconRef(el, index)">
                 {{ card.icon }}
               </div>
             </div>
     
             <!-- 内容 -->
             <div class="audio-content" :ref="(el) => setContentRef(el, index)">
               <h3 class="audio-title" :ref="(el) => setTitleRef(el, index)">{{ card.title }}</h3>
               <p class="audio-desc" :ref="(el) => setDescRef(el, index)">{{ card.desc }}</p>
               <div class="audio-bars" :ref="(el) => setAudioBarsRef(el, index)">
                 <span v-for="i in 5" :key="i" class="audio-bar"></span>
               </div>
             </div>
     
             <!-- 扫描线 -->
             <div class="scan-line" :ref="(el) => setScanRef(el, index)"></div>
           </div>
         </div>
       </section>
     </template>
     
     <script setup lang="ts">
     /**
      * CardAudioWave - 音频可视化卡片组件
      * @description 波形、频谱、圆形可视化等音频风格的动画效果
      */
     
     import { ref, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import ScrollTrigger from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     // ============================================================
     // 类型定义
     // ============================================================
     interface AudioCard {
       id: string
       icon: string
       title: string
       desc: string
       color: string
     }
     
     // ============================================================
     // 数据
     // ============================================================
     const CARDS_DATA: AudioCard[] = [
       {
         id: 'audio-1',
         icon: '🎵',
         title: 'Bass Boost',
         desc: 'Feel the deep rhythm of low frequencies',
         color: '#e74c3c'
       },
       {
         id: 'audio-2',
         icon: '🎸',
         title: 'Mid Range',
         desc: 'Crystal clear mid-frequency vocals',
         color: '#3498db'
       },
       {
         id: 'audio-3',
         icon: '🎹',
         title: 'High Notes',
         desc: 'Crisp and sparkling high frequencies',
         color: '#2ecc71'
       }
     ]
     
     // ============================================================
     // 响应式数据
     // ============================================================
     const cards = ref<AudioCard[]>(CARDS_DATA)
     const cardRefsMap = ref(new Map<number, HTMLElement>())
     const waveRefsMap = ref(new Map<number, HTMLElement>())
     const canvasRefsMap = ref(new Map<number, HTMLCanvasElement>())
     const circleRefsMap = ref(new Map<number, HTMLElement>())
     const barRefsMap = ref(new Map<string, HTMLElement>())
     const iconRefsMap = ref(new Map<number, HTMLElement>())
     const contentRefsMap = ref(new Map<number, HTMLElement>())
     const titleRefsMap = ref(new Map<number, HTMLElement>())
     const descRefsMap = ref(new Map<number, HTMLElement>())
     const audioBarsRefsMap = ref(new Map<number, HTMLElement>())
     const scanRefsMap = ref(new Map<number, HTMLElement>())
     const spectrumGlow = ref<HTMLElement | null>(null)
     const bgCanvas = ref<HTMLCanvasElement | null>(null)
     const cleanupFns: (() => void)[] = []
     let bgCtx: CanvasRenderingContext2D | null = null
     let bgAnimationFrame: number | null = null
     let waveformAnimationFrame: number | null = null
     let audioAnimations: gsap.core.Tween[] = []
     
     // ============================================================
     // 模板引用
     // ============================================================
     const setCardRef = (el: Element | ComponentPublicInstance | null, index: number) => {
       const element = el instanceof Element ? el : (el as any)?.$el
       if (element) cardRefsMap.value.set(index, element as HTMLElement)
       else cardRefsMap.value.delete(index)
     }
     
     const setWaveRef = (el: Element | null, index: number) => {
       if (el instanceof HTMLElement) waveRefsMap.value.set(index, el)
       else waveRefsMap.value.delete(index)
     }
     
     const setCanvasRef = (el: Element | null, index: number) => {
       if (el instanceof HTMLCanvasElement) canvasRefsMap.value.set(index, el)
       else canvasRefsMap.value.delete(index)
     }
     
     const setCircleRef = (el: Element | null, index: number) => {
       if (el instanceof HTMLElement) circleRefsMap.value.set(index, el)
       else circleRefsMap.value.delete(index)
     }
     
     const setBarRef = (el: Element | null, index: number, barIndex: number) => {
       if (el instanceof HTMLElement) barRefsMap.value.set(`${index}-${barIndex}`, el)
       else barRefsMap.value.delete(`${index}-${barIndex}`)
     }
     
     const setIconRef = (el: Element | ComponentPublicInstance | null, index: number) => {
       const element = el instanceof Element ? el : (el as any)?.$el
       if (element) iconRefsMap.value.set(index, element as HTMLElement)
       else iconRefsMap.value.delete(index)
     }
     
     const setContentRef = (el: Element | ComponentPublicInstance | null, index: number) => {
       const element = el instanceof Element ? el : (el as any)?.$el
       if (element) contentRefsMap.value.set(index, element as HTMLElement)
       else contentRefsMap.value.delete(index)
     }
     
     const setTitleRef = (el: Element | ComponentPublicInstance | null, index: number) => {
       const element = el instanceof Element ? el : (el as any)?.$el
       if (element) titleRefsMap.value.set(index, element as HTMLElement)
       else titleRefsMap.value.delete(index)
     }
     
     const setDescRef = (el: Element | ComponentPublicInstance | null, index: number) => {
       const element = el instanceof Element ? el : (el as any)?.$el
       if (element) descRefsMap.value.set(index, element as HTMLElement)
       else descRefsMap.value.delete(index)
     }
     
     const setAudioBarsRef = (el: Element | ComponentPublicInstance | null, index: number) => {
       const element = el instanceof Element ? el : (el as any)?.$el
       if (element) audioBarsRefsMap.value.set(index, element as HTMLElement)
       else audioBarsRefsMap.value.delete(index)
     }
     
     const setScanRef = (el: Element | null, index: number) => {
       if (el instanceof HTMLElement) scanRefsMap.value.set(index, el)
       else scanRefsMap.value.delete(index)
     }
     
     // ============================================================
     // 背景波形动画
     // ============================================================
     const initBackgroundWaves = () => {
       const canvas = bgCanvas.value
       if (!canvas) return
     
       bgCtx = canvas.getContext('2d')
       if (!bgCtx) return
     
       const resize = () => {
         canvas.width = window.innerWidth
         canvas.height = window.innerHeight
       }
       resize()
       window.addEventListener('resize', resize)
     
       let phase = 0
       const animate = () => {
         if (!bgCtx || !canvas) return
     
         bgCtx.fillStyle = 'rgba(5, 5, 15, 0.1)'
         bgCtx.fillRect(0, 0, canvas.width, canvas.height)
     
         const colors = ['#e74c3c', '#3498db', '#2ecc71']
         colors.forEach((color, i) => {
           bgCtx.beginPath()
           bgCtx.strokeStyle = color
           bgCtx.lineWidth = 2
           bgCtx.globalAlpha = 0.3
     
           for (let x = 0; x < canvas.width; x++) {
             const y = canvas.height / 2 +
               Math.sin((x * 0.01) + phase + (i * 0.5)) * 50 +
               Math.sin((x * 0.02) + phase * 1.5) * 30
     
             if (x === 0) bgCtx.moveTo(x, y + (i - 1) * 100)
             else bgCtx.lineTo(x, y + (i - 1) * 100)
           }
           bgCtx.stroke()
         })
     
         bgCtx.globalAlpha = 1
         phase += 0.02
         bgAnimationFrame = requestAnimationFrame(animate)
       }
       animate()
     }
     
     // ============================================================
     // 波形绘制
     // ============================================================
     const drawWaveform = (canvas: HTMLCanvasElement, color: string) => {
       const ctx = canvas.getContext('2d')
       if (!ctx) return
     
       const resize = () => {
         canvas.width = canvas.offsetWidth * 2
         canvas.height = canvas.offsetHeight * 2
         ctx.scale(2, 2)
       }
       resize()
     
       let phase = Math.random() * Math.PI * 2
     
       const animate = () => {
         const width = canvas.offsetWidth
         const height = canvas.offsetHeight
     
         ctx.clearRect(0, 0, width, height)
     
         // 主波形
         ctx.beginPath()
         ctx.strokeStyle = color
         ctx.lineWidth = 2
         ctx.shadowBlur = 10
         ctx.shadowColor = color
     
         for (let x = 0; x < width; x++) {
           const y = height / 2 +
             Math.sin((x * 0.05) + phase) * (height * 0.3) +
             Math.sin((x * 0.1) + phase * 2) * (height * 0.15)
     
           if (x === 0) ctx.moveTo(x, y)
           else ctx.lineTo(x, y)
         }
         ctx.stroke()
     
         // 镜像波形
         ctx.globalAlpha = 0.3
         ctx.beginPath()
         for (let x = 0; x < width; x++) {
           const y = height / 2 -
             Math.sin((x * 0.05) + phase) * (height * 0.3) -
             Math.sin((x * 0.1) + phase * 2) * (height * 0.15)
     
           if (x === 0) ctx.moveTo(x, y)
           else ctx.lineTo(x, y)
         }
         ctx.stroke()
         ctx.globalAlpha = 1
     
         phase += 0.05
         waveformAnimationFrame = requestAnimationFrame(animate)
       }
       animate()
     }
     
     // ============================================================
     // 入场动画
     // ============================================================
     const initEntryAnimation = () => {
       // 卡片入场
       cardRefsMap.value.forEach((card, index) => {
         gsap.fromTo(card,
           {
             y: 100,
             opacity: 0,
             scale: 0.5,
             rotateX: -30
           },
           {
             y: 0,
             opacity: 1,
             scale: 1,
             rotateX: 0,
             duration: 1.2,
             delay: index * 0.2,
             ease: 'back.out(1.4)'
           }
         )
       })
     
       // 内容入场
       contentRefsMap.value.forEach((content, index) => {
         gsap.fromTo(content,
           { y: 40, opacity: 0 },
           {
             y: 0,
             opacity: 1,
             duration: 0.8,
             delay: 0.4 + index * 0.2,
             ease: 'power3.out'
           }
         )
       })
     
       // 图标入场
       iconRefsMap.value.forEach((icon, index) => {
         gsap.fromTo(icon,
           { scale: 0, rotate: -180 },
           {
             scale: 1,
             rotate: 0,
             duration: 0.8,
             delay: 0.5 + index * 0.2,
             ease: 'elastic.out(1, 0.5)'
           }
         )
       })
     
       // 标题入场
       titleRefsMap.value.forEach((title, index) => {
         gsap.fromTo(title,
           { x: -30, opacity: 0 },
           {
             x: 0,
             opacity: 1,
             duration: 0.6,
             delay: 0.6 + index * 0.2,
             ease: 'power2.out'
           }
         )
       })
     }
     
     // ============================================================
     // 滚动动画
     // ============================================================
     const initScrollAnimations = () => {
       // 1. 卡片上下波动
       cardRefsMap.value.forEach((card, index) => {
         const direction = index % 2 === 0 ? 1 : -1
         const trigger = ScrollTrigger.create({
           trigger: card,
           start: 'top bottom',
           end: 'bottom top',
           scrub: 1.5,
           onUpdate: (self) => {
             const p = self.progress
             const translateY = Math.sin(p * Math.PI * 2) * 40 * direction
             const rotateZ = Math.sin(p * Math.PI) * 5 * direction
             const scale = 1 + Math.sin(p * Math.PI) * 0.08
     
             gsap.to(card, {
               y: translateY,
               rotateZ: rotateZ,
               scale: scale,
               duration: 0.1
             })
           }
         })
         cleanupFns.push(() => trigger.kill())
       })
     
       // 2. 频谱条动画
       barRefsMap.value.forEach((bar, key) => {
         const [index] = key.split('-').map(Number)
         const barIndex = parseInt(key.split('-')[1])
         const color = CARDS_DATA[index].color
         const height = 10 + Math.random() * 50
     
         gsap.to(bar, {
           height: `${height}px`,
           backgroundColor: color,
           boxShadow: `0 0 10px ${color}`,
           duration: 0.2 + Math.random() * 0.3,
           ease: 'sine.inOut',
           repeat: -1,
           yoyo: true,
           delay: barIndex * 0.05
         })
       })
     
       // 3. 圆形频谱旋转
       circleRefsMap.value.forEach((circle, index) => {
         gsap.to(circle, {
           rotation: 360,
           duration: 10 + index * 2,
           ease: 'none',
           repeat: -1,
           transformOrigin: 'center center'
         })
       })
     
       // 4. 扫描线动画
       scanRefsMap.value.forEach((scan, index) => {
         const color = CARDS_DATA[index].color
         gsap.to(scan, {
           top: '0%',
           opacity: 0.8,
           duration: 2,
           ease: 'power1.in',
           repeat: -1,
           onRepeat: () => {
             gsap.set(scan, { top: '-10%', opacity: 0 })
           }
         })
       })
     
       // 5. 图标脉冲
       iconRefsMap.value.forEach((icon, index) => {
         const color = CARDS_DATA[index].color
         const trigger = ScrollTrigger.create({
           trigger: icon,
           start: 'top 80%',
           end: 'top 30%',
           scrub: 1,
           onUpdate: (self) => {
             const scale = 1 + Math.sin(self.progress * Math.PI) * 0.3
             const glow = 10 + self.progress * 25
             gsap.to(icon, {
               scale: scale,
               filter: `drop-shadow(0 0 ${glow}px ${color})`,
               duration: 0.1
             })
           }
         })
         cleanupFns.push(() => trigger.kill())
       })
     
       // 6. 音频条动画
       audioBarsRefsMap.value.forEach((container) => {
         const bars = container.querySelectorAll('.audio-bar')
         bars.forEach((bar, i) => {
           gsap.to(bar, {
             scaleY: 'random(0.3, 1.5)',
             duration: 'random(0.2, 0.5)',
             ease: 'sine.inOut',
             repeat: -1,
             yoyo: true,
             delay: i * 0.1
           })
         })
       })
     
       // 7. 卡片间距
       const container = document.querySelector('.audio-container') as HTMLElement
       if (container) {
         const trigger = ScrollTrigger.create({
           trigger: container,
           start: 'top center',
           end: 'bottom center',
           scrub: 2,
           onUpdate: (self) => {
             const spread = Math.sin(self.progress * Math.PI) * 60
             gsap.to(container, {
               gap: `${40 + spread}px`,
               duration: 0.1
             })
           }
         })
         cleanupFns.push(() => trigger.kill())
       }
     
       // 8. 背景光效
       if (spectrumGlow.value) {
         gsap.to(spectrumGlow.value, {
           opacity: 0.8,
           scale: 1.2,
           duration: 3,
           ease: 'sine.inOut',
           repeat: -1,
           yoyo: true
         })
       }
     }
     
     // ============================================================
     // 初始化波形画布
     // ============================================================
     const initWaveformCanvases = () => {
       canvasRefsMap.value.forEach((canvas, index) => {
         const color = CARDS_DATA[index].color
         drawWaveform(canvas, color)
       })
     }
     
     // ============================================================
     // 生命周期
     // ============================================================
     onMounted(() => {
       requestAnimationFrame(() => {
         initBackgroundWaves()
         initEntryAnimation()
         initScrollAnimations()
         initWaveformCanvases()
       })
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn())
       ScrollTrigger.getAll().forEach(t => t.kill())
       if (bgAnimationFrame) cancelAnimationFrame(bgAnimationFrame)
       if (waveformAnimationFrame) cancelAnimationFrame(waveformAnimationFrame)
       audioAnimations.forEach(anim => anim.kill())
     })
     </script>
     
     <style scoped lang="scss">
     // ============================================================
     // 主体
     // ============================================================
     .audio-section {
       width: 100vw;
       height: 100vh;
       padding: 60px 40px;
       background: #050510;
       display: flex;
       align-items: center;
       justify-content: center;
       position: relative;
       overflow: hidden;
     }
     
     // ============================================================
     // 背景波形
     // ============================================================
     .wave-bg {
       position: absolute;
       inset: 0;
       z-index: 0;
     }
     
     .wave-canvas {
       width: 100%;
       height: 100%;
     }
     
     // ============================================================
     // 网格覆盖层
     // ============================================================
     .grid-overlay {
       position: absolute;
       inset: 0;
       background:
         linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
         linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
       background-size: 30px 30px;
       z-index: 1;
       pointer-events: none;
     }
     
     // ============================================================
     // 频谱光效
     // ============================================================
     .spectrum-glow {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 600px;
       height: 600px;
       transform: translate(-50%, -50%);
       background: radial-gradient(circle, rgba(255, 100, 100, 0.2) 0%, transparent 70%);
       z-index: 1;
       opacity: 0.5;
       pointer-events: none;
     }
     
     // ============================================================
     // 容器
     // ============================================================
     .audio-container {
       display: flex;
       gap: 40px;
       flex-wrap: wrap;
       justify-content: center;
       align-items: center;
       z-index: 2;
     }
     
     // ============================================================
     // 卡片
     // ============================================================
     .audio-card {
       position: relative;
       width: 280px;
       height: 380px;
       background: linear-gradient(180deg, rgba(15, 15, 35, 0.98) 0%, rgba(10, 10, 25, 0.95) 100%);
       border-radius: 20px;
       overflow: hidden;
       transform-style: preserve-3d;
       perspective: 1000px;
       border: 1px solid rgba(255, 255, 255, 0.1);
     
       &::before {
         content: '';
         position: absolute;
         inset: 0;
         background: linear-gradient(180deg, var(--audio-color) 0%, transparent 30%);
         opacity: 0.1;
         z-index: 0;
       }
     }
     
     // ============================================================
     // 波形可视化
     // ============================================================
     .waveform-visual {
       position: absolute;
       top: 20px;
       left: 20px;
       right: 20px;
       height: 60px;
       z-index: 3;
     }
     
     .wave-canvas-card {
       width: 100%;
       height: 100%;
     }
     
     // ============================================================
     // 圆形频谱
     // ============================================================
     .circle-spectrum {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 200px;
       height: 200px;
       transform: translate(-50%, -50%);
       z-index: 4;
     }
     
     .spectrum-bar {
       position: absolute;
       width: 4px;
       height: 10px;
       background: var(--audio-color);
       border-radius: 2px;
       left: 50%;
       bottom: 50%;
       transform-origin: center bottom;
       transform: rotate(calc(var(--bar-index) * 11.25deg - 180deg)) translateX(-50%);
       box-shadow: 0 0 5px var(--audio-color);
     }
     
     // ============================================================
     // 圆形中心
     // ============================================================
     .circle-center {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 80px;
       height: 80px;
       background: radial-gradient(circle, rgba(20, 20, 40, 0.98) 0%, rgba(10, 10, 30, 0.95) 100%);
       border-radius: 50%;
       border: 2px solid var(--audio-color);
       display: flex;
       align-items: center;
       justify-content: center;
       z-index: 5;
       box-shadow: 0 0 20px var(--audio-color);
     }
     
     .center-icon {
       font-size: 2.5rem;
       filter: drop-shadow(0 0 10px var(--audio-color));
     }
     
     // ============================================================
     // 内容
     // ============================================================
     .audio-content {
       position: absolute;
       bottom: 0;
       left: 0;
       right: 0;
       padding: 25px;
       background: linear-gradient(to top, rgba(5, 5, 20, 0.98) 0%, transparent 100%);
       z-index: 10;
       text-align: center;
     }
     
     .audio-title {
       font-size: 1.4rem;
       font-weight: 700;
       color: #fff;
       margin: 0 0 8px 0;
       text-shadow: 0 0 10px var(--audio-color);
     }
     
     .audio-desc {
       font-size: 0.8rem;
       color: rgba(255, 255, 255, 0.6);
       margin: 0 0 15px 0;
       line-height: 1.4;
     }
     
     .audio-bars {
       display: flex;
       justify-content: center;
       gap: 4px;
       height: 30px;
       align-items: flex-end;
     }
     
     .audio-bar {
       width: 6px;
       background: var(--audio-color);
       border-radius: 3px;
       transform-origin: bottom;
       box-shadow: 0 0 8px var(--audio-color);
     }
     
     // ============================================================
     // 扫描线
     // ============================================================
     .scan-line {
       position: absolute;
       top: -10%;
       left: 0;
       right: 0;
       height: 3px;
       background: linear-gradient(90deg, transparent, var(--audio-color), transparent);
       z-index: 6;
       box-shadow: 0 0 15px var(--audio-color);
       opacity: 0;
     }
     </style>
     
     ```


3. 【产品/案例】
   描述：作品展示/产品列表
   📦 使用组件 (2个)

  1. CardImageRockCrack (card-image)
   ----------------------------------------------------------------------
   • Props 定义: 该组件无外部Props，内容在组件内部定义
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <section ref="parentRef" class="rock-crack-container">
         <!-- 深色背景 -->
         <div class="dark-bg"></div>
     
         <!-- 完整图片 -->
         <div class="base-layer">
           <img :src="imageUrl" alt="" class="base-img" />
         </div>
     
         <!-- 裂纹效果 -->
         <div ref="crackOverlayRef" class="crack-overlay">
           <svg class="crack-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path v-for="(path, i) in crackPaths" :key="i" :d="path" class="crack-path" />
           </svg>
         </div>
     
         <!-- 碎片层 -->
         <div ref="fragmentLayerRef" class="fragment-layer">
           <div
             v-for="(frag, idx) in fragments"
             :key="idx"
             :ref="(el) => setFragRef(el, idx)"
             class="fragment"
             :style="{
               '--fx': `${frag.gridX}%`,
               '--fy': `${frag.gridY}%`,
               '--sx': `${-frag.gridX * 100}%`,
               '--sy': `${-frag.gridY * 100}%`,
             }"
           >
             <img :src="imageUrl" alt="" class="frag-img" />
             <div class="frag-glow"></div>
           </div>
         </div>
     
         <!-- 冲击波 -->
         <div ref="shockRef" class="shockwave">
           <div class="shock-ring"></div>
         </div>
     
         <!-- 中心余烬 -->
         <div ref="emberRef" class="ember">
           <div class="ember-core"></div>
           <div class="ember-ring"></div>
         </div>
       </section>
     </template>
     
     <script setup lang="ts">
     import { ref, reactive, onMounted, onUnmounted } from 'vue'
     import { gsap } from 'gsap'
     import { ScrollTrigger } from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     type Cleanup = () => void
     
     const parentRef = ref<HTMLElement | null>(null)
     const fragmentLayerRef = ref<HTMLElement | null>(null)
     const crackOverlayRef = ref<HTMLElement | null>(null)
     const shockRef = ref<HTMLElement | null>(null)
     const emberRef = ref<HTMLElement | null>(null)
     
     const fragRefs: HTMLElement[] = []
     const cleanupFns: Cleanup[] = []
     
     // 配置
     const COLS = 5
     const ROWS = 4
     const CENTER_X = (COLS - 1) / 2
     const CENTER_Y = (ROWS - 1) / 2
     
     // 火山岩浆图片
     const imageUrl = 'https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1920&q=80'
     
     interface Frag {
       gridX: number
       gridY: number
       explodeX: number
       explodeY: number
       explodeZ: number
       rotX: number
       rotY: number
       rotZ: number
       delay: number
       layer: number
     }
     
     const fragments = reactive<Frag[]>([])
     const crackPaths: string[] = []
     
     let seed = 99999
     const rnd = () => {
       seed = (seed * 9301 + 49297) % 233280
       return seed / 233280
     }
     const range = (min: number, max: number) => min + rnd() * (max - min)
     
     // 生成裂纹 SVG 路径
     const generateCracks = () => {
       crackPaths.length = 0
       const cx = 50, cy = 50
       
       for (let i = 0; i < 12; i++) {
         const angle = (i / 12) * Math.PI * 2 + range(-0.3, 0.3)
         const length = range(25, 45)
         let path = `M ${cx} ${cy}`
         let x = cx, y = cy
         
         for (let j = 0; j < 4; j++) {
           const segLen = length / 4
           x += Math.cos(angle + range(-0.4, 0.4)) * segLen
           y += Math.sin(angle + range(-0.4, 0.4)) * segLen
           path += ` L ${x.toFixed(1)} ${y.toFixed(1)}`
         }
         
         crackPaths.push(path)
       }
     }
     
     const initFrags = () => {
       fragments.length = 0
       seed = 99999
       generateCracks()
     
       for (let row = 0; row < ROWS; row++) {
         for (let col = 0; col < COLS; col++) {
           const dx = col - CENTER_X + 0.5
           const dy = row - CENTER_Y + 0.5
           const dist = Math.sqrt(dx * dx + dy * dy)
           const layer = Math.ceil(dist)
           const angle = Math.atan2(dy, dx)
     
           const force = 200 + layer * 100
     
           fragments.push({
             gridX: col * (100 / COLS),
             gridY: row * (100 / ROWS),
             explodeX: Math.cos(angle) * force + range(-100, 100),
             explodeY: Math.sin(angle) * force + range(80, 150),
             explodeZ: range(-80, 100),
             rotX: range(-360, 360),
             rotY: range(-360, 360),
             rotZ: range(-720, 720),
             delay: layer * 0.1,
             layer,
           })
         }
       }
     }
     
     const setFragRef = (el: Element | null, idx: number) => {
       if (el) fragRefs[idx] = el
     }
     
     onMounted(() => {
       if (!parentRef.value) return
       initFrags()
       requestAnimationFrame(() => setupAnimations())
     })
     
     const setupAnimations = () => {
       if (!parentRef.value || !fragmentLayerRef.value) return
     
       // ========== 阶段1: 震动预兆 ==========
       const tremorTl = gsap.timeline({
         scrollTrigger: {
           trigger: parentRef.value,
           start: 'top 85%',
           end: 'top 60%',
           scrub: 1,
         },
       })
     
       // 裂纹显现
       if (crackOverlayRef.value) {
         gsap.set(crackOverlayRef.value, { opacity: 0 })
         tremorTl.to(crackOverlayRef.value, { opacity: 1, duration: 0.4 }, 0)
       }
     
       // 震动 - 每个碎片独立抖动
       const shakeFns: Cleanup[] = []
       fragRefs.forEach((frag) => {
         if (!frag) return
         const shake = () => {
           gsap.to(frag, {
             x: range(-4, 4),
             y: range(-3, 3),
             duration: 0.06,
             ease: 'none',
             onComplete: shake,
           })
         }
         shake()
         shakeFns.push(() => gsap.killTweensOf(frag))
       })
     
       // 2.5秒后停止震动
       const stopShake = () => shakeFns.forEach(fn => fn())
       setTimeout(stopShake, 2500)
       cleanupFns.push(stopShake)
     
       cleanupFns.push(() => tremorTl.kill())
       cleanupFns.push(() => tremorTl.scrollTrigger?.kill())
     
       // ========== 阶段2: 岩层炸裂 ==========
       const burstTl = gsap.timeline({
         scrollTrigger: {
           trigger: parentRef.value,
           start: 'top 55%',
           end: 'top 10%',
           scrub: 1.5,
         },
       })
     
       // 冲击波
       if (shockRef.value) {
         gsap.set(shockRef.value, { scale: 0, opacity: 0 })
         burstTl.fromTo(shockRef.value,
           { scale: 0, opacity: 1 },
           { scale: 6, opacity: 0, duration: 0.8, ease: 'power2.out' },
           0
         )
       }
     
       // 碎片炸裂 - 从中心向外
       fragRefs.forEach((frag, idx) => {
         if (!frag) return
         const data = fragments[idx]
         if (!data) return
     
         // 初始状态
         gsap.set(frag, { x: 0, y: 0, z: 0, opacity: 1, scale: 1, rotationX: 0, rotationY: 0, rotationZ: 0 })
     
         // 炸裂
         burstTl.to(frag, {
           x: data.explodeX,
           y: data.explodeY,
           z: data.explodeZ,
           rotationX: data.rotX,
           rotationY: data.rotY,
           rotationZ: data.rotZ,
           scale: 0.6,
           opacity: 0,
           duration: 1.8,
           ease: 'power4.in',
         }, data.delay)
     
         // 炽热光效
         const glow = frag.querySelector('.frag-glow') as HTMLElement
         if (glow) {
           gsap.set(glow, { opacity: 0 })
           burstTl.fromTo(glow,
             { opacity: 0 },
             { opacity: 1, duration: 0.15 },
             data.delay
           )
           burstTl.to(glow,
             { opacity: 0, duration: 0.8 },
             data.delay + 0.2
           )
         }
       })
     
       cleanupFns.push(() => burstTl.kill())
       cleanupFns.push(() => burstTl.scrollTrigger?.kill())
     
       // ========== 阶段3: 余烬 ==========
       if (emberRef.value) {
         gsap.set(emberRef.value, { scale: 0, opacity: 0 })
     
         const emberTl = gsap.timeline({
           scrollTrigger: {
             trigger: parentRef.value,
             start: 'top 15%',
             end: 'bottom top',
             scrub: 1.5,
           },
         })
     
         emberTl.to(emberRef.value, { scale: 1, opacity: 1, duration: 0.5 }, 0)
     
         // 脉冲
         const pulseAnim = gsap.to(emberRef.value, {
           scale: 1.3,
           opacity: 0.8,
           duration: 1.5,
           repeat: -1,
           yoyo: true,
           ease: 'sine.inOut',
         })
         cleanupFns.push(() => pulseAnim.kill())
     
         // 旋转环
         const ring = emberRef.value.querySelector('.ember-ring') as HTMLElement
         if (ring) {
           const ringAnim = gsap.to(ring, {
             rotation: 360,
             duration: 6,
             repeat: -1,
             ease: 'none',
           })
           cleanupFns.push(() => ringAnim.kill())
         }
       }
     }
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn())
       ScrollTrigger.getAll().forEach(st => st.kill())
       gsap.killTweensOf('*')
     })
     </script>
     
     <style scoped lang="scss">
     .rock-crack-container {
       position: relative;
       width: 100vw;
       height: 100vh;
       overflow: hidden;
       background: #080404;
     }
     
     // 深色背景
     .dark-bg {
       position: absolute;
       inset: 0;
       background: 
         radial-gradient(ellipse at 50% 50%, #1a0f0a 0%, #0d0605 40%, #050202 100%);
     }
     
     // 完整图片
     .base-layer {
       position: absolute;
       inset: 0;
       z-index: 1;
     
       .base-img {
         width: 100%;
         height: 100%;
         object-fit: cover;
         filter: brightness(0.95) contrast(1.1);
       }
     }
     
     // 裂纹叠加
     .crack-overlay {
       position: absolute;
       inset: 0;
       z-index: 5;
       pointer-events: none;
       opacity: 0;
       mix-blend-mode: overlay;
     
       .crack-svg {
         width: 100%;
         height: 100%;
       }
     
       .crack-path {
         fill: none;
         stroke: rgba(255, 120, 50, 0.6);
         stroke-width: 0.3;
         filter: blur(0.3px);
       }
     }
     
     // 碎片层
     .fragment-layer {
       position: absolute;
       inset: 0;
       z-index: 10;
       perspective: 2500px;
       transform-style: preserve-3d;
     }
     
     // 单个碎片
     .fragment {
       position: absolute;
       width: calc(100% / 5);
       height: calc(100% / 4);
       left: var(--fx);
       top: var(--fy);
       transform-style: preserve-3d;
       will-change: transform, opacity;
     
       .frag-img {
         position: absolute;
         width: calc(100% * 5);
         height: calc(100% * 4);
         left: var(--sx);
         top: var(--sy);
         object-fit: cover;
         filter: brightness(1.15) contrast(1.2) saturate(1.3);
       }
     
       .frag-glow {
         position: absolute;
         inset: -6px;
         background: linear-gradient(
           135deg,
           rgba(255, 180, 80, 0.8) 0%,
           rgba(255, 100, 30, 0.6) 50%,
           rgba(200, 60, 10, 0.4) 100%
         );
         box-shadow: 
           0 0 25px rgba(255, 140, 60, 0.9),
           0 0 50px rgba(255, 100, 30, 0.6);
         mix-blend-mode: screen;
       }
     }
     
     // 冲击波
     .shockwave {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 400px;
       height: 400px;
       transform: translate(-50%, -50%);
       z-index: 15;
       pointer-events: none;
     
       .shock-ring {
         position: absolute;
         inset: 0;
         border-radius: 50%;
         border: 8px solid rgba(255, 160, 80, 0.95);
         box-shadow: 
           0 0 60px rgba(255, 130, 50, 0.8),
           0 0 120px rgba(255, 100, 30, 0.5),
           inset 0 0 60px rgba(255, 120, 60, 0.4);
       }
     }
     
     // 余烬
     .ember {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 150px;
       height: 150px;
       transform: translate(-50%, -50%);
       z-index: 20;
       pointer-events: none;
     
       .ember-core {
         position: absolute;
         inset: 20%;
         background: radial-gradient(
           circle,
           rgba(255, 230, 180, 1) 0%,
           rgba(255, 170, 80, 0.9) 35%,
           rgba(255, 100, 30, 0.6) 65%,
           transparent 85%
         );
         border-radius: 50%;
         filter: blur(10px);
         box-shadow: 
           0 0 80px rgba(255, 150, 60, 0.9),
           0 0 160px rgba(255, 120, 40, 0.6);
       }
     
       .ember-ring {
         position: absolute;
         inset: 0;
         border-radius: 50%;
         border: 4px solid rgba(255, 180, 100, 0.5);
         background: radial-gradient(
           circle,
           transparent 25%,
           rgba(255, 140, 60, 0.3) 50%,
           transparent 75%
         );
       }
     }
     </style>
     
     ```

  2. CardTimeBeat (card-time)
   ----------------------------------------------------------------------
   • Props 定义: 该组件无外部Props，内容在组件内部定义
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <div ref="containerRef" class="card-time-beat">
         <!-- 中心光晕 -->
         <div ref="centerGlowRef" class="center-glow"></div>
     
         <!-- 脉冲波纹 -->
         <div ref="pulseRing1Ref" class="pulse-ring"></div>
         <div ref="pulseRing2Ref" class="pulse-ring"></div>
     
         <!-- 粒子容器 -->
         <div ref="particlesRef" class="beat-particles"></div>
     
         <!-- 标题 -->
         <div ref="headerRef" class="beat-header">
           <h2 class="beat-title">Pulse Grid</h2>
           <p class="beat-subtitle">Neon Beat · 脉冲扩散</p>
         </div>
     
         <!-- 3x3 网格 -->
         <div ref="gridRef" class="beat-grid">
           <div
             v-for="(card, index) in cards"
             :key="index"
             :ref="el => setCardRef(el, index)"
             class="beat-card"
             :class="{ core: index === 4 }"
           >
             <span class="card-icon">{{ card.icon }}</span>
             <span class="card-label">{{ card.label }}</span>
           </div>
         </div>
     
         <!-- 控制按钮 -->
         <div ref="controlsRef" class="beat-controls">
           <button ref="replayBtnRef" class="beat-btn" @click="replayAnimation">
             重播脉冲
           </button>
           <button ref="loopBtnRef" class="beat-btn" @click="toggleLoop">
             {{ isLooping ? '停止循环' : '开启循环' }}
           </button>
         </div>
       </div>
     </template>
     
     <script setup lang="ts">
     import { ref, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import { ScrollTrigger } from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     interface TweenCleanup {
       kill: () => void
     }
     
     const containerRef = ref<HTMLElement | null>(null)
     const headerRef = ref<HTMLElement | null>(null)
     const gridRef = ref<HTMLElement | null>(null)
     const controlsRef = ref<HTMLElement | null>(null)
     const centerGlowRef = ref<HTMLElement | null>(null)
     const pulseRing1Ref = ref<HTMLElement | null>(null)
     const pulseRing2Ref = ref<HTMLElement | null>(null)
     const particlesRef = ref<HTMLElement | null>(null)
     const replayBtnRef = ref<HTMLElement | null>(null)
     const loopBtnRef = ref<HTMLElement | null>(null)
     
     const cardRefs: HTMLElement[] = []
     const setCardRef = (el: any, index: number) => {
       if (el) cardRefs[index] = el as HTMLElement
     }
     
     const isLooping = ref(false)
     let masterTL: gsap.core.Timeline | null = null
     let loopTL: gsap.core.Timeline | null = null
     const cleanupFns: TweenCleanup[] = []
     
     const cards = [
       { icon: '🎵', label: '节奏' },
       { icon: '🎹', label: '旋律' },
       { icon: '🎸', label: '和声' },
       { icon: '🥁', label: '鼓点' },
       { icon: '💫', label: '核心' },
       { icon: '🎤', label: '人声' },
       { icon: '🎷', label: '爵士' },
       { icon: '🎻', label: '古典' },
       { icon: '🎧', label: '电子' },
     ]
     
     const initParticles = () => {
       if (!particlesRef.value) return
       for (let i = 0; i < 30; i++) {
         const particle = document.createElement('div')
         particle.className = 'beat-particle'
         particle.style.left = `${Math.random() * 100}%`
         particle.style.top = `${Math.random() * 100}%`
         particle.style.background = Math.random() > 0.5 ? '#ff4da6' : '#6c63ff'
         particle.style.width = `${Math.random() * 4 + 2}px`
         particle.style.height = particle.style.width
         particlesRef.value.appendChild(particle)
         cleanupFns.push(
           gsap.to(particle, {
             opacity: Math.random() * 0.5 + 0.1,
             duration: Math.random() * 2 + 1,
             repeat: -1,
             yoyo: true,
             ease: 'sine.inOut',
           }) as unknown as TweenCleanup
         )
       }
     }
     
     const createPulseAnimation = () => {
       if (!gridRef.value) return
     
       // 设置初始状态
       gsap.set(cardRefs, {
         scale: 0.85,
         opacity: 0,
         borderColor: '#2d2d4a',
         boxShadow: '0 0 0px transparent',
       })
     
       if (headerRef.value) {
         gsap.set(headerRef.value, { y: 50, opacity: 0 })
       }
       if (controlsRef.value) {
         gsap.set(controlsRef.value, { y: 30, opacity: 0 })
       }
     
       // 中心光晕
       if (centerGlowRef.value) {
         gsap.set(centerGlowRef.value, { scale: 0, opacity: 0 })
       }
     
       // 脉冲波纹
       if (pulseRing1Ref.value) {
         gsap.set(pulseRing1Ref.value, { scale: 0, opacity: 0 })
       }
       if (pulseRing2Ref.value) {
         gsap.set(pulseRing2Ref.value, { scale: 0, opacity: 0 })
       }
     
       // 使用 ScrollTrigger 触发动画
       const scrollTrigger = ScrollTrigger.create({
         trigger: containerRef.value,
         start: 'top 70%',
         onEnter: () => {
           // 标题入场
           gsap.to(headerRef.value, {
             y: 0,
             opacity: 1,
             duration: 0.6,
             ease: 'power2.out',
           })
     
           // 中心光晕爆发
           if (centerGlowRef.value) {
             gsap.to(centerGlowRef.value, {
               scale: 2,
               opacity: 0.8,
               duration: 0.4,
               ease: 'power2.out',
             })
           }
     
           // 脉冲波纹
           if (pulseRing1Ref.value) {
             gsap.to(pulseRing1Ref.value, {
               scale: 4,
               opacity: 0,
               duration: 1,
               ease: 'power2.out',
               delay: 0.1,
             })
           }
           if (pulseRing2Ref.value) {
             gsap.to(pulseRing2Ref.value, {
               scale: 3,
               opacity: 0,
               duration: 0.8,
               ease: 'power2.out',
               delay: 0.3,
             })
           }
     
           // 脉冲动画 - 根据曼哈顿距离依次触发
           const pulseColors = ['#ff4da6', '#6c63ff', '#00d4ff', '#ff9f43', '#ee5a24']
           
           cardRefs.forEach((card, i) => {
             const row = Math.floor(i / 3)
             const col = i % 3
             const centerRow = 1
             const centerCol = 1
             const dist = Math.abs(row - centerRow) + Math.abs(col - centerCol)
             const delay = 0.2 + dist * 0.12
     
             const pulseColor = pulseColors[dist % pulseColors.length]
     
             // 卡片入场
             gsap.to(card, {
               scale: 0.95,
               opacity: 0.7,
               duration: 0.4,
               delay,
               ease: 'back.out(1.7)',
             })
     
             // 脉冲发光
             gsap.to(card, {
               scale: 1.15,
               borderColor: pulseColor,
               boxShadow: `0 0 35px ${pulseColor}`,
               duration: 0.25,
               delay: delay + 0.4,
               ease: 'power2.out',
             })
     
             // 回归
             gsap.to(card, {
               scale: 0.95,
               borderColor: '#6c63ff',
               boxShadow: '0 0 12px rgba(108, 99, 255, 0.5)',
               duration: 0.3,
               delay: delay + 0.65,
               ease: 'power2.out',
             })
     
             // 最终状态
             gsap.to(card, {
               scale: 0.92,
               borderColor: '#2d2d4a',
               boxShadow: '0 0 0px transparent',
               duration: 0.2,
               delay: delay + 0.95,
               ease: 'power2.in',
             })
           })
     
           // 控制按钮入场
           gsap.to(controlsRef.value, {
             y: 0,
             opacity: 1,
             duration: 0.5,
             delay: 1.5,
             ease: 'power2.out',
           })
     
           // 中心光晕消散
           if (centerGlowRef.value) {
             gsap.to(centerGlowRef.value, {
               scale: 0.5,
               opacity: 0.3,
               duration: 0.5,
               delay: 1.5,
             })
           }
         },
       })
     
       cleanupFns.push({
         kill: () => scrollTrigger.kill(),
       })
     }
     
     const replayAnimation = () => {
       // 重置状态
       gsap.set(cardRefs, {
         scale: 0.85,
         opacity: 0,
         borderColor: '#2d2d4a',
         boxShadow: '0 0 0px transparent',
       })
     
       if (centerGlowRef.value) {
         gsap.set(centerGlowRef.value, { scale: 0, opacity: 0 })
       }
     
       // 重新触发动画
       setTimeout(() => {
         // 中心光晕爆发
         if (centerGlowRef.value) {
           gsap.to(centerGlowRef.value, {
             scale: 2,
             opacity: 0.8,
             duration: 0.4,
             ease: 'power2.out',
           })
         }
     
         // 脉冲波纹
         if (pulseRing1Ref.value) {
           gsap.set(pulseRing1Ref.value, { scale: 0, opacity: 0 })
           gsap.to(pulseRing1Ref.value, {
             scale: 4,
             opacity: 0,
             duration: 1,
             ease: 'power2.out',
             delay: 0.1,
           })
         }
         if (pulseRing2Ref.value) {
           gsap.set(pulseRing2Ref.value, { scale: 0, opacity: 0 })
           gsap.to(pulseRing2Ref.value, {
             scale: 3,
             opacity: 0,
             duration: 0.8,
             ease: 'power2.out',
             delay: 0.3,
           })
         }
     
         // 脉冲动画
         const pulseColors = ['#ff4da6', '#6c63ff', '#00d4ff', '#ff9f43', '#ee5a24']
         
         cardRefs.forEach((card, i) => {
           const row = Math.floor(i / 3)
           const col = i % 3
           const dist = Math.abs(row - 1) + Math.abs(col - 1)
           const delay = 0.2 + dist * 0.12
     
           const pulseColor = pulseColors[dist % pulseColors.length]
     
           gsap.to(card, {
             scale: 0.95,
             opacity: 0.7,
             duration: 0.4,
             delay,
             ease: 'back.out(1.7)',
           })
     
           gsap.to(card, {
             scale: 1.15,
             borderColor: pulseColor,
             boxShadow: `0 0 35px ${pulseColor}`,
             duration: 0.25,
             delay: delay + 0.4,
             ease: 'power2.out',
           })
     
           gsap.to(card, {
             scale: 0.95,
             borderColor: '#6c63ff',
             boxShadow: '0 0 12px rgba(108, 99, 255, 0.5)',
             duration: 0.3,
             delay: delay + 0.65,
             ease: 'power2.out',
           })
     
           gsap.to(card, {
             scale: 0.92,
             borderColor: '#2d2d4a',
             boxShadow: '0 0 0px transparent',
             duration: 0.2,
             delay: delay + 0.95,
             ease: 'power2.in',
           })
         })
     
         if (centerGlowRef.value) {
           gsap.to(centerGlowRef.value, {
             scale: 0.5,
             opacity: 0.3,
             duration: 0.5,
             delay: 1.5,
           })
         }
       }, 50)
     }
     
     const toggleLoop = () => {
       isLooping.value = !isLooping.value
     
       if (isLooping.value) {
         loopTL = gsap.timeline({ repeat: -1 })
         cleanupFns.push({
           kill: () => loopTL?.kill(),
         })
     
         // 持续循环脉冲
         cardRefs.forEach((card, i) => {
           const row = Math.floor(i / 3)
           const col = i % 3
           const dist = Math.abs(row - 1) + Math.abs(col - 1)
           const delay = dist * 0.15
     
           loopTL!.to(card, {
             scale: 1.1,
             borderColor: '#ff4da6',
             boxShadow: '0 0 25px rgba(255, 77, 166, 0.7)',
             duration: 0.3,
             ease: 'power2.out',
           }, delay)
     
           loopTL!.to(card, {
             scale: 0.95,
             borderColor: '#6c63ff',
             boxShadow: '0 0 10px rgba(108, 99, 255, 0.5)',
             duration: 0.4,
             ease: 'power2.inOut',
           }, `+=0.1`)
         })
       } else {
         loopTL?.kill()
         loopTL = null
     
         // 回归初始
         gsap.to(cardRefs, {
           scale: 0.95,
           opacity: 0.85,
           borderColor: '#2d2d4a',
           boxShadow: '0 0 0px transparent',
           duration: 0.4,
         })
       }
     }
     
     onMounted(() => {
       initParticles()
       createPulseAnimation()
     
       // 按钮入场
       gsap.from(controlsRef.value, {
         y: 20,
         opacity: 0,
         duration: 0.5,
         delay: 1.5,
       })
     
       // 按钮 hover 效果
       if (replayBtnRef.value) {
         replayBtnRef.value.addEventListener('mouseenter', () => {
           gsap.to(replayBtnRef.value, {
             scale: 1.05,
             duration: 0.2,
           })
         })
         replayBtnRef.value.addEventListener('mouseleave', () => {
           gsap.to(replayBtnRef.value, {
             scale: 1,
             duration: 0.2,
           })
         })
       }
     
       if (loopBtnRef.value) {
         loopBtnRef.value.addEventListener('mouseenter', () => {
           gsap.to(loopBtnRef.value, {
             scale: 1.05,
             duration: 0.2,
           })
         })
         loopBtnRef.value.addEventListener('mouseleave', () => {
           gsap.to(loopBtnRef.value, {
             scale: 1,
             duration: 0.2,
           })
         })
       }
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn.kill())
       ScrollTrigger.getAll().forEach(st => st.kill())
     })
     </script>
     
     <style lang="scss" scoped>
     .card-time-beat {
       position: relative;
       width: 100vw;
       height: 100vh;
       background: #0d0d1a;
       overflow: hidden;
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
     
       &::before {
         content: '';
         position: absolute;
         inset: 0;
         background: 
           radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.1) 0%, transparent 50%),
           repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(108, 99, 255, 0.03) 50px, rgba(108, 99, 255, 0.03) 51px),
           repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(108, 99, 255, 0.03) 50px, rgba(108, 99, 255, 0.03) 51px);
         pointer-events: none;
       }
     
       .beat-header {
         text-align: center;
         margin-bottom: 50px;
         z-index: 2;
     
         .beat-title {
           font-size: 42px;
           font-weight: 900;
           color: #fff;
           letter-spacing: 8px;
           text-transform: uppercase;
           background: linear-gradient(135deg, #6c63ff, #ff4da6);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
           margin-bottom: 12px;
         }
     
         .beat-subtitle {
           font-size: 14px;
           color: rgba(255, 255, 255, 0.5);
           letter-spacing: 4px;
           text-transform: uppercase;
         }
       }
     
       .beat-grid {
         display: grid;
         grid-template-columns: repeat(3, 140px);
         gap: 20px;
         z-index: 2;
       }
     
       .beat-card {
         height: 140px;
         background: #1a1a2e;
         border: 2px solid #2d2d4a;
         border-radius: 14px;
         display: flex;
         flex-direction: column;
         align-items: center;
         justify-content: center;
         cursor: pointer;
         will-change: transform, opacity, border-color, box-shadow;
         transition: border-color 0.3s;
     
         &.core {
           background: rgba(108, 99, 255, 0.15);
           border-color: #6c63ff;
         }
     
         .card-icon {
           font-size: 28px;
           margin-bottom: 6px;
         }
     
         .card-label {
           font-size: 11px;
           color: rgba(255, 255, 255, 0.4);
           letter-spacing: 2px;
           text-transform: uppercase;
         }
       }
     
       .beat-controls {
         margin-top: 50px;
         display: flex;
         gap: 20px;
         z-index: 2;
     
         .beat-btn {
           padding: 12px 28px;
           background: transparent;
           border: 1px solid rgba(108, 99, 255, 0.4);
           border-radius: 30px;
           color: #6c63ff;
           font-size: 13px;
           letter-spacing: 2px;
           cursor: pointer;
           transition: all 0.3s;
     
           &:hover {
             background: rgba(108, 99, 255, 0.15);
             border-color: #6c63ff;
             box-shadow: 0 0 20px rgba(108, 99, 255, 0.3);
           }
         }
       }
     
       .pulse-ring {
         position: absolute;
         width: 200px;
         height: 200px;
         border: 2px solid #ff4da6;
         border-radius: 50%;
         opacity: 0;
         pointer-events: none;
         z-index: 1;
       }
     
       .center-glow {
         position: absolute;
         width: 300px;
         height: 300px;
         background: radial-gradient(circle, rgba(255, 77, 166, 0.2) 0%, transparent 70%);
         border-radius: 50%;
         pointer-events: none;
         z-index: 1;
       }
     
       .beat-particle {
         position: absolute;
         width: 4px;
         height: 4px;
         background: #ff4da6;
         border-radius: 50%;
         opacity: 0.3;
         pointer-events: none;
       }
     }
     </style>
     
     ```


4. 【关于我们】
   描述：团队/品牌故事
   📦 使用组件 (2个)

  1. CardImgWireless (card-img)
   ----------------------------------------------------------------------
   • Props 定义: 该组件无外部Props，内容在组件内部定义
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <div ref="containerRef" class="wireless-container">
         <!-- 深空背景 -->
         <div ref="bgRef" class="wireless-bg">
           <!-- 背景粒子 -->
           <div v-for="i in 60" :key="i" class="bg-particle" :style="getParticleStyle(i)" />
           <!-- 星云光晕 -->
           <div class="nebula-halo" />
         </div>
     
         <!-- 无线充电底座层 -->
         <div ref="chargerBaseRef" class="charger-base">
           <!-- 底座主体 -->
           <div ref="baseRef" class="base-body">
             <div class="base-ring" />
             <div class="base-center" />
             <div class="base-glow" />
           </div>
     
           <!-- 旋转能量环 -->
           <div ref="energyRingRef" class="energy-rings">
             <div class="ring ring-1" />
             <div class="ring ring-2" />
             <div class="ring ring-3" />
           </div>
     
           <!-- 底座光晕 -->
           <div class="base-aura" />
         </div>
     
         <!-- 电磁感应光弧层 -->
         <div ref="arcLayerRef" class="arc-layer">
           <!-- SVG 电弧 -->
           <svg ref="arcSvgRef" class="arc-svg" viewBox="0 0 200 300" preserveAspectRatio="xMidYMid meet">
             <defs>
               <linearGradient id="arcGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                 <stop offset="0%" stop-color="#00f5ff" stop-opacity="0.9" />
                 <stop offset="50%" stop-color="#00f5ff" stop-opacity="0.5" />
                 <stop offset="100%" stop-color="#a855f7" stop-opacity="0.9" />
               </linearGradient>
               <filter id="arcGlow">
                 <feGaussianBlur stdDeviation="3" result="blur" />
                 <feMerge>
                   <feMergeNode in="blur" />
                   <feMergeNode in="SourceGraphic" />
                 </feMerge>
               </filter>
             </defs>
             <path
               ref="arcPathRef"
               class="arc-path"
               d="M100,20 Q60,100 100,150 Q140,200 100,280"
               fill="none"
               stroke="url(#arcGradient)"
               stroke-width="2"
               filter="url(#arcGlow)"
             />
             <!-- 电弧闪烁点 -->
             <circle ref="arcSparkRef" class="arc-spark" r="3" fill="#00f5ff" />
           </svg>
         </div>
     
         <!-- 产品主体层 -->
         <div ref="productLayerRef" class="product-layer">
           <div ref="productRef" class="product-body">
             <img
               ref="productImgRef"
               class="product-image"
               src="https://images.unsplash.com/photo-1606220838315-056192d5e927?w=800&q=80"
               alt="Wireless Device"
             />
             <div class="product-reflection" />
             <div class="product-edge-glow" />
           </div>
     
           <!-- 产品悬浮光晕 -->
           <div class="product-aura">
             <div class="aura-ring aura-ring-1" />
             <div class="aura-ring aura-ring-2" />
           </div>
         </div>
     
         <!-- 能量脉冲层 -->
         <div ref="pulseLayerRef" class="pulse-layer">
           <div v-for="i in 5" :key="i" class="pulse-ring" :class="`pulse-ring-${i}`" />
         </div>
     
         <!-- 信息面板 -->
         <div ref="infoPanelRef" class="info-panel">
           <div class="panel-tag">MAGNETIC INDUCTION</div>
           <h2 class="panel-title">Wireless Charge</h2>
           <p class="panel-subtitle">Magnetic Suspension Technology</p>
           <div class="status-bar">
             <div class="status-item">
               <span class="status-label">Power</span>
               <span ref="powerValueRef" class="status-value">0%</span>
             </div>
             <div class="status-item">
               <span class="status-label">Efficiency</span>
               <span ref="efficiencyRef" class="status-value">0%</span>
             </div>
           </div>
         </div>
     
         <!-- 磁吸指示器 -->
         <div ref="magnetIndicatorRef" class="magnet-indicator">
           <div class="magnet-icon">
             <svg viewBox="0 0 24 24" fill="none">
               <path d="M4 8V6a2 2 0 012-2h2v10H6a2 2 0 01-2-2V8z" fill="#ef4444"/>
               <path d="M20 8V6a2 2 0 00-2-2h-2v10h2a2 2 0 002-2V8z" fill="#3b82f6"/>
             </svg>
           </div>
           <span ref="magnetTextRef" class="magnet-text">Magnetic Field Active</span>
         </div>
     
         <!-- 阶段指示 -->
         <div ref="stageIndicatorRef" class="stage-indicator">
           <span ref="stageTextRef" class="stage-text">INITIALIZING</span>
           <div ref="progressBarRef" class="progress-bar">
             <div class="progress-fill" />
           </div>
         </div>
       </div>
     </template>
     
     <script setup lang="ts">
     import { ref, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import { ScrollTrigger } from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     type TweenCleanup = () => void
     const cleanupFns: TweenCleanup[] = []
     
     const containerRef = ref<HTMLElement | null>(null)
     const bgRef = ref<HTMLElement | null>(null)
     const chargerBaseRef = ref<HTMLElement | null>(null)
     const baseRef = ref<HTMLElement | null>(null)
     const energyRingRef = ref<HTMLElement | null>(null)
     const arcLayerRef = ref<HTMLElement | null>(null)
     const arcSvgRef = ref<HTMLElement | null>(null)
     const arcPathRef = ref<SVGPathElement | null>(null)
     const arcSparkRef = ref<SVGCircleElement | null>(null)
     const productLayerRef = ref<HTMLElement | null>(null)
     const productRef = ref<HTMLElement | null>(null)
     const productImgRef = ref<HTMLElement | null>(null)
     const pulseLayerRef = ref<HTMLElement | null>(null)
     const infoPanelRef = ref<HTMLElement | null>(null)
     const powerValueRef = ref<HTMLElement | null>(null)
     const efficiencyRef = ref<HTMLElement | null>(null)
     const magnetIndicatorRef = ref<HTMLElement | null>(null)
     const magnetTextRef = ref<HTMLElement | null>(null)
     const stageIndicatorRef = ref<HTMLElement | null>(null)
     const stageTextRef = ref<HTMLElement | null>(null)
     const progressBarRef = ref<HTMLElement | null>(null)
     
     let mouseX = 0
     let mouseY = 0
     let productXTo: gsap.core.Tween | null = null
     let productYTo: gsap.core.Tween | null = null
     let isPulseActive = false
     
     function getParticleStyle(index: number) {
       const size = Math.random() * 2 + 1
       const x = Math.random() * 100
       const y = Math.random() * 100
       const delay = Math.random() * 5
       const duration = Math.random() * 3 + 2
       return {
         width: `${size}px`,
         height: `${size}px`,
         left: `${x}%`,
         top: `${y}%`,
         animationDelay: `${delay}s`,
         animationDuration: `${duration}s`
       }
     }
     
     function initAnimations() {
       if (!containerRef.value) return
     
       const tl = gsap.timeline({
         scrollTrigger: {
           trigger: containerRef.value,
           start: 'top 100%',
           end: 'bottom -100%',
           scrub: 1.5
         }
       })
     
       cleanupFns.push(() => tl.kill())
     
       // 入场动画阶段 (0-25%)
       // 底座入场
       tl.fromTo(
         chargerBaseRef.value,
         { opacity: 0, scale: 0.3, y: 100 },
         { opacity: 1, scale: 1, y: 0, duration: 0.25 },
         0
       )
     
       // 能量环入场
       tl.fromTo(
         energyRingRef.value,
         { opacity: 0, scale: 0.5 },
         { opacity: 1, scale: 1, duration: 0.25 },
         0.05
       )
     
       // 光弧入场
       tl.fromTo(
         arcLayerRef.value,
         { opacity: 0 },
         { opacity: 1, duration: 0.2 },
         0.1
       )
     
       // 产品入场
       tl.fromTo(
         productLayerRef.value,
         { opacity: 0, y: -200, scale: 0.8 },
         { opacity: 1, y: 0, scale: 1, duration: 0.25 },
         0.15
       )
     
       // 产品悬浮呼吸 (独立循环)
       const floatTl = gsap.timeline({ repeat: -1, yoyo: true })
       floatTl.to(productRef.value, {
         y: -15,
         rotateY: 5,
         duration: 2.5,
         ease: 'sine.inOut'
       })
     
       cleanupFns.push(() => floatTl.kill())
     
       // 信息面板入场
       tl.fromTo(
         infoPanelRef.value,
         { opacity: 0, x: 100 },
         { opacity: 1, x: 0, duration: 0.2 },
         0.2
       )
     
       // 磁吸指示器入场
       tl.fromTo(
         magnetIndicatorRef.value,
         { opacity: 0 },
         { opacity: 1, duration: 0.15 },
         0.22
       )
     
       // 阶段指示入场
       tl.fromTo(
         stageIndicatorRef.value,
         { opacity: 0, y: 50 },
         { opacity: 1, y: 0, duration: 0.15 },
         0.25
       )
     
       // 展示阶段 (25-75%) - 视差滚动
       // 底座视差移动
       tl.to(
         chargerBaseRef.value,
         { y: -80, duration: 0.5 },
         0.25
       )
     
       // 产品视差移动 (更快)
       tl.to(
         productLayerRef.value,
         { y: -160, duration: 0.5 },
         0.25
       )
     
       // 光弧视差 (介于两者之间)
       tl.to(
         arcLayerRef.value,
         { y: -120, duration: 0.5 },
         0.25
       )
     
       // 离场阶段 (75-100%)
       // 产品下落
       tl.to(
         productLayerRef.value,
         { y: 150, opacity: 0, duration: 0.25 },
         0.75
       )
     
       // 光弧断开
       tl.to(
         arcLayerRef.value,
         { opacity: 0, scaleY: 0.3, duration: 0.2 },
         0.78
       )
     
       // 底座消失
       tl.to(
         chargerBaseRef.value,
         { y: 100, opacity: 0, scale: 0.5, duration: 0.2 },
         0.82
       )
     
       // 信息面板离场
       tl.to(
         infoPanelRef.value,
         { opacity: 0, x: -100, duration: 0.15 },
         0.8
       )
     }
     
     function initMouseInteraction() {
       if (!containerRef.value || !productRef.value) return
     
       // 鼠标移动监听
       const handleMouseMove = (e: MouseEvent) => {
         const rect = containerRef.value!.getBoundingClientRect()
         const centerX = rect.width / 2
         const centerY = rect.height / 2
         mouseX = (e.clientX - rect.left - centerX) / centerX
         mouseY = (e.clientY - rect.top - centerY) / centerY
       }
     
       containerRef.value.addEventListener('mousemove', handleMouseMove)
       cleanupFns.push(() => {
         containerRef.value?.removeEventListener('mousemove', handleMouseMove)
       })
     
       // 磁吸牵引效果
       if (productXTo) productXTo.kill()
       if (productYTo) productYTo.kill()
     
       productXTo = gsap.quickTo(productRef.value, 'x', { duration: 0.8, ease: 'power3.out' })
       productYTo = gsap.quickTo(productRef.value, 'y', { duration: 0.8, ease: 'power3.out' })
     
       const updatePosition = () => {
         if (productXTo && productYTo) {
           productXTo(mouseX * 30)
           productYTo(mouseY * 20)
         }
         requestAnimationFrame(updatePosition)
       }
       updatePosition()
       cleanupFns.push(() => {
         if (productXTo) productXTo.kill()
         if (productYTo) productYTo.kill()
       })
     }
     
     function initEnergyRings() {
       if (!energyRingRef.value) return
     
       // 旋转动画
       gsap.to(energyRingRef.value, {
         rotation: 360,
         duration: 8,
         repeat: -1,
         ease: 'none'
       })
     
       cleanupFns.push(() => {
         gsap.killTweensOf(energyRingRef.value)
       })
     }
     
     function initArcAnimation() {
       if (!arcPathRef.value || !arcSparkRef.value) return
     
       const pathLength = arcPathRef.value.getTotalLength()
     
       // 电弧路径动画
       gsap.set(arcPathRef.value, {
         strokeDasharray: pathLength,
         strokeDashoffset: pathLength
       })
     
       gsap.to(arcPathRef.value, {
         strokeDashoffset: 0,
         duration: 2,
         ease: 'power2.inOut',
         repeat: -1,
         yoyo: true
       })
     
       cleanupFns.push(() => {
         gsap.killTweensOf(arcPathRef.value)
       })
     
       // 电弧闪烁点动画 - 使用透明度闪烁替代 motionPath
       const sparkTl = gsap.timeline({ repeat: -1 })
       sparkTl.to(arcSparkRef.value, {
         opacity: 0.2,
         scale: 0.5,
         duration: 0.3,
         ease: 'power2.in'
       })
       sparkTl.to(arcSparkRef.value, {
         opacity: 1,
         scale: 1.5,
         duration: 0.3,
         ease: 'power2.out'
       })
       sparkTl.to(arcSparkRef.value, {
         opacity: 0.5,
         scale: 1,
         duration: 0.3,
         ease: 'power2.inOut'
       })
     
       cleanupFns.push(() => sparkTl.kill())
     }
     
     function triggerPulse() {
       if (isPulseActive || !pulseLayerRef.value || !productRef.value) return
       isPulseActive = true
     
       const rings = pulseLayerRef.value.querySelectorAll('.pulse-ring')
       const tl = gsap.timeline({
         onComplete: () => {
           isPulseActive = false
           gsap.set(rings, { scale: 0, opacity: 0 })
         }
       })
     
       rings.forEach((ring, i) => {
         tl.to(ring, {
           scale: 4,
           opacity: 0.8 - i * 0.15,
           duration: 0.8,
           ease: 'power2.out',
           delay: i * 0.1
         }, 0)
     
         tl.to(ring, {
           opacity: 0,
           duration: 0.5
         }, 0.3)
       })
     
       // 产品上弹
       tl.to(productRef.value, {
         y: -50,
         duration: 0.3,
         ease: 'power2.out'
       }, 0)
     
       tl.to(productRef.value, {
         y: 0,
         duration: 1,
         ease: 'elastic.out(1, 0.5)'
       }, 0.3)
     }
     
     function initClickInteraction() {
       if (!chargerBaseRef.value) return
     
       chargerBaseRef.value.addEventListener('click', triggerPulse)
       cleanupFns.push(() => {
         chargerBaseRef.value?.removeEventListener('click', triggerPulse)
       })
     }
     
     function initScrollProgress() {
       if (!containerRef.value) return
     
       ScrollTrigger.create({
         trigger: containerRef.value,
         start: 'top 100%',
         end: 'bottom -100%',
         onUpdate: (self) => {
           const progress = self.progress
     
           // 更新阶段文字
           if (stageTextRef.value) {
             if (progress < 0.25) {
               stageTextRef.value.textContent = 'CHARGING'
             } else if (progress < 0.75) {
               stageTextRef.value.textContent = 'ACTIVE'
             } else {
               stageTextRef.value.textContent = 'COMPLETING'
             }
           }
     
           // 更新进度条
           if (progressBarRef.value) {
             const fill = progressBarRef.value.querySelector('.progress-fill')
             if (fill) {
               gsap.to(fill, { scaleX: progress, duration: 0.1 })
             }
           }
     
           // 更新数值
           if (powerValueRef.value) {
             const power = Math.min(100, Math.round(progress * 120))
             powerValueRef.value.textContent = `${power}%`
           }
     
           if (efficiencyRef.value) {
             const eff = Math.min(98, Math.round(60 + progress * 40))
             efficiencyRef.value.textContent = `${eff}%`
           }
         }
       })
     }
     
     onMounted(() => {
       initAnimations()
       initMouseInteraction()
       initEnergyRings()
       initArcAnimation()
       initClickInteraction()
       initScrollProgress()
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn())
       cleanupFns.length = 0
       ScrollTrigger.getAll().forEach(st => st.kill())
     })
     </script>
     
     <style scoped lang="scss">
     .wireless-container {
       position: relative;
       width: 100vw;
       height: 100vh;
       background: linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1a2a 100%);
       overflow: hidden;
       perspective: 1000px;
     }
     
     // 深空背景
     .wireless-bg {
       position: absolute;
       inset: 0;
       pointer-events: none;
     }
     
     .bg-particle {
       position: absolute;
       border-radius: 50%;
       background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%);
       animation: particleTwinkle 3s ease-in-out infinite;
     }
     
     @keyframes particleTwinkle {
       0%, 100% { opacity: 0.3; transform: scale(1); }
       50% { opacity: 1; transform: scale(1.2); }
     }
     
     .nebula-halo {
       position: absolute;
       width: 600px;
       height: 600px;
       left: 50%;
       top: 50%;
       transform: translate(-50%, -50%);
       background: radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0, 245, 255, 0.08) 40%, transparent 70%);
       animation: nebulaPulse 6s ease-in-out infinite;
     }
     
     @keyframes nebulaPulse {
       0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
       50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
     }
     
     // 底座层
     .charger-base {
       position: absolute;
       bottom: 20%;
       left: 50%;
       transform: translateX(-50%);
       width: 280px;
       height: 80px;
       transform-style: preserve-3d;
     }
     
     .base-body {
       position: absolute;
       bottom: 0;
       left: 50%;
       transform: translateX(-50%) translateZ(50px);
       width: 260px;
       height: 60px;
       background: linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%);
       border-radius: 130px / 30px;
       box-shadow:
         0 5px 30px rgba(0, 245, 255, 0.3),
         inset 0 2px 10px rgba(255, 255, 255, 0.1),
         inset 0 -5px 20px rgba(0, 0, 0, 0.5);
     }
     
     .base-ring {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 180px;
       height: 35px;
       border: 2px solid rgba(0, 245, 255, 0.5);
       border-radius: 90px / 17px;
       animation: ringPulse 2s ease-in-out infinite;
     }
     
     @keyframes ringPulse {
       0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
       50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
     }
     
     .base-center {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 40px;
       height: 40px;
       background: radial-gradient(circle, #00f5ff 0%, #0088aa 100%);
       border-radius: 50%;
       box-shadow: 0 0 30px rgba(0, 245, 255, 0.8);
     }
     
     .base-glow {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 200px;
       height: 60px;
       background: radial-gradient(ellipse, rgba(0, 245, 255, 0.4) 0%, transparent 70%);
       animation: glowPulse 1.5s ease-in-out infinite;
     }
     
     @keyframes glowPulse {
       0%, 100% { opacity: 0.6; }
       50% { opacity: 1; }
     }
     
     // 能量环
     .energy-rings {
       position: absolute;
       bottom: 0;
       left: 50%;
       transform: translateX(-50%) translateZ(40px);
       width: 240px;
       height: 70px;
       pointer-events: none;
     }
     
     .ring {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       border-radius: 50%;
       border: 1px solid;
       opacity: 0.4;
     }
     
     .ring-1 {
       width: 200px;
       height: 50px;
       border-color: #00f5ff;
       animation: ringExpand 3s ease-out infinite;
     }
     
     .ring-2 {
       width: 220px;
       height: 55px;
       border-color: #a855f7;
       animation: ringExpand 3s ease-out infinite 1s;
     }
     
     .ring-3 {
       width: 240px;
       height: 60px;
       border-color: #00f5ff;
       animation: ringExpand 3s ease-out infinite 2s;
     }
     
     @keyframes ringExpand {
       0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.6; }
       100% { transform: translate(-50%, -50%) scale(1.3); opacity: 0; }
     }
     
     .base-aura {
       position: absolute;
       bottom: -20px;
       left: 50%;
       transform: translateX(-50%);
       width: 300px;
       height: 40px;
       background: radial-gradient(ellipse, rgba(0, 245, 255, 0.3) 0%, transparent 70%);
       filter: blur(10px);
     }
     
     // 光弧层
     .arc-layer {
       position: absolute;
       bottom: 25%;
       left: 50%;
       transform: translateX(-50%) translateZ(25px);
       width: 200px;
       height: 300px;
       pointer-events: none;
     }
     
     .arc-svg {
       width: 100%;
       height: 100%;
     }
     
     .arc-spark {
       filter: url(#arcGlow);
     }
     
     // 产品层
     .product-layer {
       position: absolute;
       top: 25%;
       left: 50%;
       transform: translateX(-50%) translateZ(150px);
       width: 220px;
       height: 380px;
       cursor: pointer;
     }
     
     .product-body {
       position: relative;
       width: 100%;
       height: 100%;
     }
     
     .product-image {
       width: 100%;
       height: 100%;
       object-fit: cover;
       border-radius: 30px;
       box-shadow:
         0 25px 80px rgba(0, 0, 0, 0.6),
         0 0 60px rgba(0, 245, 255, 0.3);
     }
     
     .product-reflection {
       position: absolute;
       inset: 0;
       background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, transparent 30%);
       border-radius: 30px;
       pointer-events: none;
     }
     
     .product-edge-glow {
       position: absolute;
       inset: -2px;
       border-radius: 32px;
       background: linear-gradient(135deg, #00f5ff 0%, #a855f7 50%, #00f5ff 100%);
       z-index: -1;
       opacity: 0.6;
       animation: edgeGlow 2s linear infinite;
       background-size: 200% 200%;
     }
     
     @keyframes edgeGlow {
       0% { background-position: 0% 50%; }
       50% { background-position: 100% 50%; }
       100% { background-position: 0% 50%; }
     }
     
     .product-aura {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 260px;
       height: 420px;
       pointer-events: none;
     }
     
     .aura-ring {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       border-radius: 50%;
       border: 1px solid;
     }
     
     .aura-ring-1 {
       width: 240px;
       height: 400px;
       border-color: rgba(0, 245, 255, 0.3);
       animation: auraExpand 2s ease-in-out infinite;
     }
     
     .aura-ring-2 {
       width: 260px;
       height: 420px;
       border-color: rgba(168, 85, 247, 0.2);
       animation: auraExpand 2s ease-in-out infinite 0.5s;
     }
     
     @keyframes auraExpand {
       0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
       50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.8; }
     }
     
     // 脉冲层
     .pulse-layer {
       position: absolute;
       bottom: 15%;
       left: 50%;
       transform: translateX(-50%);
       width: 280px;
       height: 100px;
       pointer-events: none;
     }
     
     .pulse-ring {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 280px;
       height: 80px;
       border: 3px solid #00f5ff;
       border-radius: 50%;
       opacity: 0;
       box-shadow: 0 0 30px rgba(0, 245, 255, 0.5);
     }
     
     // 信息面板
     .info-panel {
       position: absolute;
       right: 8%;
       top: 50%;
       transform: translateY(-50%);
       padding: 30px;
       background: rgba(10, 10, 26, 0.8);
       border: 1px solid rgba(0, 245, 255, 0.3);
       border-radius: 16px;
       backdrop-filter: blur(10px);
       max-width: 280px;
     }
     
     .panel-tag {
       display: inline-block;
       padding: 6px 12px;
       background: linear-gradient(90deg, #00f5ff, #a855f7);
       border-radius: 20px;
       font-size: 10px;
       font-weight: 700;
       letter-spacing: 2px;
       color: #0a0a1a;
       margin-bottom: 16px;
     }
     
     .panel-title {
       font-size: 28px;
       font-weight: 800;
       color: #fff;
       margin: 0 0 8px;
       background: linear-gradient(90deg, #fff, #00f5ff);
       -webkit-background-clip: text;
       -webkit-text-fill-color: transparent;
       background-clip: text;
     }
     
     .panel-subtitle {
       font-size: 13px;
       color: rgba(255, 255, 255, 0.6);
       margin: 0 0 24px;
     }
     
     .status-bar {
       display: flex;
       gap: 24px;
     }
     
     .status-item {
       display: flex;
       flex-direction: column;
       gap: 4px;
     }
     
     .status-label {
       font-size: 11px;
       color: rgba(255, 255, 255, 0.5);
       text-transform: uppercase;
       letter-spacing: 1px;
     }
     
     .status-value {
       font-size: 20px;
       font-weight: 700;
       color: #00f5ff;
     }
     
     // 磁吸指示器
     .magnet-indicator {
       position: absolute;
       left: 8%;
       bottom: 15%;
       display: flex;
       align-items: center;
       gap: 12px;
       padding: 12px 20px;
       background: rgba(10, 10, 26, 0.8);
       border: 1px solid rgba(168, 85, 247, 0.3);
       border-radius: 30px;
       backdrop-filter: blur(10px);
     }
     
     .magnet-icon {
       width: 24px;
       height: 24px;
     
       svg {
         width: 100%;
         height: 100%;
       }
     }
     
     .magnet-text {
       font-size: 12px;
       font-weight: 600;
       color: rgba(255, 255, 255, 0.8);
       letter-spacing: 1px;
     }
     
     // 阶段指示
     .stage-indicator {
       position: absolute;
       left: 50%;
       bottom: 5%;
       transform: translateX(-50%);
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 8px;
     }
     
     .stage-text {
       font-size: 12px;
       font-weight: 700;
       color: #00f5ff;
       letter-spacing: 3px;
     }
     
     .progress-bar {
       width: 200px;
       height: 3px;
       background: rgba(255, 255, 255, 0.1);
       border-radius: 2px;
       overflow: hidden;
     }
     
     .progress-fill {
       width: 100%;
       height: 100%;
       background: linear-gradient(90deg, #00f5ff, #a855f7);
       transform-origin: left;
       transform: scaleX(0);
     }
     </style>
     
     ```

  2. CardTimeBlackHole (card-time)
   ----------------------------------------------------------------------
   • ScrollTrigger 模式:
   ⏸️ timeline.paused: true（需外部触发 .play()）
   • Props 定义: 该组件无外部Props，内容在组件内部定义
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <section ref="containerRef" class="card-time-blackhole">
         <!-- 黑洞背景 -->
         <div ref="blackholeBgRef" class="blackhole-bg">
           <div ref="eventHorizonRef" class="event-horizon"></div>
           <div ref="accretionDiskRef" class="accretion-disk"></div>
           <div ref="singularityRef" class="singularity"></div>
           <div class="gravitational-waves">
             <span v-for="i in 12" :key="i" class="wave-ring" :style="getWaveStyle(i)"></span>
           </div>
           <div class="space-dust">
             <span v-for="i in 50" :key="i" class="dust-particle" :style="getDustStyle(i)"></span>
           </div>
         </div>
     
         <!-- 主标题 -->
         <div ref="headerRef" class="blackhole-header">
           <div ref="badgeRef" class="blackhole-badge">
             <span class="badge-icon">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                 <circle cx="12" cy="12" r="10"/>
                 <circle cx="12" cy="12" r="4"/>
                 <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
               </svg>
             </span>
             <span class="badge-text">GRAVITATIONAL ANOMALY</span>
           </div>
           <h1 ref="titleRef" class="blackhole-title">BLACK HOLE</h1>
           <p ref="subtitleRef" class="blackhole-subtitle">
             Witness the cosmic power of gravitational distortion
           </p>
         </div>
     
         <!-- 引力扭曲卡片容器 -->
         <div ref="cardsContainerRef" class="cards-container">
           <div
             v-for="(card, index) in cards"
             :key="index"
             :ref="el => cardRefs[index] = el as HTMLElement"
             class="gravity-card"
             :data-index="index"
           >
             <div class="card-warp-field"></div>
             <div class="card-inner">
               <div class="card-horizon">
                 <div class="horizon-ring ring-1"></div>
                 <div class="horizon-ring ring-2"></div>
                 <div class="horizon-core">
                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                     <path v-if="index % 4 === 0" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                     <path v-else-if="index % 4 === 1" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                     <path v-else-if="index % 4 === 2" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v8l6 3"/>
                     <path v-else d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-14v4l3 3"/>
                   </svg>
                 </div>
               </div>
               <div class="card-body">
                 <span class="card-index">{{ String(index + 1).padStart(2, '0') }}</span>
                 <h3 class="card-title">{{ card.title }}</h3>
                 <p class="card-desc">{{ card.desc }}</p>
               </div>
               <div class="card-footer">
                 <span class="card-tag">{{ card.tag }}</span>
                 <div class="card-mass">
                   <span class="mass-icon">⚫</span>
                   <span class="mass-value">{{ card.mass }}</span>
                 </div>
               </div>
             </div>
             <div class="card-gravitational-lens"></div>
           </div>
         </div>
     
         <!-- 底部能量条 -->
         <div ref="footerRef" class="blackhole-footer">
           <div ref="energyBarRef" class="energy-bar">
             <div class="energy-fill"></div>
           </div>
           <span ref="footerTextRef" class="footer-text">SINGULARITY POINT</span>
           <div class="energy-bar">
             <div class="energy-fill"></div>
           </div>
         </div>
       </section>
     </template>
     
     <script setup lang="ts">
     import { ref, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import ScrollTrigger from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     type TweenCleanup = () => void
     
     const containerRef = ref<HTMLElement | null>(null)
     const blackholeBgRef = ref<HTMLElement | null>(null)
     const eventHorizonRef = ref<HTMLElement | null>(null)
     const accretionDiskRef = ref<HTMLElement | null>(null)
     const singularityRef = ref<HTMLElement | null>(null)
     const headerRef = ref<HTMLElement | null>(null)
     const badgeRef = ref<HTMLElement | null>(null)
     const titleRef = ref<HTMLElement | null>(null)
     const subtitleRef = ref<HTMLElement | null>(null)
     const cardsContainerRef = ref<HTMLElement | null>(null)
     const footerRef = ref<HTMLElement | null>(null)
     const footerTextRef = ref<HTMLElement | null>(null)
     const energyBarRef = ref<HTMLElement | null>(null)
     
     const cardRefs = ref<(HTMLElement | null)[]>([])
     
     const cards = [
       { title: 'Event Horizon', desc: 'Point of no return beyond which nothing escapes', tag: 'Boundary', mass: '∞ M☉' },
       { title: 'Singularity', desc: 'Infinitely dense point of collapsed spacetime', tag: 'Core', mass: '10⁹ M☉' },
       { title: 'Accretion Disk', desc: 'Superheated matter spiraling into the void', tag: 'Matter', mass: '0.5 M☉' },
       { title: 'Gravitational Lens', desc: 'Light bent by extreme spacetime curvature', tag: 'Optical', mass: '∞' },
       { title: 'Relativistic Jet', desc: 'High-energy plasma ejected at light speed', tag: 'Energy', mass: '10⁶ M☉' },
       { title: 'Hawking Radiation', desc: 'Theoretical quantum emission from the edge', tag: 'Quantum', mass: 'P' }
     ]
     
     const cleanupFns: TweenCleanup[] = []
     
     const getWaveStyle = (index: number) => ({
       width: `${150 + index * 80}px`,
       height: `${150 + index * 80}px`,
       animationDelay: `${index * 0.3}s`,
       borderColor: `rgba(123, 31, 162, ${0.3 - index * 0.02})`
     })
     
     const getDustStyle = (index: number) => {
       const size = Math.random() * 3 + 1
       const delay = Math.random() * 8
       const duration = Math.random() * 6 + 8
       const x = Math.random() * 100
       const y = Math.random() * 100
       return {
         width: `${size}px`,
         height: `${size}px`,
         left: `${x}%`,
         top: `${y}%`,
         animationDelay: `${delay}s`,
         animationDuration: `${duration}s`
       }
     }
     
     onMounted(() => {
       const allCards = cardRefs.value.filter(Boolean) as HTMLElement[]
       if (!allCards.length) return
     
       const cardInners = allCards.map(card => card.querySelector('.card-inner') as HTMLElement)
       const cardHorizons = allCards.map(card => card.querySelector('.card-horizon') as HTMLElement)
       const horizonCores = allCards.map(card => card.querySelector('.horizon-core') as HTMLElement)
       const gravitationalLens = allCards.map(card => card.querySelector('.card-gravitational-lens') as HTMLElement)
     
       // 1. 初始化状态：所有卡片被黑洞引力吸附在中心奇点
       gsap.set(allCards, {
         xPercent: 50,
         yPercent: 50,
         scale: 0,
         z: -800,
         rotationX: () => gsap.utils.random(-180, 180),
         rotationY: () => gsap.utils.random(-180, 180),
         rotationZ: () => gsap.utils.random(-360, 360),
         opacity: 0,
         filter: 'blur(30px) brightness(0)',
         transformOrigin: 'center center',
         force3D: true
       })
     
       gsap.set(cardInners, {
         opacity: 0,
         scale: 0.5
       })
     
       gsap.set(cardHorizons, {
         rotation: 0,
         scale: 0
       })
     
       gsap.set(horizonCores, {
         opacity: 0,
         scale: 0
       })
     
       gsap.set(gravitationalLens, {
         opacity: 0,
         scale: 0
       })
     
       gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], {
         opacity: 0,
         y: -80,
         filter: 'blur(20px)'
       })
     
       gsap.set(footerTextRef.value, {
         opacity: 0,
         scale: 0
       })
     
       // 背景元素初始化
       gsap.set(eventHorizonRef.value, {
         scale: 0,
         rotation: 0,
         opacity: 0
       })
     
       gsap.set(accretionDiskRef.value, {
         rotation: 0,
         opacity: 0
       })
     
       gsap.set(singularityRef.value, {
         scale: 0,
         opacity: 0
       })
     
       // 2. 入场动画：标题和背景
       const introTl = gsap.timeline({ paused: true })
     
       introTl.to(eventHorizonRef.value, {
         scale: 1,
         opacity: 1,
         rotation: 360,
         duration: 3,
         ease: 'power2.inOut'
       }, 0)
     
       introTl.to(accretionDiskRef.value, {
         opacity: 0.8,
         rotation: 360,
         duration: 10,
         ease: 'none',
         repeat: -1
       }, 0)
     
       introTl.to(singularityRef.value, {
         scale: 1,
         opacity: 1,
         duration: 2,
         ease: 'elastic.out(1, 0.5)'
       }, 0.5)
     
       introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
         opacity: 1,
         y: 0,
         filter: 'blur(0px)',
         duration: 1,
         stagger: 0.15,
         ease: 'power3.out'
       }, 0.3)
     
       introTl.to(footerTextRef.value, {
         opacity: 1,
         scale: 1,
         duration: 0.8,
         ease: 'back.out(1.5)'
       }, 0.8)
     
       introTl.play()
     
       // 3. 滚动驱动时间线：挣脱黑洞引力 → 爆炸扩散
       const gravityTl = gsap.timeline({
         scrollTrigger: {
           trigger: containerRef.value,
           start: 'top 75%',
           end: 'top 25%',
           scrub: 1.2,
           toggleActions: 'play reverse play reverse',
           immediateRender: false
         }
       })
     
       // 核心震撼动画：挣脱黑洞 → 爆炸扩散
       gravityTl.to(allCards, {
         xPercent: 0,
         yPercent: 0,
         z: 0,
         scale: 1,
         rotationX: 0,
         rotationY: 0,
         rotationZ: 0,
         opacity: 1,
         filter: 'blur(0px) brightness(1.4) drop-shadow(0 0 15px rgba(123, 31, 162, 0.6))',
         duration: 2,
         stagger: {
           each: 0.05,
           from: 'random',
           amount: 1.2
         },
         ease: 'elastic.out(1.2, 0.8)',
         transformOrigin: 'center'
       })
     
       gravityTl.to(cardInners, {
         opacity: 1,
         scale: 1,
         duration: 1.5,
         stagger: 0.03,
         ease: 'power2.out'
       }, '-=1.8')
     
       gravityTl.to(cardHorizons, {
         rotation: 360,
         scale: 1,
         duration: 2,
         stagger: 0.03,
         ease: 'power2.out'
       }, '-=1.5')
     
       gravityTl.to(horizonCores, {
         opacity: 1,
         scale: 1,
         duration: 1,
         stagger: 0.03,
         ease: 'elastic.out(1, 0.6)'
       }, '-=1.2')
     
       gravityTl.to(gravitationalLens, {
         opacity: 0.6,
         scale: 1.3,
         duration: 1.5,
         stagger: 0.03,
         ease: 'power2.out'
       }, '-=1')
     
       // 4. 卡片悬浮动画
       const floatTl = gsap.timeline({ paused: true })
     
       allCards.forEach((card, i) => {
         floatTl.to(card, {
           y: () => gsap.utils.random(-20, -8),
           rotationX: () => gsap.utils.random(-5, 5),
           rotationY: () => gsap.utils.random(-5, 5),
           duration: 2.5 + Math.random(),
           ease: 'sine.inOut',
           repeat: -1,
           yoyo: true
         }, i * 0.1)
       })
     
       ScrollTrigger.create({
         trigger: containerRef.value,
         start: 'top 60%',
         onEnter: () => floatTl.play(),
         onLeaveBack: () => floatTl.pause()
       })
     
       // 5. 吸积盘旋转动画
       const diskTl = gsap.timeline({ paused: true })
       diskTl.to(accretionDiskRef.value, {
         rotation: 360,
         duration: 20,
         ease: 'none',
         repeat: -1
       }, 0)
     
       ScrollTrigger.create({
         trigger: containerRef.value,
         start: 'top 80%',
         onEnter: () => diskTl.play(),
         onLeaveBack: () => diskTl.pause()
       })
     
       // 6. 引力波脉冲动画
       const waveRings = containerRef.value?.querySelectorAll('.wave-ring')
       if (waveRings) {
         waveRings.forEach((ring, i) => {
           const ringPulse = gsap.timeline({ paused: true })
           ringPulse.to(ring, {
             scale: 1.5,
             opacity: 0,
             duration: 2 + Math.random(),
             ease: 'power2.out',
             repeat: -1
           }, i * 0.2)
     
           ScrollTrigger.create({
             trigger: containerRef.value,
             start: 'top 70%',
             onEnter: () => ringPulse.play(),
             onLeaveBack: () => ringPulse.pause()
           })
         })
       }
     
       // 7. 能量条动画
       const energyFill = containerRef.value?.querySelectorAll('.energy-fill')
       if (energyFill) {
         energyFill.forEach((fill) => {
           gsap.to(fill, {
             width: '100%',
             duration: 1.5,
             ease: 'power2.inOut',
             repeat: -1,
             yoyo: true
           })
         })
       }
     
       // 保存清理函数
       cleanupFns.push(
         () => {
           introTl.kill()
           gravityTl.kill()
           floatTl.kill()
           diskTl.kill()
         }
       )
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn())
       ScrollTrigger.getAll().forEach(st => {
         if (st.vars.trigger === containerRef.value) {
           st.kill()
         }
       })
       gsap.killTweensOf('.wave-ring')
       gsap.killTweensOf('.energy-fill')
     })
     </script>
     
     <style lang="scss" scoped>
     .card-time-blackhole {
       width: 100vw;
       height: 100vh;
       background: linear-gradient(180deg, #0a0015 0%, #1a0a2e 50%, #0a0015 100%);
       display: flex;
       flex-direction: column;
       align-items: center;
       justify-content: center;
       overflow: hidden;
       position: relative;
       perspective: 2000px;
     }
     
     .blackhole-bg {
       position: absolute;
       inset: 0;
       pointer-events: none;
       overflow: hidden;
     }
     
     .event-horizon {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 400px;
       height: 400px;
       transform: translate(-50%, -50%);
       border-radius: 50%;
       background: radial-gradient(
         circle at center,
         #000000 0%,
         #000000 30%,
         rgba(123, 31, 162, 0.1) 50%,
         transparent 70%
       );
       box-shadow:
         0 0 100px rgba(123, 31, 162, 0.3),
         inset 0 0 80px rgba(0, 0, 0, 1);
       border: 2px solid rgba(123, 31, 162, 0.3);
     }
     
     .accretion-disk {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 600px;
       height: 600px;
       transform: translate(-50%, -50%) rotateX(75deg);
       border-radius: 50%;
       background: conic-gradient(
         from 0deg,
         transparent,
         rgba(255, 100, 50, 0.4),
         rgba(123, 31, 162, 0.6),
         rgba(255, 50, 100, 0.3),
         rgba(75, 0, 130, 0.5),
         transparent
       );
       filter: blur(3px);
       opacity: 0;
     }
     
     .singularity {
       position: absolute;
       top: 50%;
       left: 50%;
       width: 80px;
       height: 80px;
       transform: translate(-50%, -50%);
       border-radius: 50%;
       background: radial-gradient(
         circle at center,
         #ffffff 0%,
         #7b1fa2 30%,
         #000000 100%
       );
       box-shadow:
         0 0 50px rgba(123, 31, 162, 0.8),
         0 0 100px rgba(123, 31, 162, 0.4);
     }
     
     .gravitational-waves {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
     
       .wave-ring {
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
         border-radius: 50%;
         border: 1px solid rgba(123, 31, 162, 0.3);
         animation: waveExpand linear infinite;
       }
     
       @keyframes waveExpand {
         0% {
           transform: translate(-50%, -50%) scale(0);
           opacity: 0.5;
         }
         100% {
           transform: translate(-50%, -50%) scale(2);
           opacity: 0;
         }
       }
     }
     
     .space-dust {
       position: absolute;
       inset: 0;
     
       .dust-particle {
         position: absolute;
         background: rgba(255, 255, 255, 0.6);
         border-radius: 50%;
         animation: dustFloat linear infinite;
     
         @keyframes dustFloat {
           0% {
             transform: translate(0, 0) scale(1);
             opacity: 0.3;
           }
           50% {
             transform: translate(30px, -50px) scale(1.5);
             opacity: 0.8;
           }
           100% {
             transform: translate(0, 0) scale(1);
             opacity: 0.3;
           }
         }
       }
     }
     
     .blackhole-header {
       text-align: center;
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 20px;
       margin-bottom: 40px;
       z-index: 10;
     }
     
     .blackhole-badge {
       display: inline-flex;
       align-items: center;
       gap: 10px;
       font-family: 'Inter', sans-serif;
       font-size: 11px;
       font-weight: 600;
       color: rgba(123, 31, 162, 0.9);
       letter-spacing: 4px;
       text-transform: uppercase;
       padding: 10px 24px;
       border: 1px solid rgba(123, 31, 162, 0.4);
       border-radius: 30px;
       background: rgba(123, 31, 162, 0.08);
       backdrop-filter: blur(10px);
     
       .badge-icon {
         display: flex;
         align-items: center;
         justify-content: center;
     
         svg {
           width: 14px;
           height: 14px;
           color: #7b1fa2;
         }
       }
     }
     
     .blackhole-title {
       font-family: 'Orbitron', 'Rajdhani', sans-serif;
       font-size: 72px;
       font-weight: 700;
       color: #ffffff;
       letter-spacing: 14px;
       text-transform: uppercase;
       margin: 0;
       background: linear-gradient(135deg, #ffffff 0%, #7b1fa2 30%, #e040fb 50%, #7b1fa2 70%, #ffffff 100%);
       -webkit-background-clip: text;
       -webkit-text-fill-color: transparent;
       background-clip: text;
       text-shadow: 0 0 60px rgba(123, 31, 162, 0.6);
     }
     
     .blackhole-subtitle {
       font-family: 'Inter', sans-serif;
       font-size: 14px;
       font-weight: 400;
       color: rgba(255, 255, 255, 0.5);
       letter-spacing: 3px;
       margin: 0;
       max-width: 500px;
     }
     
     .cards-container {
       display: flex;
       flex-wrap: wrap;
       justify-content: center;
       gap: 24px;
       max-width: 1100px;
       padding: 20px;
       perspective: 1500px;
       transform-style: preserve-3d;
     }
     
     .gravity-card {
       width: 240px;
       height: 340px;
       position: relative;
       transform-style: preserve-3d;
       backface-visibility: hidden;
       cursor: pointer;
     
       &:hover {
         .card-gravitational-lens {
           opacity: 0.9 !important;
           transform: scale(1.5);
         }
     
         .card-inner {
           border-color: rgba(123, 31, 162, 0.6);
           box-shadow: 0 30px 60px rgba(123, 31, 162, 0.4);
         }
     
         .horizon-core svg {
           filter: drop-shadow(0 0 20px #7b1fa2);
         }
       }
     }
     
     .card-warp-field {
       position: absolute;
       inset: -30px;
       background: radial-gradient(
         ellipse at center,
         rgba(123, 31, 162, 0.2) 0%,
         transparent 70%
       );
       filter: blur(15px);
       border-radius: 30px;
     }
     
     .card-inner {
       width: 100%;
       height: 100%;
       background: linear-gradient(
         145deg,
         rgba(25, 10, 40, 0.95) 0%,
         rgba(40, 20, 60, 0.9) 100%
       );
       backdrop-filter: blur(20px);
       border: 1px solid rgba(123, 31, 162, 0.25);
       border-radius: 20px;
       padding: 24px;
       display: flex;
       flex-direction: column;
       align-items: center;
       position: relative;
       overflow: hidden;
       box-shadow:
         0 20px 50px rgba(0, 0, 0, 0.5),
         inset 0 1px 0 rgba(255, 255, 255, 0.05);
       transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
     
       &::before {
         content: '';
         position: absolute;
         top: 0;
         left: 0;
         right: 0;
         height: 2px;
         background: linear-gradient(
           90deg,
           transparent,
           rgba(123, 31, 162, 0.6),
           rgba(224, 64, 251, 0.4),
           transparent
         );
       }
     
       &::after {
         content: '';
         position: absolute;
         bottom: 0;
         left: 0;
         right: 0;
         height: 1px;
         background: linear-gradient(
           90deg,
           transparent,
           rgba(123, 31, 162, 0.3),
           transparent
         );
       }
     }
     
     .card-horizon {
       width: 100px;
       height: 100px;
       position: relative;
       margin-bottom: 20px;
       transform-style: preserve-3d;
     }
     
     .horizon-ring {
       position: absolute;
       border-radius: 50%;
       border: 1px solid rgba(123, 31, 162, 0.3);
     
       &.ring-1 {
         inset: 0;
         animation: horizonRotate 15s linear infinite;
         border-color: rgba(224, 64, 251, 0.3);
       }
     
       &.ring-2 {
         inset: 20px;
         animation: horizonRotate 10s linear infinite reverse;
         border-color: rgba(123, 31, 162, 0.4);
       }
     
       @keyframes horizonRotate {
         from { transform: rotate(0deg); }
         to { transform: rotate(360deg); }
       }
     }
     
     .horizon-core {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       width: 45px;
       height: 45px;
       background: linear-gradient(135deg, rgba(123, 31, 162, 0.3), rgba(224, 64, 251, 0.2));
       border-radius: 12px;
       display: flex;
       align-items: center;
       justify-content: center;
       border: 1px solid rgba(123, 31, 162, 0.4);
       box-shadow:
         0 0 30px rgba(123, 31, 162, 0.3),
         inset 0 0 20px rgba(123, 31, 162, 0.2);
     
       svg {
         width: 24px;
         height: 24px;
         color: #e040fb;
         transition: filter 0.3s ease;
       }
     }
     
     .card-body {
       flex-grow: 1;
       display: flex;
       flex-direction: column;
       align-items: center;
       gap: 10px;
       text-align: center;
     }
     
     .card-index {
       font-family: 'Orbitron', sans-serif;
       font-size: 11px;
       font-weight: 600;
       color: rgba(123, 31, 162, 0.5);
       letter-spacing: 3px;
     }
     
     .card-title {
       font-family: 'Orbitron', 'Rajdhani', sans-serif;
       font-size: 18px;
       font-weight: 600;
       color: #ffffff;
       margin: 0;
       letter-spacing: 2px;
       text-transform: uppercase;
     }
     
     .card-desc {
       font-family: 'Inter', sans-serif;
       font-size: 11px;
       font-weight: 400;
       color: rgba(255, 255, 255, 0.5);
       line-height: 1.6;
       margin: 0;
     }
     
     .card-footer {
       display: flex;
       align-items: center;
       justify-content: space-between;
       width: 100%;
       padding-top: 16px;
       border-top: 1px solid rgba(123, 31, 162, 0.15);
     }
     
     .card-tag {
       font-family: 'Inter', sans-serif;
       font-size: 9px;
       font-weight: 600;
       color: #e040fb;
       letter-spacing: 2px;
       text-transform: uppercase;
       padding: 4px 10px;
       background: rgba(123, 31, 162, 0.15);
       border-radius: 10px;
       border: 1px solid rgba(123, 31, 162, 0.25);
     }
     
     .card-mass {
       display: flex;
       align-items: center;
       gap: 6px;
     }
     
     .mass-icon {
       font-size: 10px;
       color: #7b1fa2;
       animation: massPulse 2s ease-in-out infinite;
     
       @keyframes massPulse {
         0%, 100% { opacity: 0.5; }
         50% { opacity: 1; }
       }
     }
     
     .mass-value {
       font-family: 'Orbitron', sans-serif;
       font-size: 11px;
       font-weight: 600;
       color: #e040fb;
     }
     
     .card-gravitational-lens {
       position: absolute;
       inset: -10px;
       border-radius: 25px;
       background: radial-gradient(
         ellipse at center,
         rgba(123, 31, 162, 0.15) 0%,
         transparent 70%
       );
       filter: blur(10px);
       pointer-events: none;
       transition: all 0.4s ease;
     }
     
     .blackhole-footer {
       display: flex;
       align-items: center;
       gap: 20px;
       margin-top: 40px;
       z-index: 10;
     }
     
     .energy-bar {
       width: 80px;
       height: 3px;
       background: rgba(123, 31, 162, 0.2);
       border-radius: 2px;
       overflow: hidden;
     
       .energy-fill {
         height: 100%;
         width: 30%;
         background: linear-gradient(90deg, #7b1fa2, #e040fb);
         border-radius: 2px;
       }
     }
     
     .footer-text {
       font-family: 'Orbitron', sans-serif;
       font-size: 11px;
       font-weight: 500;
       color: rgba(123, 31, 162, 0.6);
       letter-spacing: 4px;
       text-transform: uppercase;
     }
     
     @media (max-width: 1200px) {
       .cards-container {
         max-width: 800px;
       }
     
       .gravity-card {
         width: 220px;
         height: 310px;
       }
     
       .blackhole-title {
         font-size: 56px;
         letter-spacing: 10px;
       }
     }
     
     @media (max-width: 768px) {
       .cards-container {
         max-width: 500px;
         gap: 16px;
       }
     
       .gravity-card {
         width: 180px;
         height: 280px;
       }
     
       .card-horizon {
         width: 80px;
         height: 80px;
       }
     
       .blackhole-title {
         font-size: 36px;
         letter-spacing: 6px;
       }
     
       .blackhole-subtitle {
         font-size: 12px;
         letter-spacing: 2px;
       }
     }
     </style>
     
     ```


5. 【联系/CTA】
   描述：表单/联系方式
   📦 使用组件 (1个)

  1. CardImgWaterfall (card-img)
   ----------------------------------------------------------------------
   • Props 定义: 该组件无外部Props，内容在组件内部定义
   • 完整 Vue 3 组件源码（转 React 时参考）:
     ```vue
     <template>
       <div class="card-waterfall" ref="parentRef">
         <!-- 深色虚空背景 -->
         <div ref="bgRef" class="void-background">
           <div class="void-gradient"></div>
         </div>
     
         <!-- 图片矩阵容器 -->
         <div class="image-grid" ref="gridRef">
           <div
             v-for="(img, index) in images"
             :key="index"
             :ref="el => { if (el) imageRefs[index] = el as HTMLElement }"
             class="image-item"
             :class="`item-${index}`"
           >
             <img :src="img" :alt="`Gallery ${index + 1}`" class="grid-image" />
     
             <!-- 触地光粒 -->
             <div class="impact-particles" :ref="el => { if (el) particleRefs[index] = el as HTMLElement }">
               <div v-for="p in 6" :key="p" class="particle" :class="`p-${p}`"></div>
             </div>
           </div>
         </div>
     
         <!-- 标题 -->
         <div ref="titleRef" class="cascade-title">
           <h2>Waterfall Cascade</h2>
           <p>流瀑音阶 · 阶梯坠落</p>
         </div>
       </div>
     </template>
     
     <script setup lang="ts">
     import { ref, onMounted, onUnmounted } from 'vue'
     import gsap from 'gsap'
     import ScrollTrigger from 'gsap/ScrollTrigger'
     
     gsap.registerPlugin(ScrollTrigger)
     
     interface TweenCleanup {
       revert: () => void
     }
     
     const images = [
       'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
       'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
       'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=600&q=80',
       'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&q=80',
       'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&q=80',
       'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
       'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
       'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=600&q=80',
       'https://images.unsplash.com/photo-1439405326854-014607f694d7?w=600&q=80',
     ]
     
     const parentRef = ref<HTMLElement | null>(null)
     const bgRef = ref<HTMLElement | null>(null)
     const gridRef = ref<HTMLElement | null>(null)
     const titleRef = ref<HTMLElement | null>(null)
     const imageRefs = ref<(HTMLElement | null)[]>([])
     const particleRefs = ref<(HTMLElement | null)[]>([])
     
     const cleanupFns: TweenCleanup[] = []
     
     onMounted(() => {
       if (!parentRef.value || !gridRef.value || !titleRef.value) {
         return
       }
     
       // Z字形阶梯分布（自左向右、从上至下）
       const stairOffsets = [
         [-80, -100, -120],   // 列0: 上→中→下
         [-90, -110, -130],   // 列1: 稍低
         [-85, -105, -125],   // 列2: 再稍低
       ]
     
       // 设置初始状态
       imageRefs.value.forEach((el, index) => {
         if (!el) return
         const col = index % 3
         const row = Math.floor(index / 3)
         const yOffset = stairOffsets[col][row]
     
         gsap.set(el, {
           y: yOffset,
           scale: 0.9,
           opacity: 0,
           boxShadow: '0 0 0 rgba(100, 150, 255, 0)',
         })
       })
     
       // 粒子初始状态
       particleRefs.value.forEach(el => {
         if (!el) return
         gsap.set(el, { opacity: 0 })
       })
     
       gsap.set(titleRef.value, { opacity: 0, y: 30 })
     
       const tl = gsap.timeline({
         scrollTrigger: {
           trigger: parentRef.value,
           start: 'top 80%',
           end: 'bottom 20%',
           scrub: 1.5,
         },
       })
     
       cleanupFns.push({
         revert: () => ScrollTrigger.getAll().forEach(t => t.kill()),
       })
     
       // Z字形坠落序列（列间交错）
       const colStagger = 0.18
       const rowStagger = 0.06
     
       imageRefs.value.forEach((el, index) => {
         if (!el) return
         const col = index % 3
         const row = Math.floor(index / 3)
         const startTime = col * colStagger + row * rowStagger
     
         // 坠落动画
         tl.to(
           el,
           {
             y: 0,
             scale: 1,
             opacity: 1,
             duration: 0.5,
             ease: 'power4.in',
           },
           startTime
         )
     
         // 首次触地微弹
         tl.to(
           el,
           {
             y: -12,
             duration: 0.08,
             ease: 'power2.out',
           },
           startTime + 0.5
         )
     
         // 二次回弹锁定
         tl.to(
           el,
           {
             y: 0,
             duration: 0.15,
             ease: 'back.out(1.5)',
           },
           startTime + 0.58
         )
     
         // 阴影加深
         tl.to(
           el,
           {
             boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
             duration: 0.3,
             ease: 'power2.out',
           },
           startTime + 0.45
         )
     
         // 冷光粒子迸发
         tl.to(
           particleRefs.value[index],
           {
             opacity: 1,
             duration: 0.05,
             ease: 'none',
           },
           startTime + 0.5
         )
     
         // 粒子扩散消散
         tl.to(
           particleRefs.value[index].querySelectorAll('.particle'),
           {
             x: (i: number) => (i % 2 === 0 ? 1 : -1) * (20 + Math.random() * 30),
             y: (i: number) => (i < 3 ? -1 : 1) * (15 + Math.random() * 25),
             opacity: 0,
             scale: 0,
             duration: 0.4,
             ease: 'power2.out',
             stagger: 0.02,
           },
           startTime + 0.52
         )
       })
     
       // 全部落位后亮度齐升
       tl.to(
         '.grid-image',
         {
           filter: 'brightness(1)',
           duration: 0.6,
           ease: 'power2.out',
         },
         0.8
       )
     
       // 标题淡入
       tl.fromTo(
         titleRef.value,
         { opacity: 0, y: 30 },
         {
           opacity: 1,
           y: 0,
           duration: 0.8,
           ease: 'power2.out',
         },
         1.2
       )
     })
     
     onUnmounted(() => {
       cleanupFns.forEach(fn => fn.revert())
       ScrollTrigger.getAll().forEach(t => t.kill())
     })
     </script>
     
     <style scoped lang="scss">
     .card-waterfall {
       width: 100vw;
       height: 100vh;
       position: relative;
       overflow: hidden;
       background: linear-gradient(180deg, #08080c 0%, #0c0c14 50%, #08080c 100%);
     }
     
     .void-background {
       position: absolute;
       inset: 0;
       z-index: 0;
     
       .void-gradient {
         position: absolute;
         inset: 0;
         background:
           radial-gradient(ellipse 60% 40% at 50% 30%, rgba(60, 80, 120, 0.08) 0%, transparent 60%),
           radial-gradient(ellipse 80% 60% at 50% 80%, rgba(20, 30, 50, 0.3) 0%, transparent 50%);
       }
     }
     
     .image-grid {
       position: absolute;
       top: 50%;
       left: 50%;
       transform: translate(-50%, -50%);
       display: grid;
       grid-template-columns: repeat(3, 1fr);
       grid-template-rows: repeat(3, 1fr);
       gap: 16px;
       width: 75vw;
       max-width: 850px;
       height: 60vh;
       max-height: 560px;
       z-index: 5;
     }
     
     .image-item {
       position: relative;
       overflow: visible;
       border-radius: 6px;
       cursor: pointer;
       transition: transform 0.3s ease;
     
       &:hover {
         transform: translateY(-3px);
       }
     }
     
     .grid-image {
       width: 100%;
       height: 100%;
       object-fit: cover;
       filter: brightness(0.8);
       border-radius: 6px;
       box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
     }
     
     .impact-particles {
       position: absolute;
       bottom: 0;
       left: 50%;
       transform: translateX(-50%);
       width: 100%;
       height: 100%;
       pointer-events: none;
       z-index: 10;
     }
     
     .particle {
       position: absolute;
       bottom: 0;
       left: 50%;
       width: 3px;
       height: 3px;
       background: radial-gradient(
         circle at 30% 30%,
         rgba(180, 220, 255, 0.9),
         rgba(100, 160, 255, 0.6)
       );
       border-radius: 50%;
       box-shadow:
         0 0 4px rgba(150, 200, 255, 0.8),
         0 0 8px rgba(100, 160, 255, 0.5);
     
       &.p-1 { transform: translate(-50%, 0); }
       &.p-2 { transform: translate(-30%, 0); }
       &.p-3 { transform: translate(-10%, 0); }
       &.p-4 { transform: translate(10%, 0); }
       &.p-5 { transform: translate(30%, 0); }
       &.p-6 { transform: translate(50%, 0); }
     }
     
     .cascade-title {
       position: absolute;
       bottom: 60px;
       left: 50%;
       transform: translateX(-50%);
       text-align: center;
       z-index: 20;
       opacity: 0;
     
       h2 {
         font-family: 'Montserrat', 'Arial', sans-serif;
         font-size: clamp(22px, 3.5vw, 38px);
         font-weight: 300;
         color: #d0e0f0;
         margin: 0 0 10px;
         letter-spacing: 10px;
         text-transform: uppercase;
         text-shadow: 0 2px 20px rgba(100, 150, 220, 0.4);
       }
     
       p {
         font-family: 'Noto Serif SC', 'STSong', serif;
         font-size: clamp(12px, 2vw, 16px);
         color: rgba(180, 200, 230, 0.6);
         margin: 0;
         letter-spacing: 6px;
       }
     }
     </style>
     
     ```

--------------------------------------------------------------------------------
📊 组件类型汇总
card-image: 3个
card-img: 2个
card-text: 2个
card-time: 2个
card-list: 1个

================================================================================
📝 输出要求：直接生成完整的 React 网站代码
================================================================================
请直接生成以下文件的完整代码（不要写方案文档，直接写代码）：

### 必须生成的文件清单
1. **App.tsx** - 主应用组件（包含所有 Section 的组合）
2. **main.tsx** - 入口文件
3. **components/Navbar.tsx** - 导航栏组件
4. **components/Footer.tsx** - 页脚组件
5. **sections/[模块名].tsx** - 各模块的 Section 组件
6. **components/[组件名]/index.tsx** - 转换后的 React 组件
7. **index.css** - 全局样式（含 Tailwind 配置、CSS 变量）
8. **tailwind.config.js** - Tailwind 配置文件

### 代码要求
- 每个文件必须是完整可运行的代码，包含所有 import/export
- 组件内部的 GSAP 动画逻辑必须完整实现，不能省略
- Canvas 渲染逻辑必须用 useRef + useEffect 完整重写
- 所有 ScrollTrigger 必须在 useEffect 中正确初始化和清理
- 使用 TypeScript，所有组件必须有明确的类型定义
- 样式使用 Tailwind CSS + 自定义 CSS 变量
- **性能优化**: 确保动画流畅度 ≥60fps，使用 will-change 提示浏览器，避免在滚动事件中执行重计算，Canvas 动画需在页面不可见时暂停（监听 visibilitychange），GSAP 动画需在组件卸载时 kill() 释放资源
- **错误处理**: 图片加载失败时显示占位图或纯色背景，GSAP 初始化失败时有降级方案（纯 CSS 动画或静态展示），Canvas 不支持时显示备用内容
- **ScrollTrigger 清理模板**: 必须在 useEffect cleanup 中调用清理函数，示例：`return () => { tweens.forEach(t => t.kill()); ScrollTrigger.getAll().forEach(t => t.kill()); }`

### 📝 内容创作指南（重要）
**核心原则：文案必须与组件的视觉效果相呼应，创造沉浸式的用户体验**

#### 1. 根据视觉特效选择文案主题
| 视觉效果 | 文案主题方向 | 示例关键词 |
|---------|------------|-----------|
| 粒子/星空/宇宙 | 探索、无限可能、前沿科技 | "探索未知边界"、"连接无限可能" |
| 流体/波浪/液态 | 创新、变革、灵活适应 | "引领行业变革"、"灵活应对挑战" |
| 3D旋转/立体几何 | 专业、稳固、多维视角 | "多维度解决方案"、"稳固可靠" |
| 光效/霓虹/发光 | 活力、能量、突破 | "释放潜能"、"点亮未来" |
| 时间轴/流程/进度 | 成长、历程、持续进步 | "见证每一步成长"、"持续进化" |
| 卡片翻转/视差 | 发现、层次、深度洞察 | "发现新视角"、"深度洞察" |

#### 2. 标题撰写规范
- **主标题**：8-15字，简洁有力，直接传达核心价值
  - ❌ 错误："智能驱动未来"（太通用）
  - ✅ 正确："AI赋能制造业数字化转型"（具体、贴合行业）
- **副标题**：20-30字，补充说明主标题，增强说服力
  - 示例："为制造企业提供从生产到销售的全链路智能化解决方案，提升效率30%以上"

#### 3. 段落描述要求
- 每段 60-120 字，避免空洞的形容词堆砌
- 必须包含具体的业务场景、数据支撑或客户价值
- 语言风格要与企业行业匹配：
  - 科技行业：专业、前瞻、技术导向
  - 金融行业：稳健、可信、安全
  - 教育行业：温暖、启发、成长
  - 医疗行业：关怀、精准、生命

#### 3.5 🎨 GSAP 文字动画组件设计规范（重要）
**检测到您选择了 card-text 类型的文字动画组件，请严格遵循以下设计规范：**

##### 3.5.1 文字组件参考标准
所有文字动画必须参考 `src/views/web-list/card-text` 目录下的 Vue3 组件设计，包括：
- **CardTextBlur**: 模糊揭示动画（blur filter + y 位移 + opacity）
- **CardTextNeonSign**: 霓虹灯效果（text-shadow 动画 + 发光效果）
- **CardTextHologram**: 全息投影效果（gradient text + shimmer 动画）
- **CardTextParticleStorm**: 粒子风暴文字（Canvas 粒子组成文字）
- **CardTextFluid3D**: 3D 流体文字（3D transform + fluid motion）
- **CardTextCyber**: 赛博朋克风格（glitch effect + scan lines）
- **CardTextGalaxy**: 星系文字（旋转星云效果）
- **CardTextLaser**: 激光扫描效果（linear-gradient mask 动画）
- 以及其他 20+ 种文字特效组件

##### 3.5.2 核心技术要求（必须遵守）
1. **Vue3 → React 转换规则**：
  - 使用 `useRef` 替代 `ref()` 获取 DOM 元素
  - 在 `useEffect` 中初始化 GSAP 动画，确保 DOM 已渲染
  - 使用 `gsap.context()` 包裹所有动画代码，便于清理
  - 在 `return () => ctx.revert()` 中清理所有动画

2. **ScrollTrigger 配置标准**：
   ```tsx
   scrollTrigger: {
     trigger: sectionRef.current,
     start: "top 80%",  // 元素顶部到达视口80%时开始
     end: "top 20%",    // 元素顶部到达视口20%时结束
     scrub: 1.5,        // 平滑系数，值越大动画越平滑
     toggleActions: "play none none reverse"
   }
   ```

3. **文字动画常见模式**：
  - **模糊揭示**：`{ filter: "blur(20px)", opacity: 0, y: 120 }` → `{ filter: "blur(0px)", opacity: 1, y: 0 }`
  - **缩放入场**：`{ scale: 0.8, opacity: 0 }` → `{ scale: 1, opacity: 1 }`
  - **交错延迟**：使用 `stagger: 0.15` 让多个段落依次动画
  - **3D 旋转**：`{ rotationX: -45, opacity: 0 }` → `{ rotationX: 0, opacity: 1 }`
  - **渐变遮罩**：使用 `background-clip: text` + animated gradient

4. **性能优化要点**：
  - 使用 `will-change: transform, opacity` 提升动画性能
  - 避免同时动画大量文字元素（建议 ≤10 个段落）
  - Canvas 文字动画需监听 `visibilitychange` 暂停
  - 移动端简化动画（减少 blur 半径、降低粒子数量）

5. **响应式设计**：
  - 桌面端（≥1024px）：完整动画效果，字体大小 18-24px
  - 平板端（768-1023px）：简化动画，字体大小 16-20px
  - 移动端（<768px）：仅保留淡入效果，字体大小 14-18px
  - 超小屏幕（<480px）：禁用复杂动画，确保可读性

##### 3.5.3 完整代码示例（React + GSAP）
```tsx
import { useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const TextSection = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 标题动画 - 模糊揭示
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          { y: 120, opacity: 0, filter: "blur(20px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 1.5
            }
          }
        )
      }

      // 段落交错动画
      const validParagraphs = paragraphRefs.current.filter(Boolean)
      if (validParagraphs.length > 0) {
        gsap.fromTo(validParagraphs,
          { y: 150, opacity: 0, filter: "blur(25px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.2,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              end: "top 20%",
              scrub: 1.5
            }
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert() // ✅ 清理所有动画
  }, [])

  return (
    <section ref={sectionRef} className="text-section">
      <h2 ref={titleRef}>企业核心价值</h2>
      <p ref={el => paragraphRefs.current[0] = el}>第一段内容...</p>
      <p ref={el => paragraphRefs.current[1] = el}>第二段内容...</p>
      <p ref={el => paragraphRefs.current[2] = el}>第三段内容...</p>
    </section>
  )
}
```

##### 3.5.4 文字内容与动画的匹配原则
| 文字特效类型 | 适用文案主题 | 动画节奏 |
|------------|------------|---------|
| 模糊揭示（Blur） | 渐进式披露、深度洞察 | 缓慢优雅（1.2-1.5s） |
| 霓虹发光（Neon） | 活力、创新、突破 | 快速闪烁（0.6-0.8s） |
| 全息投影（Hologram） | 科技感、未来感 | 中等速度（1.0-1.2s） |
| 粒子风暴（Particle） | 数据、连接、网络 | 动态爆发（0.8-1.0s） |
| 3D 流体（Fluid3D） | 灵活、变革、适应 | 流畅自然（1.2-1.5s） |
| 赛博朋克（Cyber） | 数字化、AI、自动化 | 机械节奏（0.5-0.7s） |
| 激光扫描（Laser） | 精准、聚焦、目标 | 线性匀速（1.0s） |

##### 3.5.5 常见错误警告
❌ **禁止的做法**：
- 直接在 render 中执行 GSAP 动画（必须在 useEffect 中）
- 使用 className 选择器（如 `.title`），应使用 ref 引用具体元素
- 忘记清理 ScrollTrigger（导致内存泄漏）
- 对所有文字使用相同动画（应根据内容层次差异化）
- 动画持续时间过长（>2s 会让用户失去耐心）
- 在移动端使用复杂的 blur/canvas 动画（性能差）

✅ **正确的做法**：
- 使用 `gsap.context()` 包裹动画，便于批量清理
- 为每个文字元素设置唯一的 ref（避免冲突）
- ScrollTrigger 配置 `scrub: 1.5` 实现平滑滚动绑定
- 标题用强动画（blur + scale + y），段落用弱动画（仅 y + opacity）
- 添加 `prefers-reduced-motion` 检测，为敏感用户禁用动画
- 使用 `will-change` 提示浏览器优化渲染

#### 4. 🖼️ 图片使用策略（重点）
**原则：图片不是装饰，而是内容的视觉化表达。每个模块至少使用1-2张高质量图片。**

##### 4.1 图片数量要求
- **首屏 Hero**：1张全屏背景图或视频封面（必须震撼、有冲击力）
- **产品展示模块**：3-6张产品/案例图片（展示多样性）
- **团队介绍模块**：2-4张团队成员照片或办公场景
- **数据展示模块**：配合图表的背景图或图标插画
- **联系/CTA模块**：1张引导性图片（如握手、合作场景）

##### 4.2 图片与动画的结合方式
- **粒子效果 + 星空/科技图片**：背景使用深空、星系、电路板等图片，前景叠加粒子动画，营造科技感
- **流体动画 + 自然/抽象图片**：使用水流、烟雾、渐变抽象图片，与流体动画呼应
- **3D旋转 + 产品实拍图**：将企业真实产品图片放入3D卡片中旋转展示
- **视差滚动 + 分层图片**：前景人物/产品、中景场景、远景天空，形成层次感
- **时间轴 + 历程图片**：每个时间节点配一张对应的历史照片或里程碑图片

##### 4.3 Unsplash 图片搜索技巧
根据企业行业和模块主题，组合以下关键词搜索：
```
科技行业：technology + innovation, AI + data, digital + transformation, startup + office
金融行业：finance + professional, business + meeting, trust + handshake, investment + growth
教育行业：education + learning, students + classroom, graduation + success, online + course
医疗行业：healthcare + doctor, medical + technology, patient + care, hospital + modern
制造业：manufacturing + factory, industrial + automation, production + quality, engineer + work
```

##### 4.4 图片质量要求
- **分辨率**：至少 1920x1080，优先使用横版构图
- **色调**：与品牌主色协调，可通过 CSS filter 调整色温/饱和度
- **主体清晰**：避免过于杂乱或模糊的图片
- **留白充足**：方便在其上叠加文字或动画元素
- **格式**：使用 `.jpg` 或 `.webp`，通过 URL 参数控制质量 `?w=1920&q=80`

##### 4.5 图片布局建议
- **Hero 全屏背景**：`background-image: url(...)` + `background-size: cover` + 半透明遮罩层
- **左右分栏**：左侧文字 + 右侧图片（或反之），适合产品介绍
- **网格画廊**：3列或4列网格展示多个产品/案例图片
- **卡片覆盖**：图片作为卡片背景，上方叠加文字和按钮
- **轮播/滑动**：多张图片横向滑动展示，适合团队或案例

##### 4.6 图片加载优化
- 使用 `loading="lazy"` 懒加载非首屏图片
- 添加 `alt` 属性提升可访问性
- 考虑使用 WebP 格式减小文件体积
- 为图片添加淡入动画：`gsap.from(img, { opacity: 0, duration: 1 })`

##### 4.7 响应式图片策略
- **桌面端（≥1024px）**：使用完整分辨率图片（1920x1080）
- **平板端（768px-1023px）**：使用中分辨率图片（1280x720）
- **移动端（<768px）**：使用低分辨率图片（768x432）或裁剪为中心区域
- 使用 Tailwind 响应式类：`<img className="w-full md:w-1/2 lg:w-1/3" />`
- Hero 背景图在移动端可切换为更简洁的版本

##### 4.8 🟡 Tailwind CSS 响应式断点标准
**🟢 统一使用以下断点进行响应式设计：**

| 断点 | 屏幕宽度 | Tailwind 前缀 | 适用场景 |
|-----|---------|--------------|---------|
| sm | ≥640px | `sm:` | 手机横屏 |
| md | ≥768px | `md:` | 平板竖屏 |
| lg | ≥1024px | `lg:` | 平板横屏/小笔记本 |
| xl | ≥1280px | `xl:` | 桌面显示器 |
| 2xl | ≥1536px | `2xl:` | 大显示器 |

**🟢 示例代码：**
```tsx
// 响应式字体大小
<h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
  企业标题
</h2>

// 响应式布局
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 卡片内容 */}
</div>

// 响应式间距
<section className="py-12 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16">
  {/* 内容 */}
</section>
```

##### 4.9 🟡 TypeScript 类型定义规范
**🟢 所有组件必须严格遵循 TypeScript 类型定义：**

```tsx
// 1. Props 接口定义
interface HeroSectionProps {
  title: string
  subtitle?: string  // 可选属性
  imageUrl: string
  onCtaClick?: () => void  // 回调函数
}

// 2. 组件定义
const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  imageUrl,
  onCtaClick
}) => {
  // ... 组件逻辑
}

// 3. Ref 类型
const sectionRef = useRef<HTMLElement>(null)
const canvasRef = useRef<HTMLCanvasElement>(null)
```

**🔴 禁止的做法：**
- ❌ 使用 `any` 类型（除非绝对必要）
- ❌ Props 不定义类型直接使用
- ❌ 事件处理函数参数类型为 `any`

##### 4.10 GSAP 缓动函数选择
**原则：不同场景使用不同的缓动函数，让动画更自然、更符合用户预期**

| 动画类型 | 推荐缓动函数 | 效果描述 |
|---------|-------------|----------|
| 入场动画 | `power2.out` | 自然减速，舒适流畅 |
| 入场弹跳 | `back.out(1.2)` | 先过头再弹回，有活力 |
| 强调动画 | `elastic.out(1, 0.5)` | 弹性效果，吸引注意 |
| 滚动绑定 | `none` | 与滚动完全同步 |
| 退出动画 | `power2.in` | 快速离开 |
| 加载动画 | `circ.out` | 匀加速旋转 |
| 视差效果 | `power1.out` | 平滑自然 |
| **避免使用** | `linear` | 过于机械，无变化感 |

**示例代码**：
```tsx
// 入场动画 - 自然舒适
gsap.fromTo(element, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })

// 弹跳入场 - 有活力
gsap.fromTo(element, { scale: 0 }, { scale: 1, duration: 0.8, ease: "back.out(1.7)" })

// 滚动同步 - 平滑视差
gsap.to(element, { y: -100, ease: "none", scrollTrigger: { trigger, scrub: 1 } })
```

#### 5. ♿ 可访问性（Accessibility）要求
**原则：网站必须对所有用户友好，包括残障人士和使用辅助技术的用户。**

##### 5.1 键盘导航
- 所有交互元素（按钮、链接、卡片）必须可通过 Tab 键访问
- 焦点状态必须有清晰的视觉反馈（outline 或 box-shadow）
- 避免使用 `tabindex > 0`，保持自然 tab 顺序

##### 5.2 ARIA 标签
- 图片必须添加 `alt` 属性描述内容
- 装饰性图片使用 `alt=""` 或 `role="presentation"`
- 动态内容区域使用 `aria-live="polite"` 通知屏幕阅读器
- 导航栏使用 `<nav>` + `aria-label="主导航"`

##### 5.3 减少动画偏好
- 检测系统偏好：`window.matchMedia("(prefers-reduced-motion: reduce)")`
- 如果用户偏好减少动画，则：
  - 禁用或简化 GSAP 动画（duration 设为 0 或使用 fade-in）
  - 停止 Canvas 粒子/流体动画
  - 保留必要的功能动画（如表单验证反馈）
- 示例代码：
```tsx
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
if (!prefersReducedMotion) {
  gsap.from(element, { opacity: 0, y: 50, duration: 1 })
} else {
  element.style.opacity = "1" // 直接显示
}
```

##### 5.4 颜色对比度
- 文字与背景对比度至少 4.5:1（WCAG AA 标准）
- 大文字（≥18px）对比度至少 3:1
- 避免仅用颜色传达信息（如错误状态同时使用图标+文字）

#### 6. 🔍 SEO 优化
- 每个 Section 使用语义化 HTML 标签（`<section>`, `<article>`, `<header>`）
- 主标题使用 `<h1>`，模块标题使用 `<h2>`，子标题使用 `<h3>`
- 图片 `alt` 属性包含关键词（如 "AI制造企业数字化转型解决方案"）
- 关键内容避免完全依赖 JavaScript 渲染，确保 SSR 友好
- 添加 meta description 和 Open Graph 标签（在 index.html 中）

#### 7. ✅ 生成前检查清单
生成代码前，请确认：
- [ ] 所有标题都与企业的实际业务相关，不是通用模板
- [ ] 文案风格与组件的视觉效果协调一致
- [ ] 使用了具体的行业术语和业务场景描述
- [ ] 每个模块至少有1张图片，首屏和产品模块有2-3张
- [ ] 图片 URL 是 Unsplash 格式且与内容/动画主题匹配
- [ ] Props 传值中的文本内容（如 title、subtitle、imageUrl）已替换为企业真实信息
- [ ] 图片与 GSAP 动画有交互（如滚动时图片缩放/移动/淡入）
- [ ] 动画性能优化：使用 will-change、visibilitychange 监听、GSAP cleanup
- [ ] 可访问性：键盘导航、ARIA 标签、prefers-reduced-motion 支持
- [ ] 响应式：桌面/平板/移动端图片适配、布局断点合理
- [ ] SEO：语义化标签、h1-h6 层级、图片 alt 关键词
- [ ] 错误处理：图片加载失败降级、GSAP 初始化失败备选方案
- [ ] 动画缓动：使用合适的 ease 函数，避免 linear
- [ ] ScrollTrigger 清理：组件卸载时正确 kill 所有动画

#### 8. ⚠️ 常见错误警告（必须避免）
**以下错误会导致动画不工作、性能问题或内存泄漏，请务必避免：**

##### 8.1 GSAP/ScrollTrigger 错误
| 错误写法 | 正确写法 | 说明 |
|---------|---------|------|
| `toggleActions: "play none none none"` | `toggleActions: "play none none reverse"` | 否则动画只播放一次，无法重复触发 |
| 遗漏 `gsap.registerPlugin(ScrollTrigger)` | 组件顶部必须注册 | 否则 ScrollTrigger 不工作 |
| 在 render 中直接执行 GSAP | 必须在 `useEffect` 中执行 | 否则 DOM 未就绪 |
| 忘记清理 ScrollTrigger | `return () => t.kill()` | 否则内存泄漏 |
| `gsap.to(target, {...})` 无 `duration` | 添加 `duration: 0.6` | 否则动画立即完成 |
| 使用 `linear` 缓动 | 使用 `power2.out` 等 | linear 过于机械 |
| `scrub: true` | `scrub: 1` 或 `scrub: "content"` | true 不支持平滑滚动 |

##### 8.2 React Hooks 错误
| 错误写法 | 正确写法 | 说明 |
|---------|---------|------|
| `useEffect(() => { gsap.to(...) })` | `useEffect(() => { gsap.to(...); return () => kill() }, [])` | 必须有依赖数组和清理函数 |
| `useEffect(() => { anim = gsap.to(...) })` | 使用 `useRef` 保存：`const animRef = useRef(); animRef.current = gsap.to(...)` | 避免闭包问题 |
| 在 `useEffect` 外定义 ScrollTrigger | 在 `useEffect` 内创建并清理 | 确保 DOM 就绪 |

##### 8.3 Canvas 错误
| 错误写法 | 正确写法 | 说明 |
|---------|---------|------|
| 直接操作 DOM | 使用 `useRef` 获取 canvas | React 中必须用 ref |
| 在 render 中 `ctx.beginPath()` | 在 `useEffect` 中 `requestAnimationFrame` 循环 | 否则动画不流畅 |
| 遗漏 `canvas.width = container.offsetWidth` | 监听 resize 事件更新尺寸 | 否则 canvas 尺寸不对 |
| 页面隐藏时继续动画 | 监听 `visibilitychange` 暂停 | 否则浪费性能 |

##### 8.4 常见代码示例（正确写法）
```tsx
// ✅ 正确的 ScrollTrigger 使用方式
useEffect(() => {
  gsap.registerPlugin(ScrollTrigger)
  
  const ctx = gsap.context(() => {
    gsap.fromTo(".element",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: ".element", start: "top 80%", toggleActions: "play none none reverse" }
      }
    )
  })
  
  return () => ctx.revert() // ✅ 清理所有动画
}, [])

// ✅ 正确的 Canvas 使用方式
useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext("2d")
  let animationId: number
  
  const resize = () => { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight }
  resize()
  window.addEventListener("resize", resize)
  
  const draw = () => { /* ... */ ; animationId = requestAnimationFrame(draw) }
  draw()
  
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animationId)
    else draw()
  })
  
  return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", resize) }
}, [])
```

#### 9. ✅ 生成后验证清单（重要）
**生成代码后，请逐项检查以下内容，确保动画设计和内容显示正确：**

##### 9.1 ScrollTrigger 设计验证
- [ ] **触发器配置检查**：
  - trigger 元素是否正确指向目标 DOM
  - start/end 位置是否合理（如 "top 80%" 到 "top 10%"）
  - scrub 值是否设置（推荐 1-2，避免 true）
  - toggleActions 是否与 scrub 模式匹配（scrub 模式下应为 "none none none none"）

- [ ] **动画时间线检查**：
  - gsap.timeline 是否正确创建并关联到 ScrollTrigger
  - 动画阶段划分是否清晰（入场、展开、悬浮等）
  - stagger 延迟是否合理，避免所有元素同时动画
  - ease 缓动函数是否合适（避免 linear，推荐 power2.out、expo.out 等）

- [ ] **清理机制检查**：
  - useEffect return 中是否正确调用 scrollTrigger.kill()
  - 是否使用 gsap.context() 包裹动画代码并调用 ctx.revert()
  - Canvas 动画是否正确取消 requestAnimationFrame
  - 页面隐藏时是否暂停动画（visibilitychange 监听）

- [ ] **性能优化检查**：
  - 动画元素是否添加 will-change: transform
  - 是否避免在滚动处理函数中执行昂贵操作
  - 粒子/Canvas 动画是否在不可见时停止
  - 是否使用 transform 而非 top/left 进行位移动画

##### 9.2 内容显示验证
- [ ] **3D 变换检查**：
  - 父容器是否设置 transform-style: preserve-3d
  - perspective 值是否合理（推荐 800-1600px）
  - 子元素的 transform-origin 是否正确
  - backface-visibility 是否按需设置

- [ ] **元素可见性检查**：
  - 初始状态 opacity/scale 是否正确（折叠态 vs 展开态）
  - z-index 层级是否合理，避免元素被遮挡
  - overflow: hidden 是否影响内容显示
  - 响应式断点下内容是否正常显示

- [ ] **文本内容检查**：
  - 标题、描述文案是否与企业信息匹配
  - 文案长度是否适合容器宽度（避免溢出或过短）
  - 字体大小在移动端是否可读（≥14px）
  - 文字颜色与背景对比度是否足够（≥4.5:1）

- [ ] **图片加载检查**：
  - 图片 URL 是否有效（Unsplash 格式）
  - 是否添加 alt 属性和 loading="lazy"
  - 图片尺寸是否适配容器（object-fit: cover）
  - 图片加载失败是否有降级方案

##### 9.3 交互体验验证
- [ ] **滚动行为检查**：
  - 滚动时动画是否流畅（无卡顿、跳跃）
  - 反向滚动时动画是否正确回退
  - 快速滚动时动画是否保持稳定
  - 滚动到不同区域时进度指示是否正确更新

- [ ] **鼠标交互检查**：
  - hover 效果是否正常工作（如有）
  - 点击事件是否可触发（如有按钮/链接）
  - 光标样式是否正确（pointer/default）
  - 焦点状态是否清晰可见（键盘导航）

- [ ] **响应式检查**：
  - 桌面端（≥1024px）：布局完整，动画流畅
  - 平板端（768-1023px）：元素不重叠，文字可读
  - 移动端（<768px）：单列布局，触摸友好
  - 超小屏幕（<480px）：内容不溢出，按钮可点击

##### 9.4 浏览器兼容性验证
- [ ] **现代浏览器测试**：
  - Chrome/Edge：GSAP 动画正常，Canvas 渲染流畅
  - Firefox：3D 变换正确，渐变背景显示正常
  - Safari：iOS 上触摸滚动流畅，prefers-reduced-motion 生效
  - 移动端浏览器：触摸事件正常，性能良好

- [ ] **降级方案检查**：
  - JS 禁用时：内容仍可阅读（SEO 友好）
  - GSAP 加载失败时：有 CSS fallback 动画
  - prefers-reduced-motion 用户：动画简化或禁用
  - 低性能设备：减少粒子数量或禁用复杂效果

##### 9.5 调试工具使用建议
**使用以下工具验证动画质量：**
1. **GSAP DevTools**：安装 Chrome 扩展，实时查看时间线和 ScrollTrigger
2. **Chrome DevTools Performance**：录制滚动过程，检查 FPS 和强制重排
3. **Lighthouse**：运行性能审计，确保评分 ≥90
4. **Responsive Viewer**：同时预览多个断点的显示效果
5. **Accessibility Insights**：检查可访问性问题

##### 9.6 🚀 性能预算（Performance Budget - 必须达标）
🟡 **生成的代码必须满足以下性能指标：**

| 指标 | 目标值 | 测量工具 |
|-----|-------|---------|
| 首屏加载时间（FCP） | < 1.8s | Lighthouse |
| 最大内容绘制（LCP） | < 2.5s | Lighthouse |
| 累积布局偏移（CLS） | < 0.1 | Lighthouse |
| 首次输入延迟（FID） | < 100ms | Lighthouse |
| 动画帧率（FPS） | ≥ 55fps | Chrome DevTools Performance |
| JS Bundle 大小 | < 300KB（gzip） | Webpack Bundle Analyzer |
| CSS 文件大小 | < 50KB（gzip） | Webpack Bundle Analyzer |

**🟡 性能优化强制措施：**
- [ ] 所有图片使用 `loading="lazy"` + `decoding="async"`
- [ ] GSAP 动画使用 `will-change: transform, opacity`
- [ ] Canvas 动画在不可见时暂停（`visibilitychange` 监听）
- [ ] 使用 `React.memo()` 包裹纯展示组件
- [ ] 避免在滚动事件中执行昂贵操作（使用 throttle/debounce）
- [ ] 使用 `IntersectionObserver` 替代部分 ScrollTrigger 场景

##### 9.7 🛡️ 错误边界与降级方案
🟡 **必须为以下场景提供降级方案：**

###### 9.7.1 GSAP 加载失败
```tsx
const [gsapLoaded, setGsapLoaded] = useState(false)

useEffect(() => {
  import("gsap").then(() => {
    setGsapLoaded(true)
  }).catch(() => {
    document.documentElement.classList.add("no-gsap")
  })
}, [])
// CSS fallback
// .no-gsap .animated-element { animation: fadeIn 0.6s ease-out; }
```

###### 9.7.2 图片加载失败
```tsx
const [imgError, setImgError] = useState(false)

<img
  src={imageUrl}
  alt={altText}
  onError={() => setImgError(true)}
  className={imgError ? "fallback-bg" : ""}
/>
```

###### 9.7.3 ScrollTrigger 初始化失败
```tsx
useEffect(() => {
  try {
    gsap.registerPlugin(ScrollTrigger)
    // ... 动画代码
  } catch (error) {
    console.warn("ScrollTrigger 初始化失败，使用简化动画", error)
    gsap.from(element, { opacity: 0, duration: 0.6 })
  })
}, [])
```

**如果发现任何问题，请立即修正并重新验证，直到所有检查项通过。**

### 输出顺序
请按以下顺序输出代码文件（每个文件用 ```tsx 或 ```css 包裹）：
1. tailwind.config.js
2. index.css
3. 各个 React 组件（按依赖顺序）
4. App.tsx
5. main.tsx

================================================================================
💡 提示：请复制上方完整信息到 meoo AI 平台，我将直接为您生成完整的 React 网站代码
================================================================================

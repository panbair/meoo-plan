<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 成就数据 ====================
type Rarity = 'common' | 'rare' | 'epic' | 'legendary'

interface Achievement {
  id: number
  name: string
  desc: string
  icon: string
  category: string
  rarity: Rarity
  progress: number
  maxProgress: number
  unlocked: boolean
  unlockedAt: string | null
}

const rarityConfig: Record<Rarity, { label: string; color: string; glow: string }> = {
  common: { label: '普通', color: '#94a3b8', glow: 'rgba(148, 163, 184, 0.3)' },
  rare: { label: '稀有', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
  epic: { label: '史诗', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
  legendary: { label: '传说', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.5)' },
}

const categories = ['全部', '开发', '学习', '社交', '探索']

const achievements = reactive<Achievement[]>([
  { id: 1, name: '初出茅庐', desc: '完成第一个AI项目部署', icon: '🚀', category: '开发', rarity: 'common', progress: 1, maxProgress: 1, unlocked: true, unlockedAt: '2025-03-15' },
  { id: 2, name: '代码大师', desc: '累计提交10000行代码', icon: '💻', category: '开发', rarity: 'rare', progress: 7800, maxProgress: 10000, unlocked: false, unlockedAt: null },
  { id: 3, name: '学无止境', desc: '完成50个在线课程', icon: '📚', category: '学习', rarity: 'rare', progress: 38, maxProgress: 50, unlocked: false, unlockedAt: null },
  { id: 4, name: '社交蝴蝶', desc: '参加20场技术分享会', icon: '🎤', category: '社交', rarity: 'common', progress: 20, maxProgress: 20, unlocked: true, unlockedAt: '2025-06-20' },
  { id: 5, name: 'Bug终结者', desc: '修复1000个Bug', icon: '🐛', category: '开发', rarity: 'epic', progress: 650, maxProgress: 1000, unlocked: false, unlockedAt: null },
  { id: 6, name: '架构师之路', desc: '设计5个完整系统架构', icon: '🏗️', category: '开发', rarity: 'epic', progress: 3, maxProgress: 5, unlocked: false, unlockedAt: null },
  { id: 7, name: '开源先锋', desc: 'GitHub获得1000星', icon: '⭐', category: '社交', rarity: 'legendary', progress: 420, maxProgress: 1000, unlocked: false, unlockedAt: null },
  { id: 8, name: 'AI深度探索', desc: '训练100个AI模型', icon: '🤖', category: '探索', rarity: 'legendary', progress: 45, maxProgress: 100, unlocked: false, unlockedAt: null },
  { id: 9, name: '持之以恒', desc: '连续30天编程', icon: '🔥', category: '开发', rarity: 'rare', progress: 30, maxProgress: 30, unlocked: true, unlockedAt: '2025-04-10' },
  { id: 10, name: '知识传播者', desc: '发布30篇技术博客', icon: '✍️', category: '学习', rarity: 'epic', progress: 18, maxProgress: 30, unlocked: false, unlockedAt: null },
  { id: 11, name: '全栈勇士', desc: '掌握10种编程语言', icon: '🗡️', category: '学习', rarity: 'legendary', progress: 7, maxProgress: 10, unlocked: false, unlockedAt: null },
  { id: 12, name: '探索未知', desc: '体验所有AI模块', icon: '🧭', category: '探索', rarity: 'common', progress: 8, maxProgress: 12, unlocked: false, unlockedAt: null },
])

// ==================== 状态 ====================
const activeCategory = ref('全部')
const showPopup = ref(false)
const popupAchievement = ref<Achievement | null>(null)
const popupRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const filteredAchievements = computed(() => {
  if (activeCategory.value === '全部') {
    return achievements
  }
  return achievements.filter((a) => a.category === activeCategory.value)
})

const totalUnlocked = computed(() => achievements.filter((a) => a.unlocked).length)
const totalProgress = computed(() => Math.round((totalUnlocked.value / achievements.length) * 100))

// ==================== 解锁动画 ====================
function unlockAchievement(ach: Achievement) {
  if (ach.unlocked) {
    return
  }

  // Force complete progress
  ach.progress = ach.maxProgress
  ach.unlocked = true
  ach.unlockedAt = new Date().toISOString().split('T')[0]

  // Show popup
  popupAchievement.value = ach
  showPopup.value = true

  // Animate popup
  setTimeout(() => {
    if (popupRef.value) {
      const tl = gsap.timeline()

      tl.fromTo(
        popupRef.value,
        { scale: 0, opacity: 0, rotation: -10 },
        { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.5)' },
      )

      // Particle burst on canvas
      spawnParticles(ach)
    }
  }, 50)
}

function closePopup() {
  if (popupRef.value) {
    gsap.to(popupRef.value, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        showPopup.value = false
        popupAchievement.value = null
      },
    })
  }
}

// ==================== 粒子效果 ====================
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  gravity: number
}

const particles: Particle[] = []
let animFrame = 0

function spawnParticles(ach: Achievement) {
  if (!canvasRef.value) {
    return
  }
  const cx = canvasRef.value.width / 2
  const cy = canvasRef.value.height / 2
  const config = rarityConfig[ach.rarity]

  for (let i = 0; i < 60; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = 2 + Math.random() * 6
    particles.push({
      x: cx,
      y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 4,
      alpha: 1,
      color: Math.random() > 0.5 ? config.color : '#ffd700',
      gravity: 0.05,
    })
  }
}

function renderParticles() {
  if (!canvasRef.value) {
    return
  }
  const ctx = canvasRef.value.getContext('2d')
  if (!ctx) {
    return
  }

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.x += p.vx
    p.y += p.vy
    p.vy += p.gravity
    p.alpha -= 0.012

    if (p.alpha <= 0) {
      particles.splice(i, 1)
      continue
    }

    ctx.save()
    ctx.globalAlpha = p.alpha
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.restore()
  }

  if (particles.length > 0 || showPopup.value) {
    animFrame = requestAnimationFrame(renderParticles)
  }
}

// ==================== 进度环 SVG ====================
const ringCircumference = 2 * Math.PI * 45

onMounted(() => {
  if (canvasRef.value) {
    const dpr = window.devicePixelRatio || 1
    canvasRef.value.width = window.innerWidth * dpr
    canvasRef.value.height = window.innerHeight * dpr
    canvasRef.value.style.width = '100%'
    canvasRef.value.style.height = '100%'
    const ctx = canvasRef.value.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
  }

  // Entrance animations for cards
  gsap.fromTo(
    '.ach-card',
    { opacity: 0, y: 30, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.2)' },
  )

  renderParticles()
})
</script>

<template>
  <div class="achievement-system">
    <!-- Particle canvas overlay -->
    <canvas ref="canvasRef" class="particle-canvas"></canvas>

    <div class="header">
      <div class="header-left">
        <h2>🏆 成就系统</h2>
        <p>解锁成就，追踪你的AI开发之旅</p>
      </div>
      <div class="header-right">
        <!-- Progress ring -->
        <svg class="progress-ring" width="80" height="80" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" stroke-width="6" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#3b82f6"
            stroke-width="6"
            stroke-linecap="round"
            :stroke-dasharray="ringCircumference"
            :stroke-dashoffset="ringCircumference * (1 - totalProgress / 100)"
            transform="rotate(-90 50 50)"
            style="transition: stroke-dashoffset 0.6s ease"
          />
          <text x="50" y="46" text-anchor="middle" fill="#e2e8f0" font-size="18" font-weight="bold">
            {{ totalProgress }}%
          </text>
          <text x="50" y="62" text-anchor="middle" fill="#64748b" font-size="10">
            {{ totalUnlocked }}/{{ achievements.length }}
          </text>
        </svg>
      </div>
    </div>

    <!-- Category filter -->
    <div class="categories">
      <button
        v-for="cat in categories"
        :key="cat"
        class="cat-btn"
        :class="{ active: activeCategory === cat }"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Achievement grid -->
    <div class="grid">
      <div
        v-for="ach in filteredAchievements"
        :key="ach.id"
        class="ach-card"
        :class="{ unlocked: ach.unlocked, [ach.rarity]: true }"
        @click="unlockAchievement(ach)"
      >
        <div class="ach-icon">{{ ach.icon }}</div>
        <div class="ach-info">
          <div class="ach-name">{{ ach.name }}</div>
          <div class="ach-desc">{{ ach.desc }}</div>
          <div class="ach-progress-bar">
            <div
              class="ach-progress-fill"
              :style="{
                width: (ach.progress / ach.maxProgress) * 100 + '%',
                backgroundColor: rarityConfig[ach.rarity].color,
              }"
            ></div>
          </div>
          <div class="ach-meta">
            <span
              class="ach-rarity"
              :style="{ color: rarityConfig[ach.rarity].color }"
            >
              {{ rarityConfig[ach.rarity].label }}
            </span>
            <span class="ach-count">{{ ach.progress }}/{{ ach.maxProgress }}</span>
          </div>
        </div>
        <div v-if="ach.unlocked" class="ach-check">✅</div>
        <div v-else class="ach-lock">🔒</div>
      </div>
    </div>

    <!-- Unlock popup -->
    <div v-if="showPopup" class="popup-overlay" @click.self="closePopup">
      <div ref="popupRef" class="popup">
        <div
          class="popup-glow"
          :style="{ background: popupAchievement ? rarityConfig[popupAchievement.rarity].glow : '' }"
        ></div>
        <div class="popup-content" v-if="popupAchievement">
          <div class="popup-title">🎉 成就解锁！</div>
          <div class="popup-icon">{{ popupAchievement.icon }}</div>
          <div class="popup-name">{{ popupAchievement.name }}</div>
          <div class="popup-desc">{{ popupAchievement.desc }}</div>
          <div
            class="popup-rarity"
            :style="{ color: rarityConfig[popupAchievement.rarity].color }"
          >
            {{ rarityConfig[popupAchievement.rarity].label }}
          </div>
          <button class="popup-close" @click="closePopup">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.achievement-system {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  position: relative;
  overflow-y: auto;
  font-family: 'Microsoft YaHei', sans-serif;
  padding: 24px 40px;
  box-sizing: border-box;
}

.particle-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 100;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  color: #e2e8f0;
  font-size: 24px;
  margin: 0;
}

.header p {
  color: #64748b;
  font-size: 13px;
  margin: 4px 0 0;
}

.categories {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.cat-btn {
  padding: 6px 18px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.cat-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.cat-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: #fff;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
}

.ach-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}

.ach-card:hover {
  border-color: #334155;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.ach-card:not(.unlocked) {
  filter: saturate(0.3);
  opacity: 0.7;
}

.ach-card.unlocked {
  filter: none;
  opacity: 1;
}

.ach-card.legendary.unlocked {
  border-color: rgba(245, 158, 11, 0.4);
}

.ach-card.epic.unlocked {
  border-color: rgba(168, 85, 247, 0.3);
}

.ach-icon {
  font-size: 36px;
  flex-shrink: 0;
}

.ach-info {
  flex: 1;
  min-width: 0;
}

.ach-name {
  color: #e2e8f0;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: 2px;
}

.ach-desc {
  color: #64748b;
  font-size: 12px;
  margin-bottom: 8px;
}

.ach-progress-bar {
  width: 100%;
  height: 4px;
  background: #1e293b;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.ach-progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.6s ease;
}

.ach-meta {
  display: flex;
  justify-content: space-between;
}

.ach-rarity {
  font-size: 11px;
  font-weight: bold;
}

.ach-count {
  color: #475569;
  font-size: 11px;
}

.ach-check,
.ach-lock {
  font-size: 20px;
  flex-shrink: 0;
}

/* Popup */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 90;
}

.popup {
  position: relative;
  background: #111827;
  border: 2px solid #334155;
  border-radius: 20px;
  padding: 40px 50px;
  text-align: center;
  min-width: 320px;
  overflow: hidden;
}

.popup-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.popup-content {
  position: relative;
  z-index: 1;
}

.popup-title {
  color: #ffd700;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.popup-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.popup-name {
  color: #e2e8f0;
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 6px;
}

.popup-desc {
  color: #94a3b8;
  font-size: 14px;
  margin-bottom: 12px;
}

.popup-rarity {
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 20px;
}

.popup-close {
  padding: 8px 32px;
  background: #3b82f6;
  border: none;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.popup-close:hover {
  background: #2563eb;
}
</style>


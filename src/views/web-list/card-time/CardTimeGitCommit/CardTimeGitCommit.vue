<template>
  <section ref="containerRef" class="git-section">
    <div class="git-bg"><div class="code-rain"></div></div>
    <div ref="headerRef" class="git-header">
      <div ref="badgeRef" class="git-badge"><span>⑂</span><span>VERSION CONTROL</span></div>
      <h1 ref="titleRef" class="git-title">GIT COMMIT</h1>
      <p ref="subtitleRef" class="git-subtitle">分支树 · 提交历史 · 合并节点</p>
    </div>
    <div ref="treeRef" class="git-tree">
      <!-- SVG分支线 -->
      <svg ref="svgRef" class="branch-lines" viewBox="0 0 700 420">
        <!-- main分支 -->
        <path ref="mainPathRef" d="M100,30 L100,390" fill="none" stroke="#4ade80" stroke-width="3" stroke-dasharray="400" stroke-dashoffset="400"/>
        <!-- feature分支 -->
        <path ref="featurePathRef" d="M100,120 C150,120 180,80 250,80 L450,80 C500,80 530,120 530,150" fill="none" stroke="#60a5fa" stroke-width="2.5" stroke-dasharray="500" stroke-dashoffset="500"/>
        <!-- hotfix分支 -->
        <path ref="hotfixPathRef" d="M100,240 C140,240 160,300 220,300 L350,300 C400,300 420,270 420,240" fill="none" stroke="#f87171" stroke-width="2.5" stroke-dasharray="400" stroke-dashoffset="400"/>
      </svg>
      <!-- Commit节点+卡片 -->
      <div v-for="(commit, i) in commits" :key="i"
        :ref="el => commitRefs[i] = el as HTMLElement"
        class="commit-node" :style="{ left: commit.x + 'px', top: commit.y + 'px' }">
        <div class="node-dot" :style="{ background: commit.color, boxShadow: `0 0 12px ${commit.color}40` }"></div>
        <div class="commit-card" :style="{ '--branch-color': commit.color }">
          <div class="card-hash">{{ commit.hash }}</div>
          <h3 class="card-msg">{{ commit.msg }}</h3>
          <div class="card-meta">
            <span class="card-author">{{ commit.author }}</span>
            <span class="card-branch">{{ commit.branch }}</span>
          </div>
        </div>
      </div>
      <!-- HEAD指针 -->
      <div ref="headRef" class="head-pointer" :style="{ top: '30px', left: '70px' }">
        <span class="head-label">HEAD</span>
        <span class="head-arrow">→</span>
      </div>
    </div>
    <div ref="footerRef" class="git-footer">
      <div class="git-stats">
        <span class="stat"><span class="s-icon" style="color:#4ade80">●</span> main</span>
        <span class="stat"><span class="s-icon" style="color:#60a5fa">●</span> feature</span>
        <span class="stat"><span class="s-icon" style="color:#f87171">●</span> hotfix</span>
      </div>
      <span class="footer-text">git log --graph --oneline</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const containerRef = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const badgeRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const treeRef = ref<HTMLElement | null>(null)
const svgRef = ref<SVGElement | null>(null)
const mainPathRef = ref<SVGPathElement | null>(null)
const featurePathRef = ref<SVGPathElement | null>(null)
const hotfixPathRef = ref<SVGPathElement | null>(null)
const headRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const commitRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const commits = [
  { x: 80, y: 20, hash: 'a1b2c3d', msg: 'Initial commit', author: 'dev', branch: 'main', color: '#4ade80' },
  { x: 80, y: 100, hash: 'e4f5g6h', msg: 'Add core module', author: 'dev', branch: 'main', color: '#4ade80' },
  { x: 230, y: 60, hash: 'i7j8k9l', msg: 'Feature: UI system', author: 'alice', branch: 'feature', color: '#60a5fa' },
  { x: 80, y: 180, hash: 'm0n1o2p', msg: 'Update configs', author: 'dev', branch: 'main', color: '#4ade80' },
  { x: 380, y: 60, hash: 'q3r4s5t', msg: 'Feature: Animations', author: 'alice', branch: 'feature', color: '#60a5fa' },
  { x: 80, y: 230, hash: 'u6v7w8x', msg: 'Fix: Critical bug', author: 'bob', branch: 'main', color: '#4ade80' },
  { x: 200, y: 285, hash: 'y9z0a1b', msg: 'Hotfix: Security', author: 'bob', branch: 'hotfix', color: '#f87171' },
  { x: 510, y: 135, hash: 'c2d3e4f', msg: 'Merge feature→main', author: 'dev', branch: 'merge', color: '#fbbf24' },
  { x: 400, y: 225, hash: 'g5h6i7j', msg: 'Merge hotfix→main', author: 'dev', branch: 'merge', color: '#fbbf24' },
  { x: 80, y: 370, hash: 'k8l9m0n', msg: 'Release v2.0', author: 'dev', branch: 'main', color: '#4ade80' },
]

onMounted(() => {
  if (!containerRef.value) return
  const allCommits = commitRefs.value.filter(Boolean) as HTMLElement[]

  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -30, filter: 'blur(10px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 20 })
  gsap.set(allCommits, { opacity: 0, scale: 0 })
  gsap.set(headRef.value, { opacity: 0, x: -20 })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, stagger: 0.1, ease: 'power3.out'
  }).to(footerRef.value, { opacity: 1, y: 0, duration: 0.4 }, '-=0.2')
  cleanupFns.push(() => introTl.kill())

  // Git tree animation
  const gitTl = gsap.timeline({
    scrollTrigger: { trigger: treeRef.value, start: 'top 75%', end: 'top 10%', scrub: 1.5, immediateRender: false }
  })

  // Draw main branch
  gitTl.to(mainPathRef.value, { strokeDashoffset: 0, duration: 0.5, ease: 'none' }, 0)
  // Draw feature branch
  gitTl.to(featurePathRef.value, { strokeDashoffset: 0, duration: 0.3, ease: 'none' }, 0.15)
  // Draw hotfix branch
  gitTl.to(hotfixPathRef.value, { strokeDashoffset: 0, duration: 0.25, ease: 'none' }, 0.35)

  // Commits appear along the branches
  allCommits.forEach((c, i) => {
    gitTl.to(c, {
      opacity: 1, scale: 1, duration: 0.08, ease: 'back.out(2)'
    }, 0.05 + i * 0.08)
  })

  // HEAD pointer follows
  gitTl.to(headRef.value, { opacity: 1, x: 0, duration: 0.1 }, 0.05)
  gitTl.to(headRef.value, { top: '370px', duration: 0.8, ease: 'none' }, 0.1)

  cleanupFns.push(() => gitTl.kill())

  // Pulse glow on merge commits
  allCommits.forEach((c, i) => {
    if (commits[i].branch === 'merge') {
      const dot = c.querySelector('.node-dot')
      if (dot) {
        const tw = gsap.to(dot, { scale: 1.4, duration: 1, repeat: -1, yoyo: true, ease: 'sine.inOut' })
        cleanupFns.push(() => tw.kill())
      }
    }
  })
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.git-section {
  width: 100vw; height: 100vh;
  background: 
    radial-gradient(circle at 50% 50%, rgba(74,222,128,0.06) 0%, transparent 50%),
    linear-gradient(180deg, #0d1117 0%, #161b22 50%, #0d1117 100%);
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.git-bg {
  position: absolute; inset: 0; pointer-events: none;
  .code-rain {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(74,222,128,0.03) 1px, transparent 1px);
    background-size: 100% 24px;
  }
}
.git-header {
  position: relative; z-index: 10; text-align: center; margin-bottom: 50px;
  .git-badge {
    display: inline-flex; align-items: center; gap: 8px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(74,222,128,0.2);
    background: linear-gradient(135deg, rgba(74,222,128,0.08), rgba(60,200,110,0.04));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(74,222,128,0.12),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 16px;
    font-size: 11px; letter-spacing: 6px; 
    color: rgba(90,230,140,0.85);
    transition: all 0.3s ease;
    span:first-child { 
      font-size: 16px;
      filter: drop-shadow(0 0 10px rgba(74,222,128,0.6));
    }
    &:hover {
      border-color: rgba(90,240,150,0.35);
      box-shadow: 0 6px 30px rgba(74,222,128,0.18);
      transform: translateY(-2px);
    }
  }
  .git-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    font-family: 'Courier New', monospace;
    background: linear-gradient(135deg, #4ade80 0%, #60a5fa 50%, #4ade80 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 12px;
    filter: drop-shadow(0 0 50px rgba(74,222,128,0.4));
    animation: gitGlow 3s ease-in-out infinite alternate;
  }
  .git-subtitle { 
    font-size: 16px; 
    color: rgba(150,170,190,0.65); 
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    font-family: 'Courier New', monospace;
    text-shadow: 0 0 20px rgba(74,222,128,0.2);
  }
}
.git-tree {
  position: relative; z-index: 10; width: 700px; height: 420px;
}
.branch-lines {
  position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
  filter: drop-shadow(0 0 8px rgba(74,222,128,0.2));
}
.commit-node {
  position: absolute; display: flex; align-items: center; gap: 12px;
  transition: transform 0.3s ease;
  .node-dot {
    width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
    border: 2px solid rgba(255,255,255,0.15);
    box-shadow: 0 0 15px currentColor;
  }
  .commit-card {
    padding: 10px 14px; border-radius: 24px;
    background: linear-gradient(145deg, rgba(22,27,34,0.96), rgba(18,22,28,0.98));
    border: 1px solid color-mix(in srgb, var(--branch-color) 18%, transparent);
    box-shadow: 
      0 4px 16px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.05);
    min-width: 150px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    .card-hash {
      font-size: 10px; font-family: 'Courier New', monospace;
      color: rgba(150,170,190,0.55); letter-spacing: 2px;
      font-weight: 600;
    }
    .card-msg { 
      font-size: 21px; 
      font-weight: 700; 
      color: rgba(230,240,250,0.95); 
      margin: 3px 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.3);
    }
    .card-meta {
      display: flex; justify-content: space-between; gap: 10px;
      .card-author { 
        font-size: 10px; 
        color: rgba(150,170,190,0.5);
        font-weight: 500;
      }
      .card-branch {
        font-size: 9px; padding: 2px 8px; border-radius: 6px;
        background: color-mix(in srgb, var(--branch-color) 12%, transparent);
        color: var(--branch-color); letter-spacing: 2px;
        font-weight: 600;
        border: 1px solid color-mix(in srgb, var(--branch-color) 15%, transparent);
      }
    }
  }
  &:hover {
    transform: scale(1.03);
    .commit-card {
      border-color: color-mix(in srgb, var(--branch-color) 30%, transparent);
      box-shadow: 
        0 6px 24px color-mix(in srgb, var(--branch-color) 15%, transparent),
        inset 0 1px 0 rgba(255,255,255,0.08);
    }
  }
}
.head-pointer {
  position: absolute; display: flex; align-items: center; gap: 6px;
  .head-label {
    font-size: 11px; font-weight: 800; color: #fbbf24;
    padding: 3px 10px; border-radius: 6px;
    background: linear-gradient(135deg, rgba(251,191,36,0.12), rgba(251,191,36,0.06));
    border: 1px solid rgba(251,191,36,0.25);
    font-family: 'Courier New', monospace;
    box-shadow: 0 0 15px rgba(251,191,36,0.2);
    letter-spacing: 2px;
  }
  .head-arrow { color: #fbbf24; font-size: 14px; text-shadow: 0 0 10px rgba(251,191,36,0.5); }
}
.git-footer {
  position: relative; z-index: 10; margin-top: 50px; text-align: center;
  .git-stats {
    display: flex; gap: 20px; justify-content: center; margin-bottom: 10px;
    .stat {
      font-size: 14px; color: rgba(150,170,190,0.6); font-family: 'Courier New', monospace;
      display: flex; align-items: center; gap: 6px;
      padding: 6px 12px;
      background: rgba(22,27,34,0.5);
      border-radius: 8px;
      border: 1px solid rgba(74,222,128,0.08);
      transition: all 0.2s;
      &:hover {
        border-color: rgba(74,222,128,0.2);
        background: rgba(74,222,128,0.05);
      }
      .s-icon { font-size: 9px; }
    }
  }
  .footer-text { 
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(150,170,190,0.45);
    font-family: 'Courier New', monospace;
    font-weight: 500;
    text-shadow: 0 0 15px rgba(74,222,128,0.15);
  }
}
@keyframes gitGlow {
  0% { filter: drop-shadow(0 0 40px rgba(74,222,128,0.35)); }
  100% { filter: drop-shadow(0 0 60px rgba(74,222,128,0.5)); }
}
</style>


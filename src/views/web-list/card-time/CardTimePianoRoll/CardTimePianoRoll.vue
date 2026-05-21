<template>
  <section ref="containerRef" class="piano-roll-section">
    <div class="piano-bg">
      <div class="studio-ambient"></div>
    </div>
    <div class="piano-content">
      <div ref="headerRef" class="piano-header">
        <div ref="badgeRef" class="piano-badge">
          <span class="badge-icon">🎹</span>
          <span>PIANO ROLL</span>
        </div>
        <h1 ref="titleRef" class="piano-title">PIANO ROLL</h1>
        <p ref="subtitleRef" class="piano-subtitle">MIDI编辑 · 音符触发 · 钢琴卷帘</p>
      </div>

      <div ref="rollRef" class="roll-container">
        <!-- 时间刻度 -->
        <div class="timeline-ruler">
          <span v-for="i in 16" :key="'t'+i" class="tick">{{ i }}</span>
        </div>
        <!-- 播放线 -->
        <div ref="playheadRef" class="playhead"></div>
        <!-- 钢琴键盘 -->
        <div class="keyboard">
          <div v-for="(key, ki) in keys" :key="'k'+ki"
            :ref="el => keyRefs[ki] = el as HTMLElement"
            class="piano-key" :class="{ black: key.black }">
            <span class="key-label">{{ key.note }}</span>
          </div>
        </div>
        <!-- 音符网格 -->
        <div class="note-grid">
          <div class="grid-lines">
            <span v-for="i in 7" :key="'gl'+i" class="grid-row"></span>
          </div>
          <!-- 音符卡片 -->
          <div v-for="(note, i) in notes" :key="'n'+i"
            :ref="el => noteRefs[i] = el as HTMLElement"
            class="note-block"
            :style="{ '--note-row': note.row, '--note-col': note.col, '--note-len': note.len, '--note-hue': note.hue }">
            <div class="note-inner">
              <span class="note-label">{{ note.title }}</span>
              <span class="note-sub">{{ note.desc }}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref="footerRef" class="piano-footer">
        <div class="transport-controls">
          <span class="ctrl">⏮</span>
          <span class="ctrl play">▶</span>
          <span class="ctrl">⏭</span>
          <span class="ctrl">⏹</span>
        </div>
        <p class="footer-text">SCROLL TO PLAYBACK</p>
      </div>
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
const rollRef = ref<HTMLElement | null>(null)
const playheadRef = ref<HTMLElement | null>(null)
const footerRef = ref<HTMLElement | null>(null)
const noteRefs = ref<(HTMLElement | null)[]>([])
const keyRefs = ref<(HTMLElement | null)[]>([])
const cleanupFns: (() => void)[] = []

const keys = [
  { note: 'C5', black: false }, { note: 'B4', black: false }, { note: 'A#', black: true },
  { note: 'A4', black: false }, { note: 'G#', black: true }, { note: 'G4', black: false },
  { note: 'F4', black: false },
]

const notes = [
  { title: 'Melody', desc: '主旋律', row: 0, col: 1, len: 3, hue: 260 },
  { title: 'Chord', desc: '和弦', row: 3, col: 1, len: 4, hue: 200 },
  { title: 'Bass', desc: '贝斯', row: 6, col: 2, len: 2, hue: 320 },
  { title: 'Lead', desc: '先导', row: 1, col: 5, len: 3, hue: 160 },
  { title: 'Pad', desc: '铺底', row: 4, col: 4, len: 5, hue: 40 },
  { title: 'Arp', desc: '琶音', row: 2, col: 8, len: 2, hue: 280 },
  { title: 'Stab', desc: '插针', row: 5, col: 7, len: 1, hue: 120 },
  { title: 'Fill', desc: '过门', row: 0, col: 10, len: 4, hue: 350 },
]

onMounted(() => {
  if (!containerRef.value) return
  gsap.set([badgeRef.value, titleRef.value, subtitleRef.value], { opacity: 0, y: -40, filter: 'blur(12px)' })
  gsap.set(footerRef.value, { opacity: 0, y: 30 })
  const allNotes = noteRefs.value.filter(Boolean) as HTMLElement[]
  gsap.set(allNotes, { opacity: 0, scaleX: 0, transformOrigin: 'left center' })

  const introTl = gsap.timeline({
    scrollTrigger: { trigger: containerRef.value, start: 'top 85%', toggleActions: 'play none none none' }
  })
  introTl.to([badgeRef.value, titleRef.value, subtitleRef.value], {
    opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8, stagger: 0.12, ease: 'power3.out'
  })
  .to(allNotes, { opacity: 1, scaleX: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(1.2)' }, '-=0.4')
  .to(footerRef.value, { opacity: 1, y: 0, duration: 0.5 }, '-=0.3')
  cleanupFns.push(() => introTl.kill())

  // Playhead scroll
  const phTl = gsap.timeline({
    scrollTrigger: { trigger: rollRef.value, start: 'top 70%', end: 'top 10%', scrub: 1, immediateRender: false }
  })
  phTl.fromTo(playheadRef.value, { left: '60px' }, { left: '100%', duration: 1, ease: 'none' })

  // Highlight keys as playhead passes notes
  allNotes.forEach((note, i) => {
    const n = notes[i]
    const startPct = (60 + n.col * 60) / 900
    phTl.to(note, { filter: 'brightness(1.5)', duration: 0.05, ease: 'power2.out' }, startPct)
    phTl.to(note, { filter: 'brightness(1)', duration: 0.1 }, startPct + 0.05)
    // Key highlight
    if (keyRefs.value[n.row]) {
      phTl.to(keyRefs.value[n.row], { background: 'rgba(147,51,234,0.3)', duration: 0.05 }, startPct)
      phTl.to(keyRefs.value[n.row], { background: 'rgba(147,51,234,0)', duration: 0.1 }, startPct + 0.05)
    }
  })

  cleanupFns.push(() => phTl.kill())
})

onUnmounted(() => {
  cleanupFns.forEach(fn => fn())
  ScrollTrigger.getAll().forEach(st => st.kill())
})
</script>

<style scoped lang="scss">
.piano-roll-section {
  width: 100vw;
  height: 100vh;
  background:
    radial-gradient(circle at 50% 30%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #0a0a14 0%, #0f0e1a 50%, #0a0a14 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.piano-bg {
  position: absolute; inset: 0; pointer-events: none;
  .studio-ambient {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(99, 102, 241, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(99, 102, 241, 0.02) 1px, transparent 1px);
    background-size: 60px 40px;
  }
}

.piano-content {
  position: relative; z-index: 10;
  text-align: center; padding: 40px;
  max-width: 1200px; width: 100%;
}

.piano-header {
  margin-bottom: 40px;

  .piano-badge {
    display: inline-flex; align-items: center; gap: 10px; padding: 12px 32px;
    border-radius: 50px; 
    border: 1px solid rgba(99, 102, 241, 0.35);
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(79, 82, 221, 0.05));
    backdrop-filter: blur(12px);
    box-shadow: 
      0 4px 20px rgba(99, 102, 241, 0.15),
      inset 0 1px 0 rgba(255,255,255,0.06);
    margin-bottom: 24px; font-size: 11px; letter-spacing: 6px;
    color: rgba(175, 190, 252, 0.95);
    transition: all 0.3s ease;
    .badge-icon { 
      font-size: 18px;
      filter: drop-shadow(0 0 10px rgba(99, 102, 241, 0.6));
    }
    &:hover {
      border-color: rgba(129, 132, 251, 0.5);
      box-shadow: 0 6px 30px rgba(99, 102, 241, 0.25);
      transform: translateY(-2px);
    }
  }

  .piano-title {
    font-size: clamp(52px, 7.5vw, 88px); 
    font-weight: 900; 
    letter-spacing: 10px;
    background: linear-gradient(180deg, #ffffff 0%, #b5c5fc 30%, #8590f1 60%, #6366f1 100%);
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 0 0 16px; 
    filter: drop-shadow(0 0 60px rgba(99, 102, 241, 0.5));
    animation: pianoGlow 3s ease-in-out infinite alternate;
  }

  .piano-subtitle {
    font-size: 16px; 
    color: rgba(200, 210, 255, 0.6);
    letter-spacing: 8px;
    font-weight: 300;
    margin: 0;
    text-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  }
}

.roll-container {
  position: relative;
  background: rgba(12, 10, 20, 0.85);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0;
  overflow: hidden;
  min-height: 340px;
  display: flex;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255,255,255,0.05);
}

.timeline-ruler {
  position: absolute; top: 0; left: 60px; right: 0; height: 28px;
  display: flex; border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(20, 18, 32, 0.9);
  .tick {
    flex: 1; font-size: 10px; color: rgba(255, 255, 255, 0.25);
    display: flex; align-items: center; justify-content: center;
    border-right: 1px solid rgba(255, 255, 255, 0.04);
    font-weight: 500;
  }
}

.playhead {
  position: absolute; top: 0; bottom: 0; width: 3px;
  background: linear-gradient(180deg, #ef4444, rgba(239, 68, 68, 0.4));
  box-shadow: 
    0 0 15px rgba(239, 68, 68, 0.5),
    0 0 30px rgba(239, 68, 68, 0.3);
  z-index: 20; left: 60px;
}

.keyboard {
  width: 60px; flex-shrink: 0; display: flex; flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: 28px;

  .piano-key {
    flex: 1; min-height: 44px;
    display: flex; align-items: center; justify-content: flex-end;
    padding-right: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(240, 240, 255, 0.05);
    transition: all 0.2s ease;

    &.black {
      background: rgba(20, 18, 32, 0.95);
      .key-label { color: rgba(255, 255, 255, 0.35); }
    }

    .key-label { 
      font-size: 10px; 
      color: rgba(255, 255, 255, 0.25); 
      font-family: 'Courier New', monospace;
      font-weight: 600;
    }
    
    &:hover {
      background: rgba(99, 102, 241, 0.1);
    }
  }
}

.note-grid {
  flex: 1; position: relative; margin-top: 28px;

  .grid-lines {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    .grid-row {
      flex: 1; border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
  }
}

.note-block {
  position: absolute;
  top: calc(var(--note-row) * (100% / 7));
  left: calc(var(--note-col) * 60px);
  width: calc(var(--note-len) * 60px);
  height: calc(100% / 7 - 2px);
  padding: 2px;

  .note-inner {
    width: 100%; height: 100%; border-radius: 10px;
    background: linear-gradient(135deg,
      hsla(var(--note-hue), 65%, 55%, 0.75),
      hsla(var(--note-hue), 55%, 40%, 0.85));
    border: 1px solid hsla(var(--note-hue), 65%, 65%, 0.35);
    display: flex; flex-direction: column;
    justify-content: center; padding: 6px 12px;
    overflow: hidden; cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 
      0 2px 12px hsla(var(--note-hue), 60%, 50%, 0.2),
      inset 0 1px 0 rgba(255,255,255,0.1);

    .note-label {
      font-size: 12px; 
      font-weight: 800; 
      color: rgba(255, 255, 255, 0.98);
      letter-spacing: 1px;
      text-shadow: 0 0 10px rgba(255,255,255,0.2);
    }
    .note-sub { 
      font-size: 10px; 
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
    }

    &:hover {
      border-color: hsla(var(--note-hue), 75%, 75%, 0.6);
      box-shadow: 
        0 4px 20px hsla(var(--note-hue), 60%, 50%, 0.4),
        inset 0 1px 0 rgba(255,255,255,0.15);
      transform: scale(1.02);
    }
  }
}

.piano-footer {
  margin-top: 40px;

  .transport-controls {
    display: flex; gap: 12px; justify-content: center; margin-bottom: 18px;
    .ctrl {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 16px; color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      cursor: pointer; transition: all 0.2s ease;

      &.play {
        color: rgba(99, 102, 241, 0.95);
        background: rgba(99, 102, 241, 0.12);
        border-color: rgba(99, 102, 241, 0.35);
        box-shadow: 0 0 15px rgba(99, 102, 241, 0.2);
      }
      &:hover { 
        transform: scale(1.1);
        box-shadow: 0 0 20px rgba(255,255,255,0.1);
      }
    }
  }

  .footer-text {
    font-size: 14px; 
    letter-spacing: 4px; 
    color: rgba(200, 210, 255, 0.5);
    font-weight: 500;
    margin: 0;
    text-shadow: 0 0 15px rgba(99, 102, 241, 0.15);
  }
}

@keyframes pianoGlow {
  0% { filter: drop-shadow(0 0 50px rgba(99, 102, 241, 0.45)); }
  100% { filter: drop-shadow(0 0 70px rgba(99, 102, 241, 0.6)); }
}
</style>



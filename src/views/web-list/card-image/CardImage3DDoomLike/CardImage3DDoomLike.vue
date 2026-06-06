<template>
  <section ref="rootRef" class="doom-root" @click="onShoot">
    <div class="doom-scanlines"></div>
    <div class="doom-vignette"></div>

    <div class="doom-hud__top">
      <span class="doom-hud__ammo">🔫 AMMO {{ ammo }}/50</span>
      <span class="doom-hud__score">KILLS {{ kills }}</span>
      <span class="doom-hud__fps">60 FPS</span>
    </div>
    <div class="doom-hud__bottom">
      <div class="doom-hud__health-bar"><div class="doom-hud__health-fill" :style="{ width: health + '%' }"></div></div>
      <span class="doom-hud__health-text">{{ health }}%</span>
      <div class="doom-hud__face">{{ health > 60 ? '😀' : health > 30 ? '😐' : '😵' }}</div>
    </div>
    <div class="doom-crosshair">+</div>
    <div ref="damageFlash" class="doom-damage-flash"></div>

    <div ref="scrollRef" class="doom-scroll">
      <div ref="trackRef" class="doom-track" :style="{ height: trackHeight }">
        <div class="doom-sticky">

          <div class="doom-world">
            <div ref="playerRef" class="doom-player">

              <div class="doom-corridor">
                <div class="doom-surface doom-ceiling">
                  <img :src="textures.ceiling" alt="" class="doom-tex" />
                </div>
                <div class="doom-surface doom-floor">
                  <img :src="textures.floor" alt="" class="doom-tex" />
                </div>
                <div class="doom-surface doom-wall-left">
                  <img :src="textures.wall" alt="" class="doom-tex" />
                </div>
                <div class="doom-surface doom-wall-right">
                  <img :src="textures.wall" alt="" class="doom-tex" />
                </div>
                <div class="doom-surface doom-wall-far">
                  <img :src="textures.farWall" alt="" class="doom-tex" />
                  <div class="doom-wall-far__glow"></div>
                </div>
              </div>

              <div class="doom-decor doom-decor--left1" :style="{ transform: `translateZ(-1000px) translateX(-780px) translateY(-60px)` }">
                <img :src="textures.poster1" alt="" class="doom-decor__img" />
              </div>
              <div class="doom-decor doom-decor--right1" :style="{ transform: `translateZ(-1800px) translateX(780px) translateY(40px)` }">
                <img :src="textures.poster2" alt="" class="doom-decor__img" />
              </div>
              <div class="doom-decor doom-decor--left2" :style="{ transform: `translateZ(-2800px) translateX(-780px) translateY(-100px)` }">
                <img :src="textures.poster3" alt="" class="doom-decor__img" />
              </div>

              <div
                v-for="enemy in enemies"
                :key="enemy.id"
                :ref="el => { enemyRefs[enemy.id] = el as HTMLElement | null }"
                class="doom-enemy"
                :class="{ 'doom-enemy--dead': enemy.dead }"
                :style="{ transform: `translateZ(${enemy.z}px) translateX(${enemy.x}px) translateY(${enemy.y}px)` }"
              >
                <div class="doom-enemy__card">
                  <img :src="enemy.dead ? textures.deadEnemy : textures.enemy" :alt="''" class="doom-enemy__img" />
                  <div class="doom-enemy__hp" v-if="!enemy.dead">
                    <div class="doom-enemy__hp-fill" :style="{ width: (enemy.hp / enemy.maxHp * 100) + '%' }"></div>
                  </div>
                </div>
                <div class="doom-enemy__shadow"></div>
              </div>

              <div
                v-for="item in pickups"
                :key="item.id"
                class="doom-pickup"
                :style="{ transform: `translateZ(${item.z}px) translateX(${item.x}px) translateY(${item.y}px)` }"
              >
                <img :src="item.icon" :alt="''" class="doom-pickup__img" />
              </div>
            </div>
          </div>

          <div class="doom-hint">
            <span>⬆ 向下滚动前进 ⬆</span>
            <span>🖱 点击射击 👾</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

type TweenCleanup = () => void

const textures = {
  ceiling: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=60',
  floor:   'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&q=60',
  wall:    'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1000&q=60',
  farWall: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=60',
  enemy:   'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&q=80',
  deadEnemy: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500&q=80',
  poster1: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80',
  poster2: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80',
  poster3: 'https://images.unsplash.com/photo-1480497490787-505ec076689f?w=400&q=80',
}

const health = ref(100); const ammo = ref(50); const kills = ref(0)

interface Enemy { id: number; x: number; y: number; z: number; dead: boolean; hp: number; maxHp: number }
const enemies = reactive<Enemy[]>([
  { id: 0, x: -150, y: 10, z: -1500, dead: false, hp: 3, maxHp: 3 },
  { id: 1, x: 110, y: 30, z: -950,  dead: false, hp: 2, maxHp: 2 },
  { id: 2, x: -80, y: -15, z: -550, dead: false, hp: 5, maxHp: 5 },
])

interface Pickup { id: number; x: number; y: number; z: number; icon: string; collected: boolean }
const pickups = reactive<Pickup[]>([
  { id: 0, x: 90, y: 10, z: -1300, icon: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=120&q=80', collected: false },
  { id: 1, x: -100, y: -10, z: -750, icon: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=120&q=80', collected: false },
])

const STAGES = 10; const trackHeight = `${(STAGES + 1) * 100}vh`
const rootRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)
const playerRef = ref<HTMLElement | null>(null)
const damageFlash = ref<HTMLElement | null>(null)
const enemyRefs = ref<(HTMLElement | null)[]>(Array(3).fill(null))
const cleanupFns: TweenCleanup[] = []

function onShoot() {
  if (ammo.value <= 0) return; ammo.value--
  let closest: Enemy | null = null; let cd = Infinity
  enemies.forEach(e => { if (!e.dead && Math.abs(e.z) < cd) { cd = Math.abs(e.z); closest = e } })
  if (closest && cd < 1000) { closest.hp--; if (closest.hp <= 0) { closest.dead = true; kills.value++ } }
  if (damageFlash.value) { damageFlash.value.style.opacity = '0.12'; setTimeout(() => { if (damageFlash.value) damageFlash.value.style.opacity = '0' }, 60) }
}

function checkCollisions(pz: number) {
  enemies.forEach(e => { if (!e.dead && Math.abs(e.z - pz) < 110 && Math.abs(e.x) < 120) { health.value = Math.max(0, health.value - 2); if (damageFlash.value) { damageFlash.value.style.opacity = '0.25'; setTimeout(() => { if (damageFlash.value) damageFlash.value.style.opacity = '0' }, 120) } } })
  pickups.forEach(p => { if (!p.collected && Math.abs(p.z - pz) < 80) { p.collected = true; health.value = Math.min(100, health.value + 20); ammo.value = Math.min(50, ammo.value + 10) } })
}

function setupGame() {
  if (!scrollRef.value || !trackRef.value || !playerRef.value) return
  const scroller = scrollRef.value; const track = trackRef.value; const player = playerRef.value
  gsap.set(player, { translateZ: 0 })
  const master = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: track, scroller, start: 'top top', end: 'bottom bottom', scrub: 1.0,
      onUpdate(self) {
        const pz = -self.progress * 3000
        const sway = Math.sin(self.progress * 6) * 25
        player.style.transform = `translateZ(${pz}px) translateX(${sway}px)`
        checkCollisions(pz)
        enemies.forEach((e, i) => { const el = enemyRefs.value[i]; if (!el) return; const rz = e.z - pz; el.style.scale = String(rz > 0 ? 1 : Math.max(.2, 1 + rz / 1000)); el.style.opacity = e.dead ? '.25' : String(Math.min(1, Math.max(.25, 1 + rz / 1200))) })
      },
    },
  })
  cleanupFns.push(() => { master.scrollTrigger?.kill(); master.kill() })
}

onMounted(() => { requestAnimationFrame(() => setupGame()) })
onUnmounted(() => { ScrollTrigger.getAll().forEach(st => st.kill()); cleanupFns.forEach(fn => fn()); cleanupFns.length = 0 })
</script>

<style scoped lang="scss">
.doom-root { position: relative; width: 100vw; height: 100vh; overflow: hidden; background: #000; font-family: 'Courier New', monospace; cursor: crosshair; user-select: none; }
.doom-scanlines { position: fixed; inset: 0; z-index: 90; pointer-events: none; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,.06) 2px, rgba(0,0,0,.06) 4px); mix-blend-mode: multiply; }
.doom-vignette { position: fixed; inset: 0; z-index: 89; pointer-events: none; background: radial-gradient(ellipse 65% 55% at 50% 50%, transparent 50%, rgba(0,0,0,.55) 100%); }

.doom-hud__top { position: fixed; top: 2vh; left: 4vw; display: flex; gap: 2rem; z-index: 95; pointer-events: none; }
.doom-hud__ammo, .doom-hud__score, .doom-hud__fps { font-size: 1rem; font-weight: 900; color: #fc0; text-shadow: 0 0 8px rgba(255,200,0,.4); letter-spacing: .06em; }
.doom-hud__fps { color: #0f8; text-shadow: 0 0 6px rgba(0,255,120,.3); }
.doom-hud__bottom { position: fixed; bottom: 3vh; left: 4vw; display: flex; align-items: center; gap: .8rem; z-index: 95; pointer-events: none; }
.doom-hud__health-bar { width: 200px; height: 10px; background: #300; border: 1px solid #600; border-radius: 2px; overflow: hidden; }
.doom-hud__health-fill { height: 100%; background: linear-gradient(90deg, #c00, #f40); transition: width .3s; }
.doom-hud__health-text { font-size: .8rem; font-weight: 900; color: #f33; }
.doom-hud__face { font-size: 1.6rem; }
.doom-crosshair { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 96; pointer-events: none; font-size: 1.4rem; color: rgba(255,255,255,.4); }
.doom-damage-flash { position: fixed; inset: 0; z-index: 88; pointer-events: none; opacity: 0; background: radial-gradient(ellipse 55% 45% at 50% 50%, rgba(255,0,0,.15) 0%, transparent 65%); transition: opacity .08s; }

.doom-scroll { position: relative; width: 100%; height: 100%; overflow-x: hidden; overflow-y: auto; overscroll-behavior-y: auto; z-index: 5; &::-webkit-scrollbar { display: none; } }
.doom-track { position: relative; width: 100%; }
.doom-sticky { position: sticky; top: 0; width: 100%; height: 100vh; overflow: hidden; }

.doom-world { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 0; height: 0; z-index: 10; perspective: 900px; perspective-origin: 50% 50%; }
.doom-player { position: absolute; width: 0; height: 0; transform-style: preserve-3d; will-change: transform; }

/* ═══════════════ 走廊 — 3倍放大 ═══════════════ */
.doom-corridor { position: absolute; width: 0; height: 0; transform-style: preserve-3d; }
.doom-surface { position: absolute; backface-visibility: hidden; overflow: hidden; }
.doom-tex { width: 100%; height: 100%; object-fit: cover; filter: brightness(.35) saturate(.5) hue-rotate(-10deg); }

.doom-ceiling { width: 1600px; height: 5000px; margin-left: -800px; margin-top: -620px; transform: rotateX(90deg) translateZ(-2500px); }
.doom-floor { width: 1600px; height: 5000px; margin-left: -800px; margin-top: 220px; transform: rotateX(-90deg) translateZ(-2500px); }
.doom-wall-left { width: 5000px; height: 840px; margin-left: -3300px; margin-top: -420px; transform: rotateY(90deg) translateZ(-2500px); }
.doom-wall-right { width: 5000px; height: 840px; margin-left: 1700px; margin-top: -420px; transform: rotateY(-90deg) translateZ(-2500px); }
.doom-wall-far { width: 1600px; height: 840px; margin-left: -800px; margin-top: -620px; transform: translateZ(-5000px); }
.doom-wall-far__glow { position: absolute; inset: 0; background: radial-gradient(ellipse 50% 40% at 50% 50%, rgba(255,60,0,.08) 0%, transparent 70%); }

/* 🔑 墙面海报 — 3倍 */
.doom-decor { position: absolute; transform-style: preserve-3d; backface-visibility: hidden; }
.doom-decor__img { width: 240px; height: 170px; object-fit: cover; border: 2px solid rgba(255,0,0,.15); box-shadow: 0 0 20px rgba(255,0,0,.1); filter: brightness(.6) saturate(.7); }

/* 🔑 敌人 — 3倍 */
.doom-enemy { position: absolute; transform-style: preserve-3d; will-change: transform, scale, opacity; backface-visibility: hidden; transition: opacity .3s; }
.doom-enemy__card { width: 220px; height: 280px; margin-left: -110px; margin-top: -140px; border-radius: 6px; overflow: hidden; border: 2px solid rgba(255,0,0,.2); box-shadow: 0 0 40px rgba(255,0,0,.15); }
.doom-enemy__img { width: 100%; height: 100%; object-fit: cover; filter: brightness(.7) saturate(1.2); }
.doom-enemy--dead .doom-enemy__card { border-color: rgba(100,100,100,.15); box-shadow: none; }
.doom-enemy--dead .doom-enemy__img { filter: grayscale(.8) brightness(.3); }
.doom-enemy__hp { position: absolute; bottom: -12px; left: 50%; transform: translateX(-50%); width: 120px; height: 6px; background: #300; border-radius: 3px; }
.doom-enemy__hp-fill { height: 100%; background: #f30; border-radius: 3px; transition: width .2s; }
.doom-enemy__shadow { position: absolute; bottom: -60px; left: 50%; transform: translateX(-50%); width: 140px; height: 24px; border-radius: 50%; background: rgba(0,0,0,.35); filter: blur(8px); }

/* 🔑 拾取物 — 3倍 */
.doom-pickup { position: absolute; backface-visibility: hidden; animation: doom-float 2s ease-in-out infinite; }
.doom-pickup__img { width: 80px; height: 80px; margin-left: -40px; margin-top: -40px; border-radius: 6px; object-fit: cover; filter: brightness(.9) drop-shadow(0 0 12px rgba(255,200,0,.4)); }
@keyframes doom-float { 0%,100% { margin-top: 0; } 50% { margin-top: -12px; } }

.doom-hint { position: absolute; bottom: 6vh; left: 50%; transform: translateX(-50%); z-index: 30; pointer-events: none; display: flex; flex-direction: column; align-items: center; gap: 2px; font-size: .7rem; font-weight: 700; color: rgba(255,200,0,.4); font-family: 'Courier New', monospace; text-shadow: 0 0 6px rgba(255,200,0,.2); letter-spacing: .06em; }

@media (max-width: 768px) {
  .doom-hud__health-bar { width: 120px; }
  .doom-enemy__card { width: 120px; height: 160px; margin-left: -60px; margin-top: -80px; }
  .doom-decor__img { width: 120px; height: 85px; }
  .doom-pickup__img { width: 50px; height: 50px; margin-left: -25px; margin-top: -25px; }
}
</style>

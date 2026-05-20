<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// ==================== 配置 ====================
const STEPS = 16
const TRACKS = 8

const trackConfig = [
  { name: 'Kick', freq: 60, type: 'sine' as OscillatorType, color: '#ef4444', decay: 0.15 },
  { name: 'Snare', freq: 200, type: 'triangle' as OscillatorType, color: '#f59e0b', decay: 0.1 },
  { name: 'HiHat', freq: 800, type: 'square' as OscillatorType, color: '#10b981', decay: 0.05 },
  { name: 'Tom', freq: 120, type: 'sine' as OscillatorType, color: '#3b82f6', decay: 0.12 },
  { name: 'Clap', freq: 400, type: 'sawtooth' as OscillatorType, color: '#a855f7', decay: 0.08 },
  { name: 'Bass', freq: 80, type: 'sawtooth' as OscillatorType, color: '#ec4899', decay: 0.2 },
  { name: 'Synth', freq: 440, type: 'square' as OscillatorType, color: '#06b6d4', decay: 0.15 },
  { name: 'Bell', freq: 660, type: 'sine' as OscillatorType, color: '#84cc16', decay: 0.3 },
]

// ==================== 状态 ====================
const grid = reactive<boolean[][]>(
  Array.from({ length: TRACKS }, () => Array(STEPS).fill(false)),
)
const bpm = ref(120)
const isPlaying = ref(false)
const currentStep = ref(-1)
const volume = ref(0.5)
const trackMutes = reactive<boolean[]>(Array(TRACKS).fill(false))

let audioCtx: AudioContext | null = null
let intervalId: number | null = null

// ==================== Presets ====================
const presets = [
  {
    name: '基础节拍',
    pattern: [
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ],
  },
  {
    name: '电子舞曲',
    pattern: [
      [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    ],
  },
]

// ==================== 音频 ====================
function initAudio() {
  if (!audioCtx) {
    audioCtx = new AudioContext()
  }
}

function playNote(trackIdx: number) {
  if (!audioCtx || trackMutes[trackIdx]) {
    return
  }
  const config = trackConfig[trackIdx]
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = config.type
  osc.frequency.value = config.freq
  gain.gain.value = volume.value * 0.3

  // Quick decay envelope
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + config.decay)

  osc.connect(gain)
  gain.connect(audioCtx.destination)
  osc.start()
  osc.stop(audioCtx.currentTime + config.decay + 0.05)
}

function startPlayback() {
  initAudio()
  isPlaying.value = true
  currentStep.value = -1

  const stepDuration = (60 / bpm.value / 4) * 1000 // 16th notes

  intervalId = window.setInterval(() => {
    currentStep.value = (currentStep.value + 1) % STEPS

    // Play all active notes in current step
    for (let t = 0; t < TRACKS; t++) {
      if (grid[t][currentStep.value]) {
        playNote(t)
      }
    }
  }, stepDuration)
}

function stopPlayback() {
  isPlaying.value = false
  currentStep.value = -1
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

function togglePlay() {
  if (isPlaying.value) {
    stopPlayback()
  } else {
    startPlayback()
  }
}

function toggleCell(track: number, step: number) {
  grid[track][step] = !grid[track][step]
  if (grid[track][step]) {
    initAudio()
    playNote(track)
  }
}

function clearGrid() {
  stopPlayback()
  grid.forEach((row) => row.fill(false))
}

function applyPreset(preset: typeof presets[0]) {
  stopPlayback()
  preset.pattern.forEach((row, t) => {
    row.forEach((val, s) => {
      grid[t][s] = !!val
    })
  })
}

function toggleMute(trackIdx: number) {
  trackMutes[trackIdx] = !trackMutes[trackIdx]
}

onMounted(() => {
  gsap.fromTo('.music-sequencer', { opacity: 0 }, { opacity: 1, duration: 0.4 })
})

onUnmounted(() => {
  stopPlayback()
  if (audioCtx) {
    audioCtx.close()
  }
})
</script>

<template>
  <div class="music-sequencer">
    <div class="top-bar">
      <h2>🎵 音乐序列器</h2>
      <div class="top-controls">
        <button class="play-btn" :class="{ playing: isPlaying }" @click="togglePlay">
          {{ isPlaying ? '⏸ 停止' : '▶ 播放' }}
        </button>
        <div class="bpm-ctrl">
          <span class="bpm-label">BPM</span>
          <input v-model.number="bpm" type="range" min="60" max="200" step="1" class="bpm-slider" />
          <span class="bpm-val">{{ bpm }}</span>
        </div>
        <div class="vol-ctrl">
          <span>🔊</span>
          <input v-model.number="volume" type="range" min="0" max="1" step="0.05" class="vol-slider" />
        </div>
        <button class="clear-btn" @click="clearGrid">🗑️ 清空</button>
      </div>
    </div>

    <!-- Presets -->
    <div class="presets-bar">
      <span class="presets-label">预设:</span>
      <button v-for="p in presets" :key="p.name" class="preset-btn" @click="applyPreset(p)">
        {{ p.name }}
      </button>
    </div>

    <!-- Sequencer grid -->
    <div class="grid-container">
      <!-- Step numbers -->
      <div class="step-numbers">
        <div class="track-label-placeholder"></div>
        <div
          v-for="s in STEPS"
          :key="'n' + s"
          class="step-num"
          :class="{ active: currentStep === s - 1, beat: (s - 1) % 4 === 0 }"
        >
          {{ s }}
        </div>
      </div>

      <!-- Tracks -->
      <div v-for="(track, t) in trackConfig" :key="track.name" class="track-row">
        <div class="track-label" :class="{ muted: trackMutes[t] }" @click="toggleMute(t)">
          <span class="track-dot" :style="{ background: track.color }"></span>
          <span class="track-name">{{ track.name }}</span>
          <span class="mute-icon">{{ trackMutes[t] ? '🔇' : '🔊' }}</span>
        </div>
        <div
          v-for="s in STEPS"
          :key="'c' + t + s"
          class="grid-cell"
          :class="{
            active: grid[t][s - 1],
            playing: currentStep === s - 1 && grid[t][s - 1],
            'current-col': currentStep === s - 1,
            beat: (s - 1) % 4 === 0,
          }"
          :style="grid[t][s - 1] ? { backgroundColor: track.color + '66', borderColor: track.color } : {}"
          @click="toggleCell(t, s - 1)"
        >
          <div v-if="grid[t][s - 1]" class="cell-fill" :style="{ background: track.color }"></div>
        </div>
      </div>

      <!-- Playhead -->
      <div
        v-if="currentStep >= 0"
        class="playhead"
        :style="{ left: 80 + currentStep * 50 + 25 + 'px' }"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.music-sequencer {
  width: 100vw;
  height: 100vh;
  background: #0b1120;
  display: flex;
  flex-direction: column;
  font-family: 'Microsoft YaHei', sans-serif;
  overflow: hidden;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.top-bar h2 {
  color: #e2e8f0;
  font-size: 18px;
  margin: 0;
}

.top-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.play-btn {
  padding: 6px 20px;
  background: #3b82f6;
  border: none;
  color: #fff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s;
}

.play-btn.playing {
  background: #ef4444;
}

.play-btn:hover {
  filter: brightness(1.1);
}

.bpm-ctrl,
.vol-ctrl {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 12px;
}

.bpm-slider,
.vol-slider {
  width: 80px;
  height: 4px;
  appearance: none;
  background: #1e293b;
  border-radius: 2px;
}

.bpm-slider::-webkit-slider-thumb,
.vol-slider::-webkit-slider-thumb {
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.bpm-val {
  min-width: 28px;
  text-align: center;
  color: #e2e8f0;
  font-family: monospace;
}

.clear-btn {
  padding: 4px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.clear-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.presets-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  border-bottom: 1px solid #1e293b;
  flex-shrink: 0;
}

.presets-label {
  color: #64748b;
  font-size: 12px;
}

.preset-btn {
  padding: 3px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  color: #94a3b8;
  border-radius: 12px;
  cursor: pointer;
  font-size: 11px;
  transition: all 0.15s;
}

.preset-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.grid-container {
  flex: 1;
  padding: 16px 20px;
  overflow: auto;
  position: relative;
}

.step-numbers {
  display: flex;
  gap: 2px;
  margin-bottom: 4px;
}

.track-label-placeholder {
  width: 80px;
  flex-shrink: 0;
}

.step-num {
  width: 48px;
  text-align: center;
  color: #334155;
  font-size: 10px;
  font-family: monospace;
}

.step-num.active {
  color: #3b82f6;
  font-weight: bold;
}

.step-num.beat {
  color: #475569;
}

.track-row {
  display: flex;
  gap: 2px;
  margin-bottom: 2px;
}

.track-label {
  width: 80px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 6px;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.15s;
}

.track-label.muted {
  opacity: 0.35;
}

.track-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.track-name {
  color: #94a3b8;
  font-size: 11px;
  flex: 1;
}

.mute-icon {
  font-size: 10px;
  opacity: 0;
  transition: opacity 0.15s;
}

.track-label:hover .mute-icon {
  opacity: 1;
}

.grid-cell {
  width: 48px;
  height: 36px;
  background: #111827;
  border: 1px solid #1e293b;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;
  position: relative;
}

.grid-cell:hover {
  background: #1e293b;
}

.grid-cell.beat {
  border-left: 2px solid #1e293b;
}

.grid-cell.current-col {
  background: rgba(59, 130, 246, 0.05);
}

.grid-cell.active {
  border-width: 1.5px;
}

.grid-cell.playing {
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.cell-fill {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.playhead {
  position: absolute;
  top: 30px;
  width: 2px;
  height: calc(100% - 40px);
  background: rgba(59, 130, 246, 0.4);
  pointer-events: none;
  transition: left 0.05s linear;
}
</style>


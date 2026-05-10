<template>
  <div class="quantum-container" ref="containerRef">
    <div class="quantum-processor">
      <!-- 量子比特 -->
      <div class="qubits">
        <div
          v-for="(qubit, index) in qubits"
          :key="index"
          class="qubit"
          :class="{ 'active': qubit.active, 'superposition': qubit.superposition }"
          :style="{ '--delay': index * 0.1 }"
          @click="toggleQubit(index)"
        >
          <div class="qubit-core"></div>
          <div class="qubit-ring"></div>
          <div class="qubit-label">Q{{ index }}</div>
        </div>
      </div>

      <!-- 量子门 -->
      <div class="quantum-gates">
        <div
          v-for="(gate, index) in gates"
          :key="index"
          class="quantum-gate"
          :class="`gate-${gate.type}`"
          @click="applyGate(index)"
        >
          <span class="gate-symbol">{{ gate.symbol }}</span>
        </div>
      </div>

      <!-- 量子纠缠连接 -->
      <svg class="entanglement-lines">
        <line
          v-for="(connection, index) in entanglements"
          :key="index"
          :x1="connection.x1"
          :y1="connection.y1"
          :x2="connection.x2"
          :y2="connection.y2"
          class="entanglement-line"
          :style="{ animationDelay: `${index * 0.2}s` }"
        />
      </svg>
    </div>

    <!-- 控制面板 -->
    <div class="quantum-controls">
      <div class="control-section">
        <h4 class="control-title">量子态</h4>
        <div class="state-display">
          <span class="state-label">|ψ⟩ = </span>
          <span class="state-equation">{{ quantumState }}</span>
        </div>
      </div>
      <div class="control-section">
        <h4 class="control-title">操作</h4>
        <div class="buttons">
          <button class="quantum-btn" @click="applyHadamard">Hadamard</button>
          <button class="quantum-btn" @click="applyCNOT">CNOT</button>
          <button class="quantum-btn" @click="measure">测量</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Qubit {
  id: number
  active: boolean
  superposition: boolean
  state: number // 0 或 1 (或叠加态)
}

interface Gate {
  type: string
  symbol: string
}

interface Props {
  qubitCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  qubitCount: 8
})

const containerRef = ref<HTMLElement>()
const qubits = ref<Qubit[]>([])
const gates = ref<Gate[]>([
  { type: 'hadamard', symbol: 'H' },
  { type: 'pauli-x', symbol: 'X' },
  { type: 'pauli-y', symbol: 'Y' },
  { type: 'pauli-z', symbol: 'Z' },
  { type: 'cnot', symbol: '⊕' },
  { type: 'phase', symbol: 'P' }
])
const entanglements = ref<any[]>([])
const quantumState = ref('|00000000⟩')
let ctx: gsap.Context

// 初始化量子比特
const initQubits = () => {
  qubits.value = Array.from({ length: props.qubitCount }, (_, i) => ({
    id: i,
    active: i < 2,
    superposition: false,
    state: 0
  }))

  generateEntanglements()
}

// 生成纠缠连接
const generateEntanglements = () => {
  entanglements.value = []
  for (let i = 0; i < qubits.value.length - 1; i++) {
    if (Math.random() > 0.5) {
      entanglements.value.push({
        x1: 50 + i * 60,
        y1: 100,
        x2: 110 + i * 60,
        y2: 100
      })
    }
  }
}

// 切换量子比特状态
const toggleQubit = (index: number) => {
  const qubit = qubits.value[index]
  qubit.active = !qubit.active

  gsap.to(qubit, {
    scale: 1.2,
    duration: 0.2,
    yoyo: true,
    repeat: 1
  })

  updateQuantumState()
}

// 应用哈达玛门
const applyHadamard = () => {
  qubits.value.forEach(qubit => {
    if (qubit.active) {
      qubit.superposition = true
      gsap.to(qubit, {
        rotate: 360,
        duration: 0.5,
        ease: 'back.out(1.7)'
      })
    }
  })
  updateQuantumState()
}

// 应用 CNOT 门
const applyCNOT = () => {
  const activeQubits = qubits.value.filter(q => q.active)
  if (activeQubits.length >= 2) {
    const control = activeQubits[0]
    const target = activeQubits[1]

    target.superposition = true
    target.state = (target.state + 1) % 2

    gsap.to(target, {
      scale: 1.3,
      duration: 0.3,
      yoyo: true,
      repeat: 1
    })

    // 创建纠缠连接
    entanglements.value.push({
      x1: 50 + control.id * 60,
      y1: 100,
      x2: 50 + target.id * 60,
      y2: 100
    })
  }
  updateQuantumState()
}

// 测量
const measure = () => {
  qubits.value.forEach(qubit => {
    if (qubit.superposition) {
      qubit.superposition = false
      qubit.state = Math.random() > 0.5 ? 1 : 0

      gsap.to(qubit, {
        scale: 1.5,
        opacity: 0.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1
      })
    }
  })
  updateQuantumState()
}

// 应用量子门
const applyGate = (index: number) => {
  const gate = gates.value[index]
  const activeQubits = qubits.value.filter(q => q.active)

  if (activeQubits.length > 0) {
    const qubit = activeQubits[0]

    gsap.to(qubit, {
      scale: 1.3,
      duration: 0.3,
      yoyo: true,
      repeat: 1
    })

    updateQuantumState()
  }
}

// 更新量子态显示
const updateQuantumState = () => {
  let state = '|'
  qubits.value.forEach(qubit => {
    if (qubit.superposition) {
      state += '⊕'
    } else {
      state += qubit.state
    }
  })
  state += '⟩'
  quantumState.value = state
}

onMounted(() => {
  initQubits()

  ctx = gsap.context(() => {
    // 量子比特脉动
    gsap.to('.qubit.active .qubit-core', {
      scale: [1, 1.2, 1],
      duration: 2,
      repeat: -1,
      stagger: 0.2,
      ease: 'sine.inOut'
    })

    // 量子环旋转
    gsap.to('.qubit-ring', {
      rotate: 360,
      duration: 10,
      repeat: -1,
      stagger: 0.5,
      ease: 'none'
    })

    // 叠加态动画
    gsap.to('.qubit.superposition .qubit-core', {
      opacity: [1, 0.3, 1],
      duration: 0.5,
      repeat: -1,
      ease: 'sine.inOut'
    })

    // 量子门闪烁
    gsap.to('.quantum-gate', {
      opacity: [0.6, 1, 0.6],
      duration: 2,
      repeat: -1,
      stagger: 0.3
    })

    // 纠缠连线动画
    gsap.to('.entanglement-line', {
      strokeDashoffset: -20,
      duration: 1,
      repeat: -1,
      ease: 'none'
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<style scoped lang="scss">
.quantum-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  padding: 30px;
  background: linear-gradient(135deg, #0a0a2a, #000010);
  border-radius: 20px;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.quantum-processor {
  position: relative;
  padding: 40px 20px;
  min-height: 200px;
}

.qubits {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
  position: relative;
  z-index: 2;
}

.qubit {
  position: relative;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s;
}

.qubit-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s;
}

.qubit.active .qubit-core {
  background: radial-gradient(circle, #8b5cf6, #3b82f6);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
}

.qubit:not(.active) .qubit-core {
  background: rgba(107, 114, 128, 0.3);
}

.qubit.superposition .qubit-core {
  background: radial-gradient(circle, #ec4899, #f59e0b, #ec4899);
  animation: superpositionPulse 1s ease-in-out infinite;
}

@keyframes superpositionPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.qubit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 45px;
  height: 45px;
  border: 2px solid rgba(139, 92, 246, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.qubit-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.75rem;
  color: #94a3b8;
}

.quantum-gates {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.quantum-gate {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(139, 92, 246, 0.4);
    transform: scale(1.1);
  }
}

.gate-symbol {
  font-size: 1rem;
  font-weight: bold;
  color: #e2e8f0;
}

.entanglement-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.entanglement-line {
  stroke: rgba(139, 92, 246, 0.5);
  stroke-width: 2;
  stroke-dasharray: 5, 5;
}

.quantum-controls {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.control-section {
  margin-bottom: 20px;
}

.control-title {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.state-display {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.state-label {
  font-size: 1rem;
  color: #8b5cf6;
  font-family: 'Times New Roman', serif;
}

.state-equation {
  font-size: 1rem;
  color: #e2e8f0;
  font-family: 'Courier New', monospace;
}

.buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.quantum-btn {
  padding: 10px 20px;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.4);
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: rgba(139, 92, 246, 0.4);
    transform: translateY(-2px);
  }
}

@media (max-width: 768px) {
  .qubits {
    gap: 5px;
  }
  .qubit {
    width: 40px;
    height: 40px;
  }
  .qubit-core {
    width: 25px;
    height: 25px;
  }
  .qubit-ring {
    width: 35px;
    height: 35px;
  }
}
</style>

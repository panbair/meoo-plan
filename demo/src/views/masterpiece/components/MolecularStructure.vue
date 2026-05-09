<template>
  <div class="molecular-container" ref="containerRef">
    <svg class="molecular-svg" ref="svgRef">
      <defs>
        <radialGradient id="atom-gradient">
          <stop offset="0%" stop-color="#8b5cf6" />
          <stop offset="50%" stop-color="#3b82f6" />
          <stop offset="100%" stop-color="#ec4899" />
        </radialGradient>
        <filter id="atom-glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g ref="bondsRef" class="bonds"></g>
      <g ref="atomsRef" class="atoms"></g>
    </svg>
    <div class="molecule-info">
      <h3 class="molecule-title">分子结构</h3>
      <p class="molecule-subtitle">动态原子键模拟</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

interface Atom {
  id: number
  x: number
  y: number
  z: number
  element: string
  size: number
}

interface Bond {
  from: Atom
  to: Atom
  strength: number
}

interface Props {
  atomCount?: number
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  atomCount: 20,
  width: 500,
  height: 400
})

const containerRef = ref<HTMLElement>()
const svgRef = ref<SVGSVGElement>()
const atomsRef = ref<SVGGElement>()
const bondsRef = ref<SVGGElement>()
let ctx: gsap.Context
let animationId: number
let atoms: Atom[] = []
let bonds: Bond[] = []

const elements = ['C', 'H', 'O', 'N', 'S']
const elementColors: Record<string, string> = {
  C: '#333333',
  H: '#ffffff',
  O: '#ff0000',
  N: '#0000ff',
  S: '#ffff00'
}

const initMolecule = () => {
  const svg = svgRef.value!
  svg.setAttribute('width', props.width.toString())
  svg.setAttribute('height', props.height.toString())

  atoms = []
  bonds = []

  // 创建原子
  for (let i = 0; i < props.atomCount; i++) {
    atoms.push({
      id: i,
      x: 100 + Math.random() * (props.width - 200),
      y: 100 + Math.random() * (props.height - 200),
      z: Math.random() * 100 - 50,
      element: elements[Math.floor(Math.random() * elements.length)],
      size: 10 + Math.random() * 10
    })
  }

  // 创建化学键
  for (let i = 0; i < atoms.length; i++) {
    for (let j = i + 1; j < atoms.length; j++) {
      const dx = atoms[i].x - atoms[j].x
      const dy = atoms[i].y - atoms[j].y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        bonds.push({
          from: atoms[i],
          to: atoms[j],
          strength: 1 - distance / 100
        })
      }
    }
  }

  renderMolecule()
  animateMolecule()
}

const renderMolecule = () => {
  const atomsGroup = atomsRef.value!
  const bondsGroup = bondsRef.value!

  atomsGroup.innerHTML = ''
  bondsGroup.innerHTML = ''

  // 渲染化学键
  bonds.forEach(bond => {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    line.setAttribute('x1', bond.from.x.toString())
    line.setAttribute('y1', bond.from.y.toString())
    line.setAttribute('x2', bond.to.x.toString())
    line.setAttribute('y2', bond.to.y.toString())
    line.setAttribute('stroke', `rgba(139, 92, 246, ${bond.strength * 0.5})`)
    line.setAttribute('stroke-width', (bond.strength * 3).toString())
    line.classList.add('bond')
    bondsGroup.appendChild(line)
  })

  // 渲染原子
  atoms.forEach(atom => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.classList.add('atom')

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    circle.setAttribute('cx', atom.x.toString())
    circle.setAttribute('cy', atom.y.toString())
    circle.setAttribute('r', atom.size.toString())
    circle.setAttribute('fill', elementColors[atom.element])
    circle.setAttribute('filter', 'url(#atom-glow)')
    group.appendChild(circle)

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    text.setAttribute('x', atom.x.toString())
    text.setAttribute('y', (atom.y + atom.size / 3).toString())
    text.setAttribute('text-anchor', 'middle')
    text.setAttribute('fill', atom.element === 'C' ? '#ffffff' : '#000000')
    text.setAttribute('font-size', (atom.size * 0.8).toString())
    text.setAttribute('font-weight', 'bold')
    text.textContent = atom.element
    group.appendChild(text)

    atomsGroup.appendChild(group)
  })
}

const animateMolecule = () => {
  const animate = () => {
    // 更新原子位置（轻微漂浮）
    atoms.forEach((atom, i) => {
      atom.x += Math.sin(Date.now() * 0.001 + i) * 0.2
      atom.y += Math.cos(Date.now() * 0.001 + i) * 0.2
    })

    // 更新 SVG 元素
    const bondElements = bondsRef.value!.querySelectorAll('line')
    const atomElements = atomsRef.value!.querySelectorAll('.atom')

    bondElements.forEach((bond, i) => {
      const bondLine = bond as SVGLineElement
      const bondData = bonds[i]
      bondLine.setAttribute('x1', bondData.from.x.toString())
      bondLine.setAttribute('y1', bondData.from.y.toString())
      bondLine.setAttribute('x2', bondData.to.x.toString())
      bondLine.setAttribute('y2', bondData.to.y.toString())
    })

    atomElements.forEach((atom, i) => {
      const atomGroup = atom as SVGGElement
      const atomData = atoms[i]
      const circle = atomGroup.querySelector('circle')!
      const text = atomGroup.querySelector('text')!

      circle.setAttribute('cx', atomData.x.toString())
      circle.setAttribute('cy', atomData.y.toString())
      text.setAttribute('x', atomData.x.toString())
      text.setAttribute('y', (atomData.y + atomData.size / 3).toString())
    })

    animationId = requestAnimationFrame(animate)
  }

  animate()
}

onMounted(() => {
  initMolecule()

  ctx = gsap.context(() => {
    // 鼠标拖拽交互
    let isDragging = false
    let draggedAtom: Atom | null = null

    svgRef.value?.addEventListener('mousedown', (e) => {
      const rect = svgRef.value!.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      atoms.forEach(atom => {
        const dx = atom.x - x
        const dy = atom.y - y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < atom.size + 10) {
          isDragging = true
          draggedAtom = atom
        }
      })
    })

    svgRef.value?.addEventListener('mousemove', (e) => {
      if (isDragging && draggedAtom) {
        const rect = svgRef.value!.getBoundingClientRect()
        draggedAtom.x = e.clientX - rect.left
        draggedAtom.y = e.clientY - rect.top
      }
    })

    svgRef.value?.addEventListener('mouseup', () => {
      isDragging = false
      draggedAtom = null
    })

    svgRef.value?.addEventListener('mouseleave', () => {
      isDragging = false
      draggedAtom = null
    })
  }, containerRef.value)
})

onUnmounted(() => {
  ctx?.revert()
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped lang="scss">
.molecular-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0a0a1a, #1a1a3a);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.molecular-svg {
  width: 100%;
  height: 100%;
}

.bond {
  transition: all 0.3s;
}

.atom {
  cursor: move;
  transition: all 0.3s;

  &:hover circle {
    filter: brightness(1.2);
  }
}

.molecule-info {
  position: absolute;
  bottom: 20px;
  left: 20px;
  z-index: 10;
}

.molecule-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
}

.molecule-subtitle {
  font-size: 0.85rem;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .molecular-container {
    height: 300px;
  }
}
</style>

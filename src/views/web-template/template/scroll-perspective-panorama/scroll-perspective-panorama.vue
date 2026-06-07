<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='ppn-dot'+(i===0?' ppn-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.ppn-dot').forEach((d,j)=>d.classList.toggle('ppn-active',j===i));const el=document.querySelector('.ppn-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('ppnArea')as HTMLElement;pb=document.getElementById('ppnProgress');nd=document.getElementById('ppnNav');if(!sa)return;sa.style.height=T*100+'vh';const track=document.getElementById('ppnTrack')as HTMLElement;const panels=gsap.utils.toArray('.ppn-panel')as HTMLElement[]
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:(self)=>{const p=self.progress;const f=p*(T-1);const idx=Math.floor(f);const frac=f-idx;const tx=-p*100*(T-1)/T;const tilt=Math.sin(p*Math.PI)*18;if(track)track.style.transform=`translateX(${tx}vw) rotateX(${tilt}deg)`
      panels.forEach((panel,i)=>{const d=Math.abs(i-f);if(d<.15){panel.style.opacity='1';panel.style.filter='brightness(1)'}else if(d<1.5){panel.style.opacity=String(1-d*.7);panel.style.filter=`brightness(${1-d*.5}) blur(${d*3}px)`}else{panel.style.opacity='0';panel.style.filter='brightness(.2) blur(6px)'}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="ppnArea" class="ppn-page"><div id="ppnProgress" class="ppn-progress-bar"></div><nav id="ppnNav" class="ppn-nav-dots"></nav>
    <div class="ppn-indicator"><span class="ppn-cur">1</span> / {{ T }}</div>
    <div class="ppn-viewport"><div id="ppnTrack" class="ppn-track">
      <section v-for="n in T" :key="n" class="ppn-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+210},42%,82%), hsl(${(n-1)*52}, 52%,92%))` }"><div class="ppn-content"><span class="ppn-num">{{ String(n).padStart(2, '0') }}</span></div></section>
    </div></div>
    <div class="ppn-edge-l"></div><div class="ppn-edge-r"></div>
  </div>
</template>

<style scoped>
.ppn-page { font-family: system-ui, -apple-system, sans-serif; background: #f3f5f8; perspective: 2000px; }
.ppn-viewport { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; perspective: 2000px; perspective-origin: 50% 50%; }
.ppn-track { display: flex; height: 100vh; transform-style: preserve-3d; will-change: transform; }
.ppn-panel { min-width: 85vw; height: 100vh; flex-shrink: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; }
.ppn-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.ppn-content { text-align: center; }
.ppn-num { font-size: clamp(5rem, 14vw, 10rem); font-weight: 900; color: rgba(26,26,46,.025); user-select: none; }
.ppn-edge-l { position: fixed; left: 0; top: 0; width: 15vw; height: 100vh; z-index: 5; pointer-events: none; background: linear-gradient(90deg, rgba(243,245,248,.9), transparent); }
.ppn-edge-r { position: fixed; right: 0; top: 0; width: 15vw; height: 100vh; z-index: 5; pointer-events: none; background: linear-gradient(270deg, rgba(243,245,248,.9), transparent); }
</style>

<style>
.ppn-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ppn-nav-dot { width: 5px; height: 24px; border-radius: 3px; background: rgba(26,26,46,.08); cursor: pointer; border: none; padding: 0; transition: all .3s; }
.ppn-nav-dot.ppn-active { background: #3b82f6; height: 34px; box-shadow: 0 0 12px rgba(59,130,246,.4); }
.ppn-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd); z-index: 1001; }
.ppn-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='ctg-dot'+(i===0?' ctg-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.ctg-dot').forEach((d,j)=>d.classList.toggle('ctg-active',j===i));const el=document.querySelector('.ctg-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('ctgArea')as HTMLElement;pb=document.getElementById('ctgProgress');nd=document.getElementById('ctgNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.ctg-panel')as HTMLElement[];const sl=document.querySelector('.ctg-split-line')as HTMLElement
  panels.forEach((p,i)=>{if(i===0){p.style.clipPath='inset(0 0 0 0)';p.style.opacity='1';p.style.zIndex=String(T+10)}else{p.style.clipPath='inset(0 0 0 100%)';p.style.opacity='0';p.style.zIndex=String(T-i)}})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const sp=100-frac*100;const ga=(Math.sin(frac*45)*7+Math.sin(frac*33)*5)*Math.min(1,frac*2)*Math.min(1,(1-frac)*2)
      if(sl){sl.style.left=`${sp+ga}%`;sl.style.opacity=String(.5+Math.abs(ga)*.06)}
      panels.forEach((p,i)=>{if(i<idx){p.style.clipPath='inset(0 100% 0 0)';p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.clipPath='inset(0 0 0 100%)';p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){p.style.clipPath=`inset(0 ${100-sp+ga*.5}% 0 0)`;p.style.opacity='1';p.style.zIndex=String(T+10)}else if(i===idx+1){p.style.clipPath=`inset(0 0 0 ${sp-ga*.5}%)`;p.style.opacity='1';p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="ctgArea" class="ctg-page"><div id="ctgProgress" class="ctg-progress-bar"></div><nav id="ctgNav" class="ctg-nav-dots"></nav>
    <div class="ctg-indicator"><span class="ctg-cur">1</span> / {{ T }}</div>
    <div class="ctg-split-line"></div>
    <section v-for="n in T" :key="n" class="ctg-panel" :style="{ background: `linear-gradient(${n%2===0?90:270}deg, hsl(${n*50+200},42%,80%), hsl(${(n-1)*52}, 52%,90%))` }">
      <div class="ctg-content"><span class="ctg-label" :style="{ color: `hsla(${n*50+200},60%,40%,.25)` }">{{ n%2===0?'RIGHT':'LEFT' }}</span><span class="ctg-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.ctg-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f2f6; color: #1a1a2e; }
.ctg-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, filter; }
.ctg-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.ctg-content { text-align: center; display: flex; flex-direction: column; gap: 8px; }
.ctg-label { font-size: .7rem; letter-spacing: .5em; font-weight: 600; }
.ctg-num { font-size: clamp(5rem, 14vw, 10rem); font-weight: 900; color: rgba(26,26,46,.025); user-select: none; }
.ctg-split-line { position: fixed; top: 0; left: 100%; width: 2px; height: 100vh; background: linear-gradient(to bottom, transparent, rgba(26,26,46,.15), transparent); z-index: 55; pointer-events: none; opacity: 0; }
</style>

<style>
.ctg-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ctg-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.ctg-nav-dot.ctg-active { background: #34d399; border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(52,211,153,.4); }
.ctg-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #34d399, #6ee7b7); z-index: 1001; }
.ctg-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

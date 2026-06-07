<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='tls-dot'+(i===0?' tls-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.tls-dot').forEach((d,j)=>d.classList.toggle('tls-active',j===i));const el=document.querySelector('.tls-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('tlsArea')as HTMLElement;pb=document.getElementById('tlsProgress');nd=document.getElementById('tlsNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.tls-panel')as HTMLElement[];const tl=document.querySelector('.tls-line-progress')as HTMLElement;const nodes=document.querySelectorAll('.tls-node')as NodeListOf<HTMLElement>
  panels.forEach((p,i)=>{if(i===0){p.style.opacity='1';p.style.clipPath='inset(0 0 0 0)';p.style.transform='';p.style.zIndex=String(T+10)}else{p.style.opacity='0';p.style.clipPath='inset(0 0 0 100%)';p.style.transform='translateX(30px)';p.style.zIndex=String(T-i)}})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const lp=(f/(T-1))*100;if(tl)tl.style.height=`${lp}%`
      nodes.forEach((n,ni)=>{const isPast=ni<idx;const isCur=ni===idx;(n as HTMLElement).style.background=isCur?'rgba(26,26,46,.6)':isPast?'rgba(26,26,46,.2)':'rgba(26,26,46,.06)';(n as HTMLElement).style.boxShadow=isCur?'0 0 12px rgba(26,26,46,.2)':'none';(n as HTMLElement).style.transform=isCur?'scale(1.5)':'scale(1)'})
      panels.forEach((p,i)=>{if(i<idx){p.style.clipPath='inset(0 0 0 100%)';p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.clipPath='inset(0 0 0 100%)';p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){p.style.clipPath=`inset(0 ${frac*35}% 0 0)`;p.style.opacity=String(1-frac*.3);p.style.transform=`translateX(${frac*25}px)`;p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.3)/.7;p.style.clipPath=`inset(0 0 0 ${(1-rp)*55}%)`;p.style.opacity=String(rp);p.style.transform=`translateX(${(1-rp)*30}px)`;p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="tlsArea" class="tls-page"><div id="tlsProgress" class="tls-progress-bar"></div><nav id="tlsNav" class="tls-nav-dots"></nav>
    <div class="tls-indicator"><span class="tls-cur">1</span> / {{ T }}</div>
    <div class="tls-timeline"><div class="tls-line-bg"></div><div class="tls-line-progress"></div>
      <div v-for="n in T" :key="n" class="tls-node-wrapper" :style="{ top: `${(n-1)/(T-1)*100}%` }"><div class="tls-node"></div><span class="tls-year">{{ 2018+n }}</span></div>
    </div>
    <div class="tls-panels-container">
      <section v-for="n in T" :key="n" class="tls-panel" :style="{ background: `radial-gradient(ellipse at 60% 50%, hsl(${(n-1)*52}, 52%,82%), hsl(${(n-1)*52}, 52%,92%))` }">
        <div class="tls-content"><span class="tls-num">{{ String(n).padStart(2, '0') }}</span><span class="tls-phase">Phase {{ n }}</span></div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.tls-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f3f6; color: #1a1a2e; }
.tls-panels-container { position: absolute; left: 26vw; right: 0; top: 0; bottom: 0; }
.tls-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: clip-path, opacity, transform; }
.tls-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.tls-content { text-align: center; display: flex; flex-direction: column; gap: 8px; }
.tls-num { font-size: clamp(4rem, 12vw, 8rem); font-weight: 900; color: rgba(26,26,46,.025); user-select: none; }
.tls-phase { font-size: .8rem; color: rgba(26,26,46,.1); letter-spacing: .3em; }
.tls-timeline { position: fixed; left: 6vw; top: 50%; transform: translateY(-50%); width: 8vw; height: 60vh; z-index: 90; }
.tls-line-bg { position: absolute; left: 50%; top: 0; width: 1px; height: 100%; background: rgba(26,26,46,.04); transform: translateX(-50%); }
.tls-line-progress { position: absolute; left: 50%; top: 0; width: 2px; height: 0%; background: rgba(26,26,46,.15); transform: translateX(-50%); border-radius: 1px; }
.tls-node-wrapper { position: absolute; left: 0; right: 0; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; }
.tls-node { width: 12px; height: 12px; border-radius: 50%; background: rgba(26,26,46,.06); margin: 0 auto; transition: all .3s; }
.tls-year { font-size: .6rem; color: rgba(26,26,46,.08); position: absolute; left: 20px; white-space: nowrap; }
</style>

<style>
.tls-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.tls-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.tls-nav-dot.tls-active { background: #667eea; border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(102,126,234,.4); }
.tls-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #667eea, #764ba2, #a78bfa); z-index: 1001; }
.tls-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

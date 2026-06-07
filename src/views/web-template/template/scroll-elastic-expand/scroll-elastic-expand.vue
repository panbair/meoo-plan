<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='eex-dot'+(i===0?' eex-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.eex-dot').forEach((d,j)=>d.classList.toggle('eex-active',j===i));const el=document.querySelector('.eex-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'elastic.out(1,.5)'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('eexArea')as HTMLElement;pb=document.getElementById('eexProgress');nd=document.getElementById('eexNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.eex-panel')as HTMLElement[]
  panels.forEach((p,i)=>{if(i===0){p.style.transform='';p.style.opacity='1';p.style.clipPath='inset(0 0 0 0)';p.style.zIndex=String(T+10)}else{p.style.transform='scaleX(.3)';p.style.opacity='0';p.style.clipPath='inset(0 0 0 100%)';p.style.zIndex=String(T-i)}})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.3,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx
      panels.forEach((p,i)=>{if(i<idx){p.style.clipPath='inset(0 100% 0 0)';p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.clipPath='inset(0 0 0 100%)';p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){const sp=Math.min(1,frac*1.8);const el=sp<.7?1+Math.sin(sp*Math.PI/.7)*.15*(1-sp/.7):1-(sp-.7)*.3;const sx=Math.max(.05,el*(1-sp*.9));p.style.transform=`scaleX(${sx}) scaleY(${1+sp*.06})`;p.style.clipPath=`inset(0 0 0 ${sp*100}%)`;p.style.opacity=String(1-sp*.4);p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.3)/.7;const ei=1-Math.pow(1-rp,3);const os=rp>.7?1+Math.sin((rp-.7)*Math.PI/.3)*.06*(1-rp):1;const sx=.2+ei*.8*os;p.style.transform=`scaleX(${Math.min(1.1,sx)})`;p.style.clipPath=`inset(0 ${(1-rp)*100}% 0 0)`;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="eexArea" class="eex-page"><div id="eexProgress" class="eex-progress-bar"></div><nav id="eexNav" class="eex-nav-dots"></nav>
    <div class="eex-indicator"><span class="eex-cur">1</span> / {{ T }}</div>
    <section v-for="n in T" :key="n" class="eex-panel" :style="{ background: `linear-gradient(90deg, hsl(${n*50+30},50%,76%), hsl(${(n-1)*52}, 52%,88%))` }">
      <div class="eex-content"><span class="eex-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.eex-page { font-family: system-ui, -apple-system, sans-serif; background: #f7f4f0; color: #1a1a2e; }
.eex-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, clip-path, opacity, filter; }
.eex-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.eex-content { text-align: center; }
.eex-num { font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(26,26,46,.025); user-select: none; }
</style>

<style>
.eex-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.eex-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s cubic-bezier(.68,-.55,.265,1.55); }
.eex-nav-dot.eex-active { background: #f59e0b; border-color: rgba(26,26,46,.2); transform: scale(1.4); box-shadow: 0 0 14px rgba(245,158,11,.4); }
.eex-progress-bar { position: fixed; top: 0; left: 0; height: 4px; width: 0%; background: linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d); z-index: 1001; }
.eex-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

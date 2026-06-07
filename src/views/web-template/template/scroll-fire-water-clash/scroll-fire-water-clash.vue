<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7,SP=50;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='fwc-dot'+(i===0?' fwc-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.fwc-dot').forEach((d,j)=>d.classList.toggle('fwc-active',j===i));const el=document.querySelector('.fwc-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('fwcArea')as HTMLElement;pb=document.getElementById('fwcProgress');nd=document.getElementById('fwcNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.fwc-panel')as HTMLElement[];const fl=document.querySelector('.fwc-fire-line')as HTMLElement;const wl=document.querySelector('.fwc-water-line')as HTMLElement
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx
      panels.forEach((p,i)=>{if(i<idx){p.style.clipPath='inset(0 0 100% 0)';p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.clipPath='inset(100% 0 0 0)';p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){const fp=Math.min(1,frac*1.5);const tc=fp*SP;const wp=Math.min(1,frac*1.5);const bc=wp*(100-SP);p.style.clipPath=`inset(${tc}% 0 ${bc}% 0)`;p.style.opacity=String(1-frac);p.style.filter=`hue-rotate(${frac*60}deg) brightness(${1+frac*.8})`;p.style.zIndex=String(T+10);if(fl){fl.style.opacity=String(frac<.8?frac*.6:(1-frac)*3);fl.style.top=`${SP-tc}%`}if(wl){wl.style.opacity=String(frac<.8?frac*.6:(1-frac)*3);wl.style.bottom=`${100-SP-bc}%`}}else if(i===idx+1){const rp=Math.max(0,frac-.3)/.7;const r=rp*SP;p.style.clipPath=`inset(${SP-r}% 0 ${(100-SP)-r}% 0)`;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="fwcArea" class="fwc-page"><div id="fwcProgress" class="fwc-progress-bar"></div><nav id="fwcNav" class="fwc-nav-dots"></nav>
    <div class="fwc-indicator"><span class="fwc-cur">1</span>/{{T}}</div>
    <div class="fwc-fire-line"></div><div class="fwc-water-line"></div>
    <section v-for="n in T" :key="n" class="fwc-panel" :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*52},52%,${70+n%2*5}%), hsl(${(n-1)*52+25},40%,${80+n%2*5}%))` }">
      <div class="fwc-content"><span class="fwc-num">{{String(n).padStart(2,'0')}}</span><span class="fwc-sym">{{n%2===0?'💧':'🔥'}}</span></div>
    </section>
  </div>
</template>

<style scoped>
.fwc-page{font-family:system-ui,-apple-system,sans-serif;background:#f5f0f8;color:#1a1a2e}
.fwc-panel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:clip-path,opacity,filter}
.fwc-panel::before{content:'';position:absolute;inset:24px;border:1px solid rgba(255,255,255,.3);border-radius:20px;pointer-events:none}
.fwc-content{text-align:center;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:16px}
.fwc-num{font-size:clamp(5rem,16vw,12rem);font-weight:900;color:rgba(26,26,46,.04);user-select:none}
.fwc-sym{font-size:2.5rem;opacity:.2}
.fwc-fire-line{position:fixed;left:0;width:100%;height:3px;background:linear-gradient(90deg,transparent,#ff6b6b,#ffa94d,#ff6b6b,transparent);z-index:1000;pointer-events:none;opacity:0}
.fwc-water-line{position:fixed;left:0;width:100%;height:3px;background:linear-gradient(90deg,transparent,#4dabf7,#74c0fc,#4dabf7,transparent);z-index:1000;pointer-events:none;opacity:0}
</style>

<style>
.fwc-nav-dots{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:1000;display:flex;flex-direction:column;gap:10px}
.fwc-nav-dot{width:10px;height:10px;border-radius:50%;background:rgba(26,26,46,.15);cursor:pointer;border:2px solid transparent;padding:0;transition:all .3s}
.fwc-nav-dot:hover{background:rgba(26,26,46,.4);transform:scale(1.3)}
.fwc-nav-dot.fwc-active{background:linear-gradient(135deg,#ff6b6b,#4dabf7);border-color:rgba(26,26,46,.3);transform:scale(1.5);box-shadow:0 0 16px rgba(255,107,107,.3)}
.fwc-progress-bar{position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#ff6b6b,#ffa94d,#4dabf7);z-index:1001}
.fwc-indicator{position:fixed;top:28px;right:60px;z-index:1000;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);padding:8px 20px;border-radius:24px;font-size:.85rem;border:1px solid rgba(255,255,255,.1);color:rgba(26,26,46,.75)}
</style>

<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7,R=320,AS=360/T;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='crs-dot'+(i===0?' crs-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.crs-dot').forEach((d,j)=>d.classList.toggle('crs-active',j===i));const el=document.querySelector('.crs-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.7,ease:'elastic.out(1,.4)'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('crsArea')as HTMLElement;pb=document.getElementById('crsProgress');nd=document.getElementById('crsNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.crs-panel')as HTMLElement[];const ring=document.querySelector('.crs-ring')as HTMLElement;const snap=document.querySelector('.crs-snap')as HTMLElement
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.3,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const ra=-f*AS;if(ring)ring.style.transform=`translate(-50%,-50%) rotateY(${ra}deg)`
      if(snap){snap.style.transform=frac<.04?'scale(1.4)':'scale(1)';snap.style.opacity=frac<.04?'.8':'.4'}
      panels.forEach((p,i)=>{const a=AS*i+ra;const rad=(a*Math.PI)/180;const z=Math.cos(rad);const fn=(z+1)/2
        if(i===idx){p.style.opacity=String(1-frac*.3);p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.2)/.8;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}
        else if(fn>.5){p.style.opacity=String(fn*.4);p.style.zIndex=String(Math.round(fn*10))}else{p.style.opacity='0';p.style.zIndex=String(i)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="crsArea" class="crs-page"><div id="crsProgress" class="crs-progress-bar"></div><nav id="crsNav" class="crs-nav-dots"></nav>
    <div class="crs-indicator"><span class="crs-cur">1</span> / {{ T }}</div>
    <div class="crs-snap">●</div>
    <div class="crs-stage"><div class="crs-ring"><section v-for="n in T" :key="n" class="crs-panel" :style="{ transform:`rotateY(${(n-1)*AS}deg) translateZ(${R}px)`, background:`linear-gradient(135deg, hsl(${n*50+240},40%,80%), hsl(${(n-1)*52}, 52%,90%))`, border:`1px solid hsla(${n*50+240},40%,60%,.12)` }"><span class="crs-num">{{ String(n).padStart(2, '0') }}</span></section></div></div>
  </div>
</template>

<style scoped>
.crs-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f3f8; perspective: 1500px; }
.crs-stage { position: fixed; top: 50%; left: 50%; transform-style: preserve-3d; z-index: 10; }
.crs-ring { position: absolute; transform-style: preserve-3d; width: 0; height: 0; will-change: transform; }
.crs-panel { position: absolute; width: 220px; height: 300px; left: -110px; top: -150px; border-radius: 14px; display: flex; align-items: center; justify-content: center; will-change: opacity; backface-visibility: hidden; }
.crs-num { font-size: 3.5rem; font-weight: 900; color: rgba(26,26,46,.03); user-select: none; }
.crs-snap { position: fixed; bottom: 70px; left: 50%; transform: translateX(-50%); z-index: 200; pointer-events: none; font-size: 1.2rem; color: rgba(26,26,46,.15); transition: transform .12s, opacity .12s; }
</style>

<style>
.crs-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.crs-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s cubic-bezier(.68,-.55,.265,1.55); }
.crs-nav-dot.crs-active { background: #8b5cf6; border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(139,92,246,.4); }
.crs-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #8b5cf6, #b48cf0, #d0b8ff); z-index: 1001; }
.crs-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

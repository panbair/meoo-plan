<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7,M=6;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='kpn-dot'+(i===0?' kpn-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.kpn-dot').forEach((d,j)=>d.classList.toggle('kpn-active',j===i));const el=document.querySelector('.kpn-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('kpnArea')as HTMLElement;pb=document.getElementById('kpnProgress');nd=document.getElementById('kpnNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.kpn-panel')as HTMLElement[];const scope=document.querySelector('.kpn-scope')as HTMLElement
  panels.forEach((p,i)=>{p.style.opacity=i===0?'1':'0';p.style.zIndex=i===0?String(T+10):String(T-i);p.style.transform=i===0?'':'scale(.3)'})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const ka=frac*60;if(scope)scope.style.transform=`translate(-50%,-50%) rotate(${ka}deg)`
      panels.forEach((p,i)=>{if(i<idx){p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){const dx=-frac*100;p.style.transform=`translateX(${dx}%) scale(${1-frac*.25})`;p.style.opacity=String(1-frac*.5);p.style.filter=`blur(${frac*6}px)`;p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.2)/.8;p.style.transform=`translateX(${50-rp*50}%) scale(${.7+rp*.3})`;p.style.opacity=String(rp);p.style.filter=`blur(${(1-rp)*8}px)`;p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="kpnArea" class="kpn-page"><div id="kpnProgress" class="kpn-progress-bar"></div><nav id="kpnNav" class="kpn-nav-dots"></nav>
    <div class="kpn-indicator"><span class="kpn-cur">1</span> / {{ T }}</div>
    <div class="kpn-scope"><div v-for="m in M" :key="m" class="kpn-wg" :style="{ transform: `rotate(${m*60}deg)`, background: `conic-gradient(from ${m*60}deg, transparent 0deg, rgba(26,26,46,.03) 30deg, transparent 60deg)` }"></div></div>
    <section v-for="n in T" :key="n" class="kpn-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+260},42%,82%), hsl(${(n-1)*52}, 52%,92%))` }">
      <div class="kpn-content"><span class="kpn-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.kpn-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f2f8; color: #1a1a2e; }
.kpn-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.kpn-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.kpn-content { text-align: center; }
.kpn-num { font-size: clamp(5rem, 15vw, 11rem); font-weight: 900; color: rgba(26,26,46,.025); user-select: none; }
.kpn-scope { position: fixed; top: 50%; left: 50%; width: 450px; height: 450px; transform: translate(-50%,-50%); z-index: 45; pointer-events: none; border-radius: 50%; box-shadow: inset 0 0 60px rgba(0,0,0,.03), 0 0 0 9999px rgba(0,0,0,.02); overflow: hidden; }
.kpn-wg { position: absolute; top: 50%; left: 50%; width: 600px; height: 600px; transform-origin: 0 0; }
</style>

<style>
.kpn-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.kpn-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.kpn-nav-dot.kpn-active { background: linear-gradient(135deg, #8b5cf6, #ec4899); border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(139,92,246,.4); }
.kpn-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #8b5cf6, #a855f7, #ec4899); z-index: 1001; }
.kpn-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

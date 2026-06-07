<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7,SS=4;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='stg-dot'+(i===0?' stg-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.stg-dot').forEach((d,j)=>d.classList.toggle('stg-active',j===i));const el=document.querySelector('.stg-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('stgArea')as HTMLElement;pb=document.getElementById('stgProgress');nd=document.getElementById('stgNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.stg-panel')as HTMLElement[];const cards=document.querySelectorAll('.stg-card')as NodeListOf<HTMLElement>
  cards.forEach((cd,ci)=>{(cd as HTMLElement).style.transform=`translate(-50%,-50%) translateY(${ci*5}px) scale(${1-ci*.03})`;(cd as HTMLElement).style.opacity=String(1-ci*.08);(cd as HTMLElement).style.zIndex=String(SS-ci)})
  panels.forEach((p,i)=>{p.style.opacity=i===0?'1':'0';p.style.zIndex=i===0?String(T+10):String(T-i)})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx
      cards.forEach((cd,ci)=>{const sd=ci*.04;const cf=Math.max(0,Math.min(1,(frac-sd)/.5))
        if(cf<.3){const pp=cf/.3;(cd as HTMLElement).style.transform=`translate(-50%,-50%) translateY(${ci*5+pp*12}px) scale(${1-ci*.03})`;(cd as HTMLElement).style.opacity=String(1-ci*.08-pp*.15);(cd as HTMLElement).style.filter='none'}
        else if(cf<.55){const pp=(cf-.3)/.25;const gx=Math.sin(pp*18)*8;(cd as HTMLElement).style.transform=`translate(calc(-50% + ${gx}px),-50%) translateY(${ci*5+12+(cf-.3)*35}px) scale(${1-ci*.03})`;(cd as HTMLElement).style.opacity=String(.85-pp*.35);(cd as HTMLElement).style.filter=`contrast(${1+pp*2}) brightness(${1+pp})`}
        else{const pp=(cf-.55)/.45;(cd as HTMLElement).style.transform=`translate(${-50+pp*50}%,-50%) translateY(${ci*5+47+(cf-.55)*80}px) scale(${1-ci*.03-pp*.15})`;(cd as HTMLElement).style.opacity=String(.5-pp*.5);(cd as HTMLElement).style.filter=`contrast(3) brightness(2)`}
        ;(cd as HTMLElement).style.zIndex=String(SS-ci)})
      panels.forEach((p,i)=>{if(i<idx){p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){p.style.opacity=String(1-frac*.6);p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.4)/.6;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="stgArea" class="stg-page"><div id="stgProgress" class="stg-progress-bar"></div><nav id="stgNav" class="stg-nav-dots"></nav>
    <div class="stg-indicator"><span class="stg-cur">1</span> / {{ T }}</div>
    <div class="stg-stack"><div v-for="i in SS" :key="i" class="stg-card" :style="{ width:`${180+i*25}px`, height:`${250+i*25}px` }"><span class="stg-cn">{{ String(i).padStart(2, '0') }}</span></div></div>
    <section v-for="n in T" :key="n" class="stg-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${(n-1)*52}, 52%,80%), hsl(${(n-1)*52}, 52%,90%))` }"><span class="stg-bg">{{ String(n).padStart(2, '0') }}</span></section>
  </div>
</template>

<style scoped>
.stg-page { font-family: system-ui, -apple-system, sans-serif; background: #f5f2f4; color: #1a1a2e; }
.stg-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }
.stg-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.stg-bg { font-size: 20rem; font-weight: 900; color: rgba(26,26,46,.008); position: absolute; }
.stg-stack { position: fixed; top: 50%; left: 50%; z-index: 60; pointer-events: none; }
.stg-card { position: absolute; border-radius: 16px; border: 1px solid rgba(26,26,46,.06); background: rgba(255,255,255,.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.stg-cn { font-size: 2.5rem; font-weight: 900; color: rgba(26,26,46,.08); }
</style>

<style>
.stg-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.stg-nav-dot { width: 8px; height: 8px; border-radius: 1px; background: rgba(26,26,46,.1); cursor: pointer; border: 1px solid rgba(26,26,46,.08); padding: 0; transition: all .3s; }
.stg-nav-dot.stg-active { background: #34d399; border-color: rgba(26,26,46,.2); transform: scale(1.3) rotate(45deg); box-shadow: 0 0 12px rgba(52,211,153,.4); }
.stg-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #34d399, #6ee7b7); z-index: 1001; }
.stg-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

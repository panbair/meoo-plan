<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7,CDS=6;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='stv-dot'+(i===0?' stv-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.stv-dot').forEach((d,j)=>d.classList.toggle('stv-active',j===i));const el=document.querySelector('.stv-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('stvArea')as HTMLElement;pb=document.getElementById('stvProgress');nd=document.getElementById('stvNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.stv-panel')as HTMLElement[];const cards=document.querySelectorAll('.stv-card')as NodeListOf<HTMLElement>
  cards.forEach((cd,ci)=>{const a=(ci/cards.length)*360;const rad=(a*Math.PI)/180;const r=90+(ci%3)*40;(cd as HTMLElement).style.transform=`translate(${Math.cos(rad)*r}px,${Math.sin(rad)*r}px)`;(cd as HTMLElement).style.opacity='.6'})
  panels.forEach((p,i)=>{p.style.opacity=i===0?'1':'0';p.style.zIndex=i===0?String(T+20):String(T-i)})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx
      cards.forEach((cd,ci)=>{const sd=ci*.04;const cf=Math.max(0,Math.min(1,(frac-sd)/.5));const a=(ci/cards.length)*360+cf*720;const rad=(a*Math.PI)/180;const r=(90+(ci%3)*40)*(1-cf*.95);(cd as HTMLElement).style.transform=`translate(${Math.cos(rad)*r}px,${Math.sin(rad)*r}px) rotate(${cf*480}deg) scale(${Math.max(.1,1-cf*.75)})`;(cd as HTMLElement).style.opacity=String(Math.max(.1,.6-cf*.5));(cd as HTMLElement).style.filter=`blur(${cf*6}px) brightness(${1+cf})`})
      panels.forEach((p,i)=>{if(i<idx){p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){p.style.opacity=String(1-frac*.6);p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.4)/.6;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="stvArea" class="stv-page"><div id="stvProgress" class="stv-progress-bar"></div><nav id="stvNav" class="stv-nav-dots"></nav>
    <div class="stv-indicator"><span class="stv-cur">1</span> / {{ T }}</div>
    <div class="stv-cards-layer"><div v-for="i in CDS" :key="i" class="stv-card" :style="{ '--ch':i*60, width:`${80+i*22}px`, height:`${120+i*22}px` }"><span class="stv-card-num">{{ String(i).padStart(2, '0') }}</span></div></div>
    <div class="stv-vc"></div>
    <section v-for="n in T" :key="n" class="stv-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${(n-1)*52}, 52%,82%), hsl(${(n-1)*52}, 52%,92%))` }"><span class="stv-bg">{{ String(n).padStart(2, '0') }}</span></section>
  </div>
</template>

<style scoped>
.stv-page { font-family: system-ui, -apple-system, sans-serif; background: #f5f3f8; color: #1a1a2e; }
.stv-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity, filter; }
.stv-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.stv-bg { font-size: 20rem; font-weight: 900; color: rgba(26,26,46,.01); position: absolute; user-select: none; }
.stv-cards-layer { position: fixed; top: 50%; left: 50%; z-index: 60; pointer-events: none; }
.stv-card { position: absolute; border-radius: 14px; border: 1px solid rgba(26,26,46,.08); background: rgba(255,255,255,.6); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; transform: translate(-50%,-50%); }
.stv-card-num { font-size: 1.8rem; font-weight: 900; color: rgba(26,26,46,.12); }
.stv-vc { position: fixed; top: 50%; left: 50%; width: 16px; height: 16px; border-radius: 50%; background: rgba(26,26,46,.15); z-index: 61; pointer-events: none; transform: translate(-50%,-50%); box-shadow: 0 0 16px rgba(26,26,46,.08); }
</style>

<style>
.stv-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.stv-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.stv-nav-dot.stv-active { background: #8b5cf6; border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(139,92,246,.4); }
.stv-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd); z-index: 1001; }
.stv-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

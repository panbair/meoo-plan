<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='kc-dot'+(i===0?' kc-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.kc-dot').forEach((d,j)=>d.classList.toggle('kc-active',j===i));const el=document.querySelector('.kc-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('kcArea')as HTMLElement;pb=document.getElementById('kcProgress');nd=document.getElementById('kcNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.kc-panel')as HTMLElement[];const hand=document.querySelector('.kc-hand')as HTMLElement;const center=document.querySelector('.kc-center')as HTMLElement
  panels.forEach((p,i)=>{if(i===0){p.style.opacity='1';p.style.clipPath='circle(80% at 50% 50%)';p.style.filter='';p.style.zIndex=String(T+10)}else{p.style.opacity='0';p.style.clipPath='circle(0% at 50% 50%)';p.style.filter='blur(4px)';p.style.zIndex=String(T-i)}})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const sa=frac*360;if(hand)hand.style.transform=`rotate(${sa}deg)`;if(center)center.style.transform=`translate(-50%,-50%) scale(${1+Math.sin(frac*Math.PI)*.5})`
      panels.forEach((p,i)=>{if(i<idx){p.style.clipPath='circle(0% at 50% 50%)';p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.clipPath='circle(0% at 50% 50%)';p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){const steps=48;const cp:string[]=['50% 50%'];for(let s=0;s<=steps;s++){const a=(s/steps)*360;if(a<=sa)cp.push('50% 50%');else{const r=((a-90)*Math.PI)/180;cp.push(`${50+Math.cos(r)*80}% ${50+Math.sin(r)*80}%`)}};p.style.clipPath=`polygon(${cp.join(',')})`;p.style.opacity=String(1-frac*.4);p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.15)/.85;p.style.clipPath=`circle(${rp*85}% at 50% 50%)`;p.style.opacity=String(Math.min(1,rp*1.3));p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>
<template>
  <div id="kcArea" class="kc-page"><div id="kcProgress" class="kc-progress-bar"></div><nav id="kcNav" class="kc-nav-dots"></nav><div class="kc-indicator"><span class="kc-cur">1</span>/{{T}}</div>
    <div class="kc-rings"><div class="kc-ring r1"></div><div class="kc-ring r2"></div></div>
    <div class="kc-hand"><div class="kc-hand-line"></div><div class="kc-hand-tip"></div></div><div class="kc-center"></div>
    <section v-for="n in T" :key="n" class="kc-panel" :style="{ background: `linear-gradient(${[180,90,180,270,180,90,180][n-1]}deg, hsl(${(n-1)*52},52%,${70+n%2*5}%), hsl(${(n-1)*52+25},40%,${80+n%2*4}%))` }">
      <div class="kc-content"><span class="kc-num">{{String(n).padStart(2,'0')}}</span><span class="kc-label">{{['星','云','银','河','宇','宙','光'][n-1]}}</span></div>
    </section>
  </div>
</template>
<style scoped>
.kc-page{font-family:system-ui,-apple-system,sans-serif;background:#f5f3fa;color:#1a1a2e}
.kc-panel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;will-change:clip-path,opacity,filter}
.kc-panel::before{content:'';position:absolute;inset:24px;border:1px solid rgba(255,255,255,.3);border-radius:20px;pointer-events:none}
.kc-content{text-align:center;position:relative;z-index:2;display:flex;flex-direction:column;align-items:center;gap:8px}
.kc-num{font-size:clamp(5rem,16vw,12rem);font-weight:900;color:rgba(26,26,46,.04);user-select:none}
.kc-label{font-size:clamp(.9rem,1.5vw,1.2rem);color:rgba(26,26,46,.15);letter-spacing:.3em}
.kc-rings{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:45;pointer-events:none}
.kc-ring{position:absolute;border-radius:50%;transform:translate(-50%,-50%)}
.r1{width:200px;height:200px;border:1px solid rgba(26,26,46,.08)}.r2{width:320px;height:320px;border:1px dashed rgba(26,26,46,.05)}
.kc-hand{position:fixed;top:50%;left:50%;width:0;height:0;z-index:60;pointer-events:none;transform-origin:0 0}
.kc-hand-line{position:absolute;left:0;top:0;width:2px;height:160px;background:linear-gradient(to bottom,rgba(26,26,46,.5),rgba(26,26,46,.15),transparent);box-shadow:0 0 8px rgba(26,26,46,.2);border-radius:1px}
.kc-hand-tip{position:absolute;left:-4px;top:156px;width:10px;height:10px;background:rgba(26,26,46,.6);border-radius:50%;box-shadow:0 0 12px rgba(26,26,46,.3)}
.kc-center{position:fixed;top:50%;left:50%;width:12px;height:12px;background:rgba(26,26,46,.6);border-radius:50%;z-index:61;pointer-events:none;transform:translate(-50%,-50%);box-shadow:0 0 16px rgba(26,26,46,.3)}
</style>
<style>
.kc-nav-dots{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:1000;display:flex;flex-direction:column;gap:10px}
.kc-nav-dot{width:10px;height:10px;border-radius:50%;background:rgba(26,26,46,.15);cursor:pointer;border:2px solid transparent;padding:0;transition:all .3s}
.kc-nav-dot:hover{background:rgba(26,26,46,.4);transform:scale(1.3)}
.kc-nav-dot.kc-active{background:#7c5cf0;border-color:rgba(26,26,46,.3);transform:scale(1.5);box-shadow:0 0 14px rgba(124,92,240,.4)}
.kc-progress-bar{position:fixed;top:0;left:0;height:3px;width:0%;background:linear-gradient(90deg,#7c5cf0,#a78bfa,#c4b5fd);z-index:1001}
.kc-indicator{position:fixed;top:28px;right:60px;z-index:1000;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);padding:8px 20px;border-radius:24px;font-size:.85rem;border:1px solid rgba(255,255,255,.1);color:rgba(26,26,46,.75)}
</style>

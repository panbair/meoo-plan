<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='mex-dot'+(i===0?' mex-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.mex-dot').forEach((d,j)=>d.classList.toggle('mex-active',j===i));const el=document.querySelector('.mex-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('mexArea')as HTMLElement;pb=document.getElementById('mexProgress');nd=document.getElementById('mexNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.mex-panel')as HTMLElement[];const cards=document.querySelectorAll('.mex-card')as NodeListOf<HTMLElement>
  cards.forEach((cd,ci)=>{const h=[160,220,140,250,180,200,150,230];(cd as HTMLElement).style.height=`${h[ci]}px`;(cd as HTMLElement).style.opacity='0';(cd as HTMLElement).style.transform='translateY(30px) scale(.9)'})
  panels.forEach((p,i)=>{p.style.opacity=i===0?'1':'0';p.style.zIndex=i===0?String(T+10):String(T-i)})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx
      cards.forEach((cd,ci)=>{const col=ci%2;const sd=ci*.04;const cf=Math.max(0,Math.min(1,(frac-sd)/.3));(cd as HTMLElement).style.transform=`translateX(${col===0?(1-cf)*-30:(1-cf)*30}px) translateY(${(1-cf)*30}px) scale(${.85+cf*.15})`;(cd as HTMLElement).style.opacity=String(cf);(cd as HTMLElement).style.filter=`blur(${(1-cf)*5}px)`})
      panels.forEach((p,i)=>{if(i<idx){p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){p.style.opacity=String(1-frac*.5);p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.3)/.7;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="mexArea" class="mex-page"><div id="mexProgress" class="mex-progress-bar"></div><nav id="mexNav" class="mex-nav-dots"></nav>
    <div class="mex-indicator"><span class="mex-cur">1</span> / {{ T }}</div>
    <section v-for="n in T" :key="n" class="mex-panel" :style="{ background: `radial-gradient(ellipse at 50% 30%, hsl(${(n-1)*52}, 52%,84%), hsl(${(n-1)*52}, 52%,94%))` }">
      <div class="mex-grid"><div class="mex-col"><div v-for="ci in [0,2,4,6]" :key="ci" class="mex-card" :style="{ '--ch': (n*40+ci*60)%360 }"><span class="mex-cn">{{ String(n).padStart(2, '0') }}.{{ ci+1 }}</span></div></div>
      <div class="mex-col mex-col-offset"><div v-for="ci in [1,3,5,7]" :key="ci" class="mex-card" :style="{ '--ch': (n*40+ci*60)%360 }"><span class="mex-cn">{{ String(n).padStart(2, '0') }}.{{ ci+1 }}</span></div></div></div>
    </section>
  </div>
</template>

<style scoped>
.mex-page { font-family: system-ui, -apple-system, sans-serif; background: #f2f5f8; color: #1a1a2e; }
.mex-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }
.mex-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.mex-grid { display: flex; gap: 14px; max-width: 560px; padding: 20px; }
.mex-col { display: flex; flex-direction: column; gap: 10px; flex: 1; }
.mex-col-offset { padding-top: 40px; }
.mex-card { border-radius: 14px; border: 1px solid rgba(26,26,46,.05); background: rgba(255,255,255,.55); backdrop-filter: blur(6px); display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; width: 100%; }
.mex-cn { font-size: 1rem; font-weight: 700; color: rgba(26,26,46,.1); }
</style>

<style>
.mex-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.mex-nav-dot { width: 10px; height: 10px; border-radius: 3px; background: rgba(26,26,46,.08); cursor: pointer; border: none; padding: 0; transition: all .3s; }
.mex-nav-dot.mex-active { background: #6b8cce; transform: scale(1.3); box-shadow: 0 0 12px rgba(107,140,206,.4); }
.mex-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #5b7cb8, #8ba8d8); z-index: 1001; }
.mex-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

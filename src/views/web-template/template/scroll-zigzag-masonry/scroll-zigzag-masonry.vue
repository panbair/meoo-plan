<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const R=3,C=3,T=R*C;let cur=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='zgm-dot'+(i===0?' zgm-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.zgm-dot').forEach((d,j)=>d.classList.toggle('zgm-active',j===i));const el=document.querySelector('.zgm-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(cur+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}}
function init(){sa=document.getElementById('zgmArea')as HTMLElement;pb=document.getElementById('zgmProgress');nd=document.getElementById('zgmNav');if(!sa)return;sa.style.height=T*100+'vh';const track=document.getElementById('zgmTrack')as HTMLElement;const cards=document.querySelectorAll('.zgm-card')as NodeListOf<HTMLElement>
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const row=Math.floor(idx/C);const col=idx%C;const er=row%2===0;const vc=er?col:(C-1-col);if(track)track.style.transform=`translate(${-vc*100}vw,${-row*100}vh)`
      cards.forEach((cd,ci)=>{const cr=Math.floor(ci/C);const cc=ci%C;const ci2=cr*C+(cr%2===0?cc:C-1-cc);const d=ci2-f;const ad=Math.abs(d)
        if(ad<.4){(cd as HTMLElement).style.opacity=String(1-ad);(cd as HTMLElement).style.transform='';(cd as HTMLElement).style.filter='brightness(1)'}
        else if(ad<1.5){(cd as HTMLElement).style.opacity=String(Math.max(0,1-ad));(cd as HTMLElement).style.transform=`translateY(${ad*18}px)`;(cd as HTMLElement).style.filter=`brightness(${1-ad*.4})`}
        else{(cd as HTMLElement).style.opacity='0';(cd as HTMLElement).style.filter='brightness(.3)'}});if(idx!==cur){cur=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="zgmArea" class="zgm-page"><div id="zgmProgress" class="zgm-progress-bar"></div><nav id="zgmNav" class="zgm-nav-dots"></nav>
    <div class="zgm-indicator"><span class="zgm-cur">1</span> / {{ T }}</div>
    <div class="zgm-sticky"><div id="zgmTrack" class="zgm-track"><div v-for="r in R" :key="r" class="zgm-row"><div v-for="c in C" :key="c" class="zgm-cell">
      <div class="zgm-card" :style="{ background:`linear-gradient(135deg, hsl(${(r*C+c)*45}, 55%,84%), hsl(${(r*C+c)*45}, 55%,94%))`, border:`1px solid hsla(${(r*C+c)*40+200},40%,60%,.1)` }"><span class="zgm-cn">{{ String((r-1)*C+c).padStart(2, '0') }}</span><span class="zgm-arrow">{{ r%2===1?'←':'→' }}</span></div>
    </div></div></div></div>
  </div>
</template>

<style scoped>
.zgm-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f3f6; color: #1a1a2e; }
.zgm-sticky { position: sticky; top: 0; width: 100vw; height: 100vh; overflow: hidden; }
.zgm-track { display: grid; grid-template-rows: repeat(3, 100vh); width: 300vw; height: 300vh; will-change: transform; }
.zgm-row { display: grid; grid-template-columns: repeat(3, 100vw); }
.zgm-cell { display: flex; align-items: center; justify-content: center; }
.zgm-card { border-radius: 16px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width: 60%; will-change: opacity, transform, filter; padding: 20px; backdrop-filter: blur(8px); }
.zgm-cn { font-size: 2.5rem; font-weight: 900; color: rgba(26,26,46,.04); }
.zgm-arrow { font-size: 1.2rem; color: rgba(26,26,46,.06); }
</style>

<style>
.zgm-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.zgm-nav-dot { width: 8px; height: 8px; border-radius: 2px; background: rgba(26,26,46,.08); cursor: pointer; border: none; padding: 0; transition: all .3s; }
.zgm-nav-dot.zgm-active { background: #8b5cf6; transform: scale(1.3) rotate(45deg); box-shadow: 0 0 12px rgba(139,92,246,.4); }
.zgm-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #8b5cf6, #a78bfa); z-index: 1001; }
.zgm-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

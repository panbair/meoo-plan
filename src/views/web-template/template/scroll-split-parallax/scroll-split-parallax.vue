<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='spp-dot'+(i===0?' spp-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.spp-dot').forEach((d,j)=>d.classList.toggle('spp-active',j===i));const el=document.querySelector('.spp-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('sppArea')as HTMLElement;pb=document.getElementById('sppProgress');nd=document.getElementById('sppNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.spp-panel')as HTMLElement[];const sl=document.querySelector('.spp-split-line')as HTMLElement;const tl=document.querySelector('.spp-top')as HTMLElement;const bl=document.querySelector('.spp-bot')as HTMLElement
  panels.forEach((p,i)=>{p.style.opacity=i===0?'1':'0';p.style.zIndex=i===0?String(T+10):String(T-i)})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const sy=50+Math.sin(frac*Math.PI*2)*12
      if(sl){sl.style.top=`${sy}%`;sl.style.opacity=String(.3+Math.sin(frac*Math.PI)*.2)}
      if(tl)tl.style.transform=`translateY(${-frac*30}px)`;if(bl)bl.style.transform=`translateY(${frac*30}px)`
      panels.forEach((p,i)=>{if(i<idx){p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){p.style.clipPath=`inset(0 0 ${(1-frac)*sy+frac*50}% 0)`;p.style.opacity='1';p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.3)/.7;p.style.clipPath=`inset(${(1-rp)*50+rp*sy}% 0 0 0)`;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="sppArea" class="spp-page"><div id="sppProgress" class="spp-progress-bar"></div><nav id="sppNav" class="spp-nav-dots"></nav>
    <div class="spp-indicator"><span class="spp-cur">1</span> / {{ T }}</div>
    <div class="spp-split-line"></div>
    <section v-for="n in T" :key="n" class="spp-panel" :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*52}, 52%,84%), hsl(${(n-1)*52}, 52%,94%))` }">
      <div class="spp-top" :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*52}, 52%,86%), hsl(${(n-1)*52}, 52%,94%))` }"><span class="spp-num">{{ String(n).padStart(2, '0') }}</span></div>
      <div class="spp-bot" :style="{ background: `linear-gradient(180deg, hsl(${(n-1)*52}, 52%,94%), hsl(${(n-1)*52}, 52%,86%))` }"><span class="spp-num spp-num-bot">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.spp-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f3f6; color: #1a1a2e; }
.spp-panel { position: absolute; inset: 0; display: flex; flex-direction: column; will-change: clip-path, opacity; }
.spp-top{flex:1;display:flex;align-items:center;justify-content:center;will-change:transform}.spp-bot{flex:1;display:flex;align-items:center;justify-content:center;will-change:transform}
.spp-num{font-size:clamp(4rem,12vw,8rem);font-weight:900;color:rgba(26,26,46,.03);user-select:none}
.spp-num-bot{color:rgba(26,26,46,.03)}
.spp-split-line{position:fixed;left:0;width:100%;height:2px;top:50%;background:rgba(26,26,46,.06);z-index:55;pointer-events:none}
</style>

<style>
.spp-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.spp-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.spp-nav-dot.spp-active { background: linear-gradient(135deg, #8899cc, #cc9966); border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(136,153,204,.4); }
.spp-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #8899cc, #cc9966); z-index: 1001; }
.spp-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

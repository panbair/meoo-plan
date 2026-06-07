<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7,R=380,AS=360/T;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='crv-dot'+(i===0?' crv-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.crv-dot').forEach((d,j)=>d.classList.toggle('crv-active',j===i));const el=document.querySelector('.crv-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('crvArea')as HTMLElement;pb=document.getElementById('crvProgress');nd=document.getElementById('crvNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.crv-panel')as HTMLElement[];const ring=document.querySelector('.crv-ring')as HTMLElement;const vc=document.querySelector('.crv-vc')as HTMLElement
  panels.forEach((p,i)=>{const a=AS*i;const rad=(a*Math.PI)/180;p.style.transform=`translate3d(${Math.sin(rad)*R}px,0,${Math.cos(rad)*R}px) rotateY(${-a}deg)`;p.style.opacity=i===0?'1':'.2';p.style.filter=i===0?'none':'brightness(.3) blur(2px)';p.style.zIndex=i===0?String(T+10):String(T-i)})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const ra=-f*AS;if(ring)ring.style.transform=`translate(-50%,-50%) rotateY(${ra}deg)`
      panels.forEach((p,i)=>{const a=AS*i+ra;const rad=(a*Math.PI)/180;const x=Math.sin(rad)*R;const z=Math.cos(rad)*R;const fn=(z+R)/(2*R);const br=.15+fn*.85;const po=.08+fn*.92;const bl=(1-fn)*8
        if(i===idx&&frac>.7){const vp=(frac-.7)/.3;const vs=1-vp;p.style.transform=`translate3d(${x*vs}px,0,${z*vs}px) rotateY(${-a}deg) scale(${Math.max(.05,vs)})`;p.style.opacity=String(Math.max(0,1-vp));p.style.filter=`brightness(${1+vp*2}) blur(${vp*10}px)`;p.style.zIndex=String(T+20)}
        else if(i===(idx+1)%T&&frac>.5){const ep=(frac-.5)/.5;p.style.transform=`translate3d(${x}px,0,${z}px) rotateY(${-a}deg) scale(${Math.min(1.1,.05+ep*1.5)})`;p.style.opacity=String(Math.min(1,ep*1.3));p.style.filter=`brightness(${.1+ep*.9}) blur(${(1-ep)*12}px)`;p.style.zIndex=String(T+15)}
        else{p.style.transform=`translate3d(${x}px,0,${z}px) rotateY(${-a}deg) scale(1)`;p.style.opacity=String(po);p.style.filter=`brightness(${br}) blur(${bl}px)`;p.style.zIndex=String(Math.round(fn*10))}})
      if(vc){const va=frac>.7?(frac-.7)/.3:0;vc.style.opacity=String(va*.7);vc.style.transform=`translate(-50%,-50%) scale(${.3+va*1.2})`}
      if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="crvArea" class="crv-page"><div id="crvProgress" class="crv-progress-bar"></div><nav id="crvNav" class="crv-nav-dots"></nav>
    <div class="crv-indicator"><span class="crv-cur">1</span> / {{ T }}</div>
    <div class="crv-stage"><div class="crv-ring"><section v-for="n in T" :key="n" class="crv-panel" :style="{ background: `linear-gradient(135deg, hsl(${n*50+250},40%,80%), hsl(${(n-1)*52}, 52%,90%))`, border: `1px solid hsla(${n*50+250},40%,60%,.15)` }"><div class="crv-content"><span class="crv-num">{{ String(n).padStart(2, '0') }}</span></div></section></div></div>
    <div class="crv-vc"></div>
  </div>
</template>

<style scoped>
.crv-page { font-family: system-ui, -apple-system, sans-serif; background: #f4f3f8; perspective: 1600px; }
.crv-stage { position: fixed; top: 50%; left: 50%; transform-style: preserve-3d; z-index: 10; }
.crv-ring { position: absolute; transform-style: preserve-3d; width: 0; height: 0; will-change: transform; }
.crv-panel { position: absolute; width: 240px; height: 340px; left: -120px; top: -170px; border-radius: 18px; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; backface-visibility: hidden; }
.crv-content { text-align: center; }
.crv-num { font-size: 4rem; font-weight: 900; color: rgba(26,26,46,.04); user-select: none; }
.crv-vc { position: fixed; top: 50%; left: 50%; width: 24px; height: 24px; border-radius: 50%; background: rgba(26,26,46,.2); z-index: 100; pointer-events: none; opacity: 0; transform: translate(-50%,-50%); box-shadow: 0 0 20px rgba(26,26,46,.1); }
</style>

<style>
.crv-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.crv-nav-dot { width: 10px; height: 10px; border-radius: 50%; background: rgba(26,26,46,.12); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.crv-nav-dot.crv-active { background: #8b5cf6; border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(139,92,246,.4); }
.crv-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #8b5cf6, #a78bfa, #c4b5fd); z-index: 1001; }
.crv-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

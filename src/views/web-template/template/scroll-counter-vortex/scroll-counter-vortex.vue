<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='ctv-dot'+(i===0?' ctv-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.ctv-dot').forEach((d,j)=>d.classList.toggle('ctv-active',j===i));const el=document.querySelector('.ctv-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'elastic.out(1,.5)'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('ctvArea')as HTMLElement;pb=document.getElementById('ctvProgress');nd=document.getElementById('ctvNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.ctv-panel')as HTMLElement[];const cnt=document.querySelector('.ctv-counter')as HTMLElement;const rings=document.querySelectorAll('.ctv-ring')as NodeListOf<HTMLElement>
  panels.forEach((p,i)=>{if(i===0){p.style.opacity='1';p.style.transform='';p.style.zIndex=String(T+10)}else{p.style.opacity='0';p.style.transform='scale(.3)';p.style.filter='blur(10px)';p.style.zIndex=String(T-i)}})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.4,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const dn=Math.round(f+1);if(cnt){cnt.textContent=String(dn).padStart(2,'0');cnt.style.transform=`scale(${1+Math.abs(Math.sin(frac*Math.PI))*.12})`;cnt.style.color=`hsla(${f*50},60%,40%,${.1+Math.abs(Math.sin(frac*Math.PI))*.15})`}
      rings.forEach((r,ri)=>{const rp=Math.sin(frac*Math.PI+ri*.4);(r as HTMLElement).style.transform=`translate(-50%,-50%) scale(${.5+Math.abs(rp)*1.2})`;(r as HTMLElement).style.opacity=String(.1+Math.abs(rp)*.25)})
      panels.forEach((p,i)=>{if(i<idx){p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){if(frac<.6){const pp=frac/.6;p.style.opacity='1';p.style.transform=`scale(${1-pp*.4}) rotate(${pp*150}deg)`;p.style.filter=`blur(${pp*5}px)`;p.style.zIndex=String(T+10)}else{const pp=(frac-.6)/.4;p.style.opacity=String(1-pp);p.style.transform=`scale(${.6-pp*.5})`;p.style.filter=`blur(${5+pp*12}px)`;p.style.zIndex=String(T+20)}}else if(i===idx+1){const rp=Math.max(0,frac-.35)/.65;const ep=1-Math.pow(1-rp,4);p.style.opacity=String(rp);p.style.transform=`scale(${.1+ep*.9})`;p.style.filter=`blur(${(1-rp)*12}px)`;p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="ctvArea" class="ctv-page"><div id="ctvProgress" class="ctv-progress-bar"></div><nav id="ctvNav" class="ctv-nav-dots"></nav>
    <div class="ctv-indicator"><span class="ctv-cur">1</span> / {{ T }}</div>
    <div class="ctv-counter">01</div>
    <div class="ctv-rings"><div v-for="r in 5" :key="r" class="ctv-ring" :style="{ width: `${r*60}px`, height: `${r*60}px` }"></div></div>
    <section v-for="n in T" :key="n" class="ctv-panel" :style="{ background: `radial-gradient(ellipse at 50% 50%, hsl(${n*50+280},40%,82%), hsl(${(n-1)*52}, 52%,92%))` }">
      <div class="ctv-content"><span class="ctv-num">{{ String(n).padStart(2, '0') }}</span></div>
    </section>
  </div>
</template>

<style scoped>
.ctv-page { font-family: system-ui, -apple-system, sans-serif; background: #f6f2f8; color: #1a1a2e; }
.ctv-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter; }
.ctv-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.ctv-content { text-align: center; }
.ctv-num { font-size: clamp(5rem, 16vw, 12rem); font-weight: 900; color: rgba(26,26,46,.02); user-select: none; }
.ctv-counter { position: fixed; top: 50%; left: 50%; transform: translate(-50%,-50%); z-index: 80; pointer-events: none; font-size: 6rem; font-weight: 900; color: rgba(26,26,46,.04); will-change: transform, color; }
.ctv-rings { position: fixed; top: 50%; left: 50%; z-index: 50; pointer-events: none; }
.ctv-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(26,26,46,.06); transform: translate(-50%,-50%); will-change: transform, opacity; }
</style>

<style>
.ctv-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.ctv-nav-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.ctv-nav-dot.ctv-active { background: #a855f7; border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(168,85,247,.4); }
.ctv-progress-bar { position: fixed; top: 0; left: 0; height: 3px; width: 0%; background: linear-gradient(90deg, #a855f7, #c084fc, #e0b0ff); z-index: 1001; }
.ctv-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

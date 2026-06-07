<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const T=7;let c=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='gpx-dot'+(i===0?' gpx-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.gpx-dot').forEach((d,j)=>d.classList.toggle('gpx-active',j===i));const el=document.querySelector('.gpx-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.6,ease:'power2.inOut'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(c+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(c-1)}}
function init(){sa=document.getElementById('gpxArea')as HTMLElement;pb=document.getElementById('gpxProgress');nd=document.getElementById('gpxNav');if(!sa)return;sa.style.height=T*100+'vh';const panels=gsap.utils.toArray('.gpx-panel')as HTMLElement[];const cards=document.querySelectorAll('.gpx-gc')as NodeListOf<HTMLElement>
  panels.forEach((p,i)=>{p.style.opacity=i===0?'1':'0';p.style.zIndex=i===0?String(T+20):String(T-i)})
  cards.forEach((cd,ci)=>{(cd as HTMLElement).style.transform=`translateY(${50+ci*18}px)`;(cd as HTMLElement).style.opacity='0';(cd as HTMLElement).style.filter='blur(8px)'})
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.5,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx
      cards.forEach((cd,ci)=>{const sd=ci*.05;const cf=Math.max(0,Math.min(1,(frac-sd)/.35));const py=(ci%3-1)*25*(1-cf);(cd as HTMLElement).style.transform=`translateY(${py+(1-cf)*50}px) scale(${.85+cf*.15})`;(cd as HTMLElement).style.opacity=String(cf);(cd as HTMLElement).style.filter=`blur(${(1-cf)*8}px)`;(cd as HTMLElement).style.backdropFilter=`blur(${8+cf*6}px)`})
      panels.forEach((p,i)=>{if(i<idx){p.style.opacity='0';p.style.zIndex=String(i)}else if(i>idx+1){p.style.opacity='0';p.style.zIndex=String(T-i)}else if(i===idx){p.style.opacity=String(1-frac*.4);p.style.zIndex=String(T+10)}else if(i===idx+1){const rp=Math.max(0,frac-.25)/.75;p.style.opacity=String(rp);p.style.zIndex=String(T+5)}});if(idx!==c){c=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="gpxArea" class="gpx-page"><div id="gpxProgress" class="gpx-progress-bar"></div><nav id="gpxNav" class="gpx-nav-dots"></nav>
    <div class="gpx-indicator"><span class="gpx-cur">1</span> / {{ T }}</div>
    <section v-for="n in T" :key="n" class="gpx-panel" :style="{ background: `radial-gradient(ellipse at 50% 40%, hsl(${(n-1)*52}, 52%,84%), hsl(${(n-1)*52}, 52%,94%))` }">
      <div class="gpx-content">
        <div v-for="i in 4" :key="i" class="gpx-gc" :style="{ '--ch': n*50+i*80, marginTop: `${i*16}px` }"><span class="gpx-card-num">{{ String(n).padStart(2, '0') }}.{{ i }}</span></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.gpx-page { font-family: system-ui, -apple-system, sans-serif; background: #f2f4f8; color: #1a1a2e; }
.gpx-panel { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; will-change: opacity; }
.gpx-panel::before { content: ''; position: absolute; inset: 24px; border: 1px solid rgba(26,26,46,.04); border-radius: 20px; pointer-events: none; }
.gpx-content { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; max-width: 600px; padding: 30px; }
.gpx-gc { width: 120px; height: 170px; border-radius: 18px; border: 1px solid rgba(26,26,46,.06); background: rgba(255,255,255,.5); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; will-change: transform, opacity, filter, backdrop-filter; }
.gpx-card-num { font-size: 1.5rem; font-weight: 700; color: rgba(26,26,46,.1); }
</style>

<style>
.gpx-nav-dots { position: fixed; right: 24px; top: 50%; transform: translateY(-50%); z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
.gpx-nav-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(26,26,46,.1); cursor: pointer; border: 2px solid transparent; padding: 0; transition: all .3s; }
.gpx-nav-dot.gpx-active { background: rgba(100,140,200,.7); border-color: rgba(26,26,46,.2); transform: scale(1.5); box-shadow: 0 0 14px rgba(100,140,200,.4); }
.gpx-progress-bar { position: fixed; top: 0; left: 0; height: 2px; width: 0%; background: linear-gradient(90deg, #8899cc, #aabbee, #ccddff); z-index: 1001; }
.gpx-indicator { position: fixed; top: 28px; right: 60px; z-index: 1000; background: rgba(255,255,255,.75); backdrop-filter: blur(12px); padding: 8px 20px; border-radius: 24px; font-size: .85rem; border: 1px solid rgba(255,255,255,.1); color: rgba(26,26,46,.7); }
</style>

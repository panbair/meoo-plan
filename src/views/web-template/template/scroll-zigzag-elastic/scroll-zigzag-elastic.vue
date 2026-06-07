<script setup lang="ts">import { onMounted, onUnmounted, nextTick } from 'vue'; import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger'; import { ScrollToPlugin } from 'gsap/ScrollToPlugin'; gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
const R=3,C=3,T=R*C;let cur=0,sa:HTMLElement|null=null,pb:HTMLElement|null=null,nd:HTMLElement|null=null
function cd(){if(!nd)return;nd.innerHTML='';for(let i=0;i<T;i++){const d=document.createElement('button');d.className='zge-dot'+(i===0?' zge-active':'');d.addEventListener('click',()=>go(i));nd.appendChild(d)}}
function uu(i:number){document.querySelectorAll('.zge-dot').forEach((d,j)=>d.classList.toggle('zge-active',j===i));const el=document.querySelector('.zge-cur');if(el)el.textContent=String(i+1);if(pb)pb.style.width=((i+1)/T)*100+'%'}
function go(i:number){i=Math.max(0,Math.min(i,T-1));gsap.to(window,{scrollTo:{y:i*innerHeight,autoKill:false},duration:.8,ease:'elastic.out(1,.6)'})}
function kd(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowRight'){e.preventDefault();go(cur+1)}else if(e.key==='ArrowUp'||e.key==='ArrowLeft'){e.preventDefault();go(cur-1)}}
function init(){sa=document.getElementById('zgeArea')as HTMLElement;pb=document.getElementById('zgeProgress');nd=document.getElementById('zgeNav');if(!sa)return;sa.style.height=T*100+'vh';const track=document.getElementById('zgeTrack')as HTMLElement;const panels=gsap.utils.toArray('.zge-panel')as HTMLElement[]
  ScrollTrigger.create({trigger:sa,start:'top top',end:'bottom bottom',scrub:.3,onUpdate:(self)=>{const f=self.progress*(T-1);const idx=Math.floor(f);const frac=f-idx;const row=Math.floor(idx/C);const col=idx%C;const er=row%2===0;const vc=er?col:(C-1-col);const tx=-vc*100;const ty=-row*100;const eo=Math.sin(frac*Math.PI)*22*(1-frac);const ex=tx+eo*(er?1:-1);const ey=ty-Math.abs(eo)*.3
      if(track){track.style.transform=`translate(${ex}vw,${ey}vh)`;track.style.transition=frac<.1||frac>.9?'transform .15s cubic-bezier(.68,-.55,.265,1.55)':'none'}
      panels.forEach((p,i)=>{const d=Math.abs(i-f);if(d<.15){p.style.filter='brightness(1)';p.style.transform=`scale(${1+Math.sin(frac*Math.PI)*.06})`}else if(d<1){p.style.filter=`brightness(${1-d*.4})`;p.style.transform=''}else{p.style.filter='brightness(.4)';p.style.transform=''}});if(idx!==cur){cur=idx;uu(idx)}}});document.addEventListener('keydown',kd);cd();uu(0)}
function destroy(){ScrollTrigger.getAll().forEach(st=>st.kill());document.removeEventListener('keydown',kd)}
onMounted(()=>nextTick(init));onUnmounted(destroy)
</script>

<template>
  <div id="zgeArea" class="zge-page"><div id="zgeProgress" class="zge-progress-bar"></div><nav id="zgeNav" class="zge-nav-dots"></nav>
    <div class="zge-indicator"><span class="zge-cur">1</span>/{{T}}</div>
    <div class="zge-sticky"><div id="zgeTrack" class="zge-track">
      <section v-for="n in T" :key="n" class="zge-panel" :style="{ background: `linear-gradient(${Math.floor((n-1)/C)%2===0?135:225}deg, hsl(${(n-1)*42},${48+(n%3)*4}%,${68+(n%2)*5}%), hsl(${(n-1)*42+30},${38+(n%3)*3}%,${78+(n%2)*5}%))` }">
        <div class="zge-content"><span class="zge-num">{{String(n).padStart(2,'0')}}</span><span class="zge-arrow">{{['↗','→','↘','↙','←','↖','↗','→','↘'][n-1]}}</span></div>
      </section>
    </div></div>
  </div>
</template>

<style scoped>
.zge-page{font-family:system-ui,-apple-system,sans-serif;background:#f5f2f0;color:#1a1a2e}
.zge-sticky{position:sticky;top:0;width:100vw;height:100vh;overflow:hidden}
.zge-track{display:grid;grid-template-columns:repeat(3,100vw);grid-template-rows:repeat(3,100vh);width:300vw;height:300vh;will-change:transform}
.zge-panel{display:flex;align-items:center;justify-content:center;will-change:filter,transform}
.zge-panel::before{content:'';position:absolute;inset:24px;border:1px solid rgba(255,255,255,.3);border-radius:20px;pointer-events:none}
.zge-content{text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px}
.zge-num{font-size:clamp(3rem,10vw,7rem);font-weight:900;color:rgba(26,26,46,.04);user-select:none}
.zge-arrow{font-size:2rem;color:rgba(26,26,46,.1)}
</style>

<style>
.zge-nav-dots{position:fixed;right:24px;top:50%;transform:translateY(-50%);z-index:1000;display:flex;flex-direction:column;gap:10px}
.zge-nav-dot{width:10px;height:10px;border-radius:3px;background:rgba(26,26,46,.15);cursor:pointer;border:none;padding:0;transition:all .3s cubic-bezier(.68,-.55,.265,1.55)}
.zge-nav-dot.zge-active{background:#f59e0b;box-shadow:0 0 16px rgba(245,158,11,.5);transform:scale(1.3)}
.zge-progress-bar{position:fixed;top:0;left:0;height:4px;width:0%;background:linear-gradient(90deg,#f59e0b,#fbbf24,#fcd34d);z-index:1001}
.zge-indicator{position:fixed;top:28px;right:60px;z-index:1000;background:rgba(255,255,255,.8);backdrop-filter:blur(12px);padding:8px 20px;border-radius:24px;font-size:.85rem;border:1px solid rgba(255,255,255,.1);color:rgba(26,26,46,.75)}
</style>

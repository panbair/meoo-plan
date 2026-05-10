<template>
  <div id="smooth-wrapper" ref="main">
    <div id="smooth-content">
      <header class="header">
        <button class="button" @click="scrollTo">Jump to C</button>
      </header>
      <div class="box box-a gradient-purple" >a</div>
      <div class="box box-b gradient-green" >b</div>
      <div class="box box-c gradient-orange">c</div>
      <div class="line"></div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const main = ref();
let smoother;
let ctx;
let boxCTimeline;

const scrollTo = () => {
  smoother.scrollTo('.box-c', true, 'center center');
};

onMounted(() => {
  ctx = gsap.context(() => {
    smoother = ScrollSmoother.create({
      smooth: 2,
      effects: false,
    });
    ScrollTrigger.create({
      trigger: '.box-c',
      pin: true,
      start: 'center center',
      end: '+=300',
      markers: true,
    });

    // Box-c 进入屏幕时开始动画
    ScrollTrigger.create({
      trigger: '.box-c',
      start: 'top 80%',
      onEnter: () => {
        // 弹性旋转缩放动画
        boxCTimeline = gsap.timeline({ repeatDelay: 0.5 });
        boxCTimeline.to('.box-c', {
          rotation: 360,
          scale: 1.5,
          borderRadius: '50%',
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
        });

        // 脉冲发光效果
        gsap.to('.box-c', {
          boxShadow: '0 0 80px rgba(255, 135, 9, 1), 0 0 120px rgba(247, 189, 248, 0.6)',
          duration: 0.8,
          ease: 'power2.inOut',
        });
      },
      onLeave: () => {
        // 移出屏幕时恢复
        if (boxCTimeline) boxCTimeline.kill();
        gsap.to('.box-c', {
          rotation: 0,
          scale: 1,
          borderRadius: '12px',
          boxShadow: 'none',
          duration: 0.5,
          ease: 'power2.out'
        });
      },
      onEnterBack: () => {
        // 重新进入时恢复动画
        boxCTimeline = gsap.timeline({  repeatDelay: 0.5 });
        boxCTimeline.to('.box-c', {
          rotation: 360,
          scale: 1.5,
          borderRadius: '50%',
          duration: 1,
          ease: 'elastic.out(1, 0.5)',
        });

        gsap.to('.box-c', {
          boxShadow: '0 0 80px rgba(255, 135, 9, 1), 0 0 120px rgba(247, 189, 248, 0.6)',
          duration: 0.8,
          ease: 'power2.inOut',
        });
      },
      onLeaveBack: () => {
        // 再次移出时恢复
        if (boxCTimeline) boxCTimeline.kill();
        gsap.to('.box-c', {
          rotation: 0,
          scale: 1,
          borderRadius: '12px',
          boxShadow: 'none',
          duration: 0.5,
          ease: 'power2.out'
        });
      }
    });
  }, main.value);
});
onUnmounted(() => {
  ctx.revert();
});

</script>
<style>
/* Typography */
@font-face {
  font-display: block;
  font-family: Mori;
  font-style: normal;
  font-weight: 400;
  src: url(https://assets.codepen.io/16327/PPMori-Regular.woff) format("woff");
}

@font-face {
  font-display: block;
  font-family: Mori;
  font-style: normal;
  font-weight: 600;
  src: url(https://assets.codepen.io/16327/PPMori-SemiBold.woff) format("woff");
}

/* Root Variables */
:root {
  --color-shockingly-green: #0ae448;
  --color-just-black: #0e100f;
  --color-surface-white: #fffce1;
  --color-orangey: #ff8709;
  --color-lilac: #9d95ff;
  --color-lt-green: #abff84;
  --color-blue: #00bae2;
  --gradient-macha: linear-gradient(
      114.41deg,
      var(--color-shockingly-green) 20.74%,
      var(--color-lt-green) 65.5%
  );
  --gradient-orange-crush: linear-gradient(
      111.45deg,
      var(--color-orangey) 19.42%,
      #f7bdf8 73.08%
  );
  --gradient-purple-haze: linear-gradient(
      153.58deg,
      #f7bdf8 32.25%,
      #2f3cc0 92.68%
  );
}

/* Base Styles */
body {
  color: var(--color-surface-white);
  background-color: var(--color-just-black);
  font-family: Mori, sans-serif;
  font-weight: 400;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* Header */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}


/* Smooth Content Wrapper */
#smooth-content {
  overflow: visible;
  width: 100%;
  height: 4000px;
}

/* Box Styles */
.box {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  text-align: center;
  will-change: transform;
}

.box-a {
  top: 200px;
}

.box-b {
  top: 600px;
}

.box-c {
  top: 2000px;
}

/* Gradient Classes */
.gradient-green {
  background: var(--gradient-macha),
  url('https://assets.codepen.io/16327/noise-e82662fe.png');
  background-blend-mode: color-dodge;
}

.gradient-orange {
  background: var(--gradient-orange-crush),
  url('https://assets.codepen.io/16327/noise-e82662fe.png');
  background-blend-mode: color-dodge;
}

.gradient-purple {
  background: var(--gradient-purple-haze),
  url('https://assets.codepen.io/16327/noise-e82662fe.png');
  background-blend-mode: color-dodge;
}

/* Button Styles */
button {
  display: inline-block;
  outline: none;
  padding: 12px 25px;
  background: var(--color-just-black);
  border: solid 2px var(--color-surface-white);
  color: var(--color-surface-white);
  text-decoration: none;
  border-radius: 99px;
  text-transform: uppercase;
  font-weight: 600;
  cursor: pointer;
  line-height: 18px;
}

button:hover {
  background: var(--color-lt-green);
  color: white;
  text-decoration: none;
}


</style>

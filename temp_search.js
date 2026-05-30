var f=require('fs').readFileSync('e:/my-work2025/meoo-plan/meoo-plan/src/views/web-list/index.vue','utf8').split('\n');
for(var i=0;i<f.length;i++){
if(/copyPlanToClipboard|openCopyModal|showCopyModal|closeCopyModal|copyContent|editablePlanContent|OpenMeoo/.test(f[i]))console.log((i+1)+':'+f[i].trim())
}

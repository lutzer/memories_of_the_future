if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,c)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const a={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return a;default:return e(r)}})).then(e=>{const r=c(...e);return s.default||(s.default=r),s})}))}}define("./service-worker.js",["./workbox-468c4d03"],(function(e){"use strict";e.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"app.5ec64ce25a657d07e5ca.bundle.js",revision:"3df6b5bcfa9ced2069d731d6d611f9ad"},{url:"assets/layers-2x.png",revision:"4f0283c6ce28e888000e978e537a6a56"},{url:"assets/layers.png",revision:"a6137456ed160d7606981aa57c559898"},{url:"assets/logo.png",revision:"7e34c95ac701f8cd9f793586b9df2156"},{url:"assets/marker-icon.png",revision:"2273e3d8ad9264b7daa5bdbf8e6b47f8"},{url:"assets/pause-button.png",revision:"386b5837e1d29495afa6046b09b83d51"},{url:"assets/play-arrow.png",revision:"3833cf9a23bd88e5bf85435fecfadcc1"},{url:"css/app.dd2c4302.css",revision:"15cd605a42defb4d3178692d67424eef"},{url:"favicon.ico",revision:"0031d7d44edf42ad4748fe0737207524"},{url:"manifest.json",revision:"7312f85d76a3c1ea14f4416a6e8cd767"},{url:"polyfill.5ec64ce25a657d07e5ca.bundle.js",revision:"0ec02ab3acf9688b03e6cce2657c0ba2"}],{})}));
//# sourceMappingURL=service-worker.js.map

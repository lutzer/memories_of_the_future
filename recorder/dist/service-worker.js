if(!self.define){const e=e=>{"require"!==e&&(e+=".js");let r=Promise.resolve();return s[e]||(r=new Promise(async r=>{if("document"in self){const s=document.createElement("script");s.src=e,document.head.appendChild(s),s.onload=r}else importScripts(e),r()})),r.then(()=>{if(!s[e])throw new Error(`Module ${e} didn’t register its module`);return s[e]})},r=(r,s)=>{Promise.all(r.map(e)).then(e=>s(1===e.length?e[0]:e))},s={require:Promise.resolve(r)};self.define=(r,i,o)=>{s[r]||(s[r]=Promise.resolve().then(()=>{let s={};const n={uri:location.origin+r.slice(1)};return Promise.all(i.map(r=>{switch(r){case"exports":return s;case"module":return n;default:return e(r)}})).then(e=>{const r=o(...e);return s.default||(s.default=r),s})}))}}define("./service-worker.js",["./workbox-1bbb3e0e"],(function(e){"use strict";self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),e.precacheAndRoute([{url:"app.bundle.js",revision:"74d3008bb0061fa1689b351eb43d95e0"},{url:"assets/logo.png",revision:"7e34c95ac701f8cd9f793586b9df2156"},{url:"css/app.f26470ac.css",revision:"773244c4aaa4987f14d4a9b44b0c3d7a"},{url:"index.html",revision:"c66b5e618a657519c4f1e86f78b71d70"},{url:"manifest.json",revision:"7312f85d76a3c1ea14f4416a6e8cd767"},{url:"polyfill.bundle.js",revision:"2fb3de02c56c599ac779079de5ffa7a5"}],{})}));
//# sourceMappingURL=service-worker.js.map

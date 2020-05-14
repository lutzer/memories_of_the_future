!function(e){var t={};function n(i){if(t[i])return t[i].exports;var s=t[i]={i:i,l:!1,exports:{}};return e[i].call(s.exports,s,s.exports,n),s.l=!0,s.exports}n.m=e,n.c=t,n.d=function(e,t,i){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:i})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var s in e)n.d(i,s,function(t){return e[t]}.bind(null,s));return i},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=33)}({33:function(e,t,n){"use strict";n.r(t);let i,s,r=window.AudioContext||window.webkitAudioContext;function a(e){let t=new Event("error");return t.data=new Error("Wrong state for "+e),t}class o{constructor(e){this.stream=e,this.state="inactive",this.em=document.createDocumentFragment(),this.encoder=function(e){let t=e.toString().replace(/^(\(\)\s*=>|function\s*\(\))\s*{/,"").replace(/}$/,""),n=new Blob([t]);return new Worker(URL.createObjectURL(n))}(o.encoder);let t=this;this.encoder.addEventListener("message",e=>{let n=new Event("dataavailable");n.data=new Blob([e.data],{type:t.mimeType}),t.em.dispatchEvent(n),"inactive"===t.state&&t.em.dispatchEvent(new Event("stop"))})}start(e){if("inactive"!==this.state)return this.em.dispatchEvent(a("start"));this.state="recording",i||(i=new r),this.clone=this.stream.clone(),this.input=i.createMediaStreamSource(this.clone),s||(s=i.createScriptProcessor(2048,1,1));let t=this;t.encoder.postMessage(["init",i.sampleRate]),s.onaudioprocess=function(e){"recording"===t.state&&t.encoder.postMessage(["encode",e.inputBuffer.getChannelData(0)])},this.input.connect(s),s.connect(i.destination),this.em.dispatchEvent(new Event("start")),e&&(this.slicing=setInterval(()=>{"recording"===t.state&&t.requestData()},e))}stop(){return"inactive"===this.state?this.em.dispatchEvent(a("stop")):(this.requestData(),this.state="inactive",this.clone.getTracks().forEach(e=>{e.stop()}),this.input.disconnect(),clearInterval(this.slicing))}pause(){return"recording"!==this.state?this.em.dispatchEvent(a("pause")):(this.state="paused",this.em.dispatchEvent(new Event("pause")))}resume(){return"paused"!==this.state?this.em.dispatchEvent(a("resume")):(this.state="recording",this.em.dispatchEvent(new Event("resume")))}requestData(){return"inactive"===this.state?this.em.dispatchEvent(a("requestData")):this.encoder.postMessage(["dump",i.sampleRate])}addEventListener(...e){this.em.addEventListener(...e)}removeEventListener(...e){this.em.removeEventListener(...e)}dispatchEvent(...e){this.em.dispatchEvent(...e)}}o.prototype.mimeType="audio/wav",o.isTypeSupported=e=>o.prototype.mimeType===e,o.notSupported=!navigator.mediaDevices||!r,o.encoder=()=>{let e=[];onmessage=t=>{"encode"===t.data[0]?function(t){let n=t.length,i=new Uint8Array(2*n);for(let e=0;e<n;e++){let n=2*e,s=t[e];s>1?s=1:s<-1&&(s=-1),s*=32768,i[n]=s,i[n+1]=s>>8}e.push(i)}(t.data[1]):"dump"===t.data[0]&&function(t){let n=e.length?e[0].length:0,i=e.length*n,s=new Uint8Array(44+i),r=new DataView(s.buffer);r.setUint32(0,1380533830,!1),r.setUint32(4,36+i,!0),r.setUint32(8,1463899717,!1),r.setUint32(12,1718449184,!1),r.setUint32(16,16,!0),r.setUint16(20,1,!0),r.setUint16(22,1,!0),r.setUint32(24,t,!0),r.setUint32(28,2*t,!0),r.setUint16(32,2,!0),r.setUint16(34,16,!0),r.setUint32(36,1684108385,!1),r.setUint32(40,i,!0);for(let t=0;t<e.length;t++)s.set(e[t],t*n+44);e=[],postMessage(s.buffer,[s.buffer])}(t.data[1])}};var c=o;window.MediaRecorder=c}});
//# sourceMappingURL=polyfill.bundle.js.map
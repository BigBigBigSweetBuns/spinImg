(()=>{var e={181:e=>{let t="../src/static/images/";e.exports={data:{one:[],two:[]},testdata:["https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nvxz1t2j31900u0e81.jpg","https://wx2.sinaimg.cn/mw1024/006yVIrkgy1g81nug4qjwj31900u0b29.jpg","https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81numwi9yj31900u0b29.jpg","https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nxu0jfxj30u0190hdt.jpg","https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81nv2m6opj30u0190e81.jpg"],getDataOne:function(){for(let e=1;e<38;e++)this.data.one.push(t+e+".jpg");return this.data.one},getDataTwo:function(){for(let e=38;e<=89;e++)this.data.two.push(t+e+".jpg");return this.data.two}}},345:e=>{e.exports={imgSpining:function(e,t,n,o,l,a){let s=Math.min(e.length,t.length),r=!1,i=Math.floor(l/(s-1-n));if(document.getElementById("block").style.display="block",2==o){n<e.length/2&&(i=Math.floor(l/(s-1+n)),r=!0);let o=setInterval((()=>{r&&0==n&&(r=!1,n=s-1),!r&&n<0?(clearInterval(o),document.getElementById("block").style.display="none"):a(n<s/2?t[n]:e[n]),n--}))}else if(4==o){n>s/2&&(i=Math.floor(l/(s-1+(s-n))),r=!0);let o=setInterval((()=>{r&&n==s-1&&(r=!1,n=0),!r&&n>s-1?(clearInterval(o),document.getElementById("block").style.display="none"):a(n>s/2?t[n]:e[n]),n++}))}}}},979:e=>{e.exports={loadOne:function(e=100){scheduleOne++;let t=schedule/e,n=document.getElementsByClassName("circle-right")[0],o=document.getElementsByClassName("circle-left")[0];t<=.5?n.style.transform=`rotate(${360*t}deg)`:(n.style.transform="rotate(180deg)",n.style.transition="opacity 0s step-end 1s, transform 1s linear",n.style.opacity=0,o.style.transition=`transform ${(t-.5)/.5}s linear 1s`,o.style.transform=`rotate(${360*t-180}deg)`)},loadTwo:function(e=100){scheduleTwo++;let t=schedule/e,n=document.getElementsByClassName("circle-right")[0],o=document.getElementsByClassName("circle-left")[0];t<=.5?n.style.transform=`rotate(${360*t}deg)`:(n.style.transform="rotate(180deg)",n.style.transition="opacity 0s step-end 1s, transform 1s linear",n.style.opacity=0,o.style.transition=`transform ${(t-.5)/.5}s linear 1s`,o.style.transform=`rotate(${360*t-180}deg)`)}}}},t={};function n(o){if(t[o])return t[o].exports;var l=t[o]={exports:{}};return e[o](l,l.exports,n),l.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{"use strict";var e=n(181),t=n.n(e),o=(n(979),n(345)),l=n.n(o),a=0,s=[[],[]];window.onload=function(){var e=document.getElementsByClassName("box2")[0],n=document.getElementsByClassName("speed")[0],o=(document.getElementsByClassName("text")[0],document.getElementById("myCanvas")),r=o.getContext("2d");let i={oldX:0,oldY:0,clientX:0,clientY:0,drection:!1,onClick:!1,onUp:!0,status:0};function c(e,t){let n=[];for(let t=0;t<e.length;t++)n.push(new Promise((n=>{let o=new Image;o.src=e[t];let l=setInterval((function(){o.complete&&(clearInterval(l),n(o))}),50)})));Promise.all(n).then((e=>{t(e)}))}function g(t,n,o){i.onClick&&!i.onUp&&Math.abs(i.oldX-i.clientX)>15&&(2==i.drection?(a=a-1>0?a-1:o.length-1,r.drawImage(o[a],0,0),i.oldX=t):4==i.drection&&(a=a<o.length-1?a+1:0,r.drawImage(o[a],0,0),i.oldX=t),e.innerHTML="X:"+t+" Y: "+n+"\n oldX:"+i.oldX+"oldY:"+i.oldY)}c(t().getDataOne(),(e=>{s[0]=e,console.log(s[0])})),c(t().getDataTwo(),(e=>{s[1]=e,console.log(s[1])}));let m=0,d=null,u=null;function p(e){return new Promise((t=>setTimeout(t,e)))}function y(e,t){2==e?(a=a>0?a-1:t.length-1,r.drawImage(t[a],0,0)):4==e&&(a=a<t.length-1?a+1:0,r.drawImage(t[a],0,0))}document.getElementById("qie").onclick=()=>{i.status=1==i.status?0:1,0==i.status?(l().imgSpining(s[0],s[1],a,4,3e3,(e=>{r.drawImage(e,0,0,1900,350,0,0,1900,350)})),l().imgSpining(s[0],s[1],a,2,3e3,(e=>{r.drawImage(e,0,350,1900,300,0,350,1900,300)})),l().imgSpining(s[0],s[1],a,4,3e3,(e=>{r.drawImage(e,0,650,1900,410,0,650,1900,410)}))):(l().imgSpining(s[1],s[0],a,4,3e3,(e=>{r.drawImage(e,0,0,1900,350,0,0,1900,350)})),l().imgSpining(s[1],s[0],a,2,3e3,(e=>{r.drawImage(e,0,350,1900,300,0,350,1900,300)})),l().imgSpining(s[1],s[0],a,4,3e3,(e=>{r.drawImage(e,0,650,1900,410,0,650,1900,410)})))},o.onmousedown=function(e){e=e||window.event,i.onClick=!0,i.onUp=!1,i.oldX=e.clientX,i.oldY=e.clientY,function(e){clearInterval(d);let t=0;d=setInterval((function(){t=Math.abs(i.clientX-m),m=i.clientX,i.onUp&&(clearInterval(d),async function(e,t){let o=i.drection;for(e=Math.floor(e/10);e>1;)e-=1,n.innerHTML="speeds: "+e,u=setInterval(y(o,t),Math.floor(1e3/e)),await p(Math.floor(1e3/e)),clearInterval(u),console.log(e)}(t,s[0])),n.innerHTML="speeds: "+t}),10)}(s[0])},o.onmouseup=function(){i.onClick=!1,i.onUp=!0},o.onmousemove=function(e){e=e||window.event,i.clientX=e.clientX,i.drection=i.clientX-i.oldX>0?2:4,0==i.status&&g(e.clientX,e.clientY,s[0]),1==i.status&&g(e.clientX,e.clientY,s[1])}}})()})();
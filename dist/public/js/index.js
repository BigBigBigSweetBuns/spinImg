(()=>{var e=0,t={one:[],two:[]};let n=["https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nvxz1t2j31900u0e81.jpg","https://wx2.sinaimg.cn/mw1024/006yVIrkgy1g81nug4qjwj31900u0b29.jpg","https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81numwi9yj31900u0b29.jpg","https://wx4.sinaimg.cn/mw1024/006yVIrkgy1g81nxu0jfxj30u0190hdt.jpg","https://wx3.sinaimg.cn/mw1024/006yVIrkgy1g81nv2m6opj30u0190e81.jpg"];var l=[[],[]];for(let e=1;e<38;e++)t.one.push(e+".jpg");for(let e=38;e<=89;e++)t.two.push(e+".jpg");window.onload=function(){var t=document.getElementsByClassName("box2")[0],o=document.getElementsByClassName("speed")[0],a=(document.getElementsByClassName("text")[0],document.getElementById("myCanvas")),i=a.getContext("2d");let c={oldX:0,oldY:0,clientX:0,clientY:0,drection:!1,onClick:!1,onUp:!0,status:0};function r(n,l,o){c.onClick&&!c.onUp&&Math.abs(c.oldX-c.clientX)>15&&(2==c.drection?(e=e-1>0?e-1:o.length-1,i.drawImage(o[e],0,0),c.oldX=n):4==c.drection&&(e=e<o.length-1?e+1:0,i.drawImage(o[e],0,0),c.oldX=n),t.innerHTML="X:"+n+" Y: "+l+"\n oldX:"+c.oldX+"oldY:"+c.oldY)}!function(e,t){let n=[];for(let t=0;t<e.length;t++)n.push(new Promise((n=>{let l=new Image;l.src=e[t];let o=setInterval((function(){l.complete&&(clearInterval(o),load(e.length),n(l))}),50)})));Promise.all(n).then((e=>{(e=>{l[0]=e,console.log(l[0])})(e)}))}(n);let s=0,g=null,m=null;function d(e){return new Promise((t=>setTimeout(t,e)))}function u(t,n){2==t?(e=e>0?e-1:n.length-1,i.drawImage(n[e],0,0)):4==t&&(e=e<n.length-1?e+1:0,i.drawImage(n[e],0,0))}function w(t,n,l,o,a){let i=Math.min(t.length,n.length),c=!1,r=e,s=Math.floor(o/(i-1-r));if(2==l){r<t.length/2&&(s=Math.floor(o/(i-1+r)),c=!0);let e=setInterval((()=>{c&&0==r&&(c=!1,r=i-1),!c&&r<0?clearInterval(e):a(r<i/2?n[r]:t[r]),r--}))}else if(4==l){r>i/2&&(s=Math.floor(o/(i-1+(i-r))),c=!0);let e=setInterval((()=>{c&&r==i-1&&(c=!1,r=0),!c&&r>i-1?clearInterval(e):a(r>i/2?n[r]:t[r]),r++}))}}document.getElementById("qie").onclick=()=>{c.status=1==c.status?0:1,0==c.status?(w(l[0],l[1],4,3e3,(e=>{i.drawImage(e,0,0,1900,350,0,0,1900,350)})),w(l[0],l[1],2,3e3,(e=>{i.drawImage(e,0,350,1900,300,0,350,1900,300)})),w(l[0],l[1],4,3e3,(e=>{i.drawImage(e,0,650,1900,410,0,650,1900,410)}))):(w(l[1],l[0],4,3e3,(e=>{i.drawImage(e,0,0,1900,350,0,0,1900,350)})),w(l[1],l[0],2,3e3,(e=>{i.drawImage(e,0,350,1900,300,0,350,1900,300)})),w(l[1],l[0],4,3e3,(e=>{i.drawImage(e,0,650,1900,410,0,650,1900,410)})))},a.onmousedown=function(e){e=e||window.event,c.onClick=!0,c.onUp=!1,c.oldX=e.clientX,c.oldY=e.clientY,function(e){clearInterval(g);let t=0;g=setInterval((function(){t=Math.abs(c.clientX-s),s=c.clientX,c.onUp&&(clearInterval(g),async function(e,t){let n=c.drection;for(e=Math.floor(e/10);e>1;)e-=1,o.innerHTML="speeds: "+e,m=setInterval(u(n,t),Math.floor(1e3/e)),await d(Math.floor(1e3/e)),clearInterval(m),console.log(e)}(t,l[0])),o.innerHTML="speeds: "+t}),10)}(l[0])},a.onmouseup=function(){c.onClick=!1,c.onUp=!0},a.onmousemove=function(e){e=e||window.event,c.clientX=e.clientX,c.drection=c.clientX-c.oldX>0?2:4,0==c.status&&r(e.clientX,e.clientY,l[0]),1==c.status&&r(e.clientX,e.clientY,l[1])}}})();
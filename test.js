
(function(){
  try{
    sessionStorage.clear();
    localStorage.clear();
    if('serviceWorker' in navigator){
      navigator.serviceWorker.getRegistrations().then(function(regs){
        for(var i=0;i<regs.length;i++){ regs[i].unregister(); }
      });
    }
  }catch(e){}

  function draw(sz){
    var c=document.createElement('canvas');c.width=c.height=sz;
    var x=c.getContext('2d'),s=sz/512,r=110*s;
    x.beginPath();x.moveTo(r,0);x.lineTo(sz-r,0);x.quadraticCurveTo(sz,0,sz,r);
    x.lineTo(sz,sz-r);x.quadraticCurveTo(sz,sz,sz-r,sz);
    x.lineTo(r,sz);x.quadraticCurveTo(0,sz,0,sz-r);
    x.lineTo(0,r);x.quadraticCurveTo(0,0,r,0);x.closePath();
    x.fillStyle='#fff';x.fill();
    var px=sz*.5,py=sz*.42,pr=sz*.27;
    x.beginPath();x.arc(px,py,pr,Math.PI,0);
    x.bezierCurveTo(sz*.77,py+pr*1.1,px+pr*.35,sz*.82,px,sz*.9);
    x.bezierCurveTo(px-pr*.35,sz*.82,sz*.23,py+pr*1.1,px-pr,py);
    x.closePath();
    var g=x.createLinearGradient(px-pr,py-pr,px+pr,py+pr);
    g.addColorStop(0,'#FF7043');g.addColorStop(1,'#E64A19');
    x.fillStyle=g;x.shadowColor='rgba(255,87,34,.5)';x.shadowBlur=sz*.05;x.fill();x.shadowBlur=0;
    x.beginPath();x.arc(px,py,pr*.52,0,Math.PI*2);x.fillStyle='white';x.fill();
    x.fillStyle='#FF5722';x.font='900 '+Math.round(pr*.8)+'px Arial';
    x.textAlign='center';x.textBaseline='middle';x.fillText('T',px,py+pr*.05);
    x.fillStyle='#FFC107';x.font='900 '+Math.round(sz*.065)+'px Arial';x.fillText('★★★',px,sz*.79);
    x.fillStyle='#FF5722';x.font='700 '+Math.round(sz*.048)+'px Arial';x.fillText('GUIDE',px,sz*.9);
    return c.toDataURL('image/png');
  }
  var p=draw(512),p2=draw(192);
  document.getElementById('icon-main').href=p2;
  document.getElementById('icon-apple').href=p;
  var mf={name:'Thao Thức Guide',short_name:'Thao Thức',start_url:'./',display:'standalone',
    background_color:'#FFFFFF',theme_color:'#FF5722',orientation:'portrait',
    icons:[{src:p2,sizes:'192x192',type:'image/png',purpose:'any maskable'},{src:p,sizes:'512x512',type:'image/png',purpose:'any maskable'}]};
  try{document.getElementById('manifest-lnk').href=URL.createObjectURL(new Blob([JSON.stringify(mf)],{type:'application/manifest+json'}));}catch(e){}
})();

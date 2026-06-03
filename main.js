const DISHES=['assets/dish1.jpg','assets/dish2.jpg','assets/dish3.jpg','assets/dish4.jpg','assets/dish5.jpg'];
const Q='https://www.quicket.co.za/events/373771-japafrica-dining-experience/';
const VID_MS=17000;
let lbIdx=0;

// LOADER
(function(){
  const ldr=document.getElementById('ldr');
  const v=document.getElementById('ldr-vid');
  const fill=document.getElementById('ldr-fill');
  let started=false,st=null;
  function start(){
    if(started)return;started=true;st=performance.now();
    function tick(n){const p=Math.min((n-st)/VID_MS*100,100);fill.style.width=p+'%';if(p<100)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
    setTimeout(()=>{ldr.classList.add('done');initAll();},VID_MS+500);
  }
  if(v){
    v.muted=true;
    const tryPlay=()=>v.play().then(start).catch(start);
    if(v.readyState>=3)tryPlay();
    else{v.addEventListener('canplay',tryPlay,{once:true});v.load();}
    v.addEventListener('error',start,{once:true});
    setTimeout(start,2000);
  } else setTimeout(()=>{ldr.classList.add('done');initAll();},800);
})();

// CURSOR
const C=document.getElementById('cur'),C2=document.getElementById('cur2');
if(window.matchMedia('(hover:hover)').matches){
  document.addEventListener('mousemove',e=>{C.style.left=e.clientX+'px';C.style.top=e.clientY+'px';C2.style.left=e.clientX+'px';C2.style.top=e.clientY+'px';});
  document.addEventListener('mouseover',e=>{if(e.target.closest('a,button,.mc,.ec,.ei,.exp-item'))C2.classList.add('big');});
  document.addEventListener('mouseout',e=>{if(e.target.closest('a,button,.mc,.ec,.ei,.exp-item'))C2.classList.remove('big');});
}
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('s',window.scrollY>40));

function go(n){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('on'));
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('on'));
  document.getElementById('page-'+n).classList.add('on');
  const el=document.getElementById('nl-'+n);if(el)el.classList.add('on');
  window.scrollTo({top:0,behavior:'smooth'});
  setTimeout(initAll,100);
  if(n==='events')loadEvents();
}
function mobToggle(){document.getElementById('hbg').classList.toggle('o');document.getElementById('mobm').classList.toggle('o');}

function initReveal(){
  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.07});
  document.querySelectorAll('.page.on .rv').forEach(el=>obs.observe(el));
}
function initCards(){
  const cards=document.querySelectorAll('.page.on .mc');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.1});
  cards.forEach(c=>io.observe(c));
  cards.forEach(card=>{
    let r;
    card.addEventListener('mouseenter',()=>{r=card.getBoundingClientRect();card.style.transition='transform .1s ease,box-shadow .3s';});
    card.addEventListener('mousemove',e=>{
      if(!r)r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
      const rX=(0.5-y)*42,rY=(x-0.5)*42;
      card.style.transform=`perspective(780px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.1,1.1,1.1) translateZ(22px)`;
      card.style.boxShadow=`0 ${18+Math.abs(rX)}px ${32+Math.abs(rX)*2}px rgba(0,0,0,.75)`;
      const sh=card.querySelector('.mc-shine');
      if(sh)sh.style.background=`radial-gradient(circle at ${x*100}% ${y*100}%,rgba(201,169,110,.15) 0%,transparent 56%)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transition='transform .65s cubic-bezier(.23,1,.32,1),box-shadow .65s';
      card.style.transform='perspective(780px) rotateX(0) rotateY(0) scale3d(1,1,1) translateZ(0)';
      card.style.boxShadow='';
    });
    card.addEventListener('touchstart',()=>{r=card.getBoundingClientRect();},{passive:true});
    card.addEventListener('touchmove',e=>{
      if(!r)return;
      const t=e.touches[0],x=(t.clientX-r.left)/r.width,y=(t.clientY-r.top)/r.height;
      card.style.transform=`perspective(780px) rotateX(${(0.5-y)*22}deg) rotateY(${(x-.5)*22}deg) scale3d(1.05,1.05,1.05)`;
    },{passive:true});
    card.addEventListener('touchend',()=>{card.style.transition='transform .6s cubic-bezier(.23,1,.32,1)';card.style.transform='perspective(780px) rotateX(0) rotateY(0) scale3d(1,1,1)';});
  });
}

function openDish(i){lbIdx=i;renderLb();spawnSparks();document.getElementById('lb').classList.add('open');document.body.style.overflow='hidden';}
function renderLb(){
  document.getElementById('lb-img').src=DISHES[lbIdx];
  document.getElementById('lb-dots').innerHTML=DISHES.map((_,i)=>`<div class="ld${i===lbIdx?' on':''}" onclick="lbIdx=${i};renderLb()"></div>`).join('');
}
function spawnSparks(){
  const w=document.getElementById('lb-wrap');
  for(let i=0;i<10;i++){
    const s=document.createElement('div');s.className='lb-spark';
    const a=Math.random()*360,d=60+Math.random()*80;
    s.style.cssText=`left:50%;top:50%;--sx:${Math.cos(a*Math.PI/180)*d}px;--sy:${Math.sin(a*Math.PI/180)*d}px;animation-delay:${Math.random()*.2}s`;
    w.appendChild(s);setTimeout(()=>s.remove(),900);
  }
}
function lbNav(d){lbIdx=((lbIdx+d)%DISHES.length+DISHES.length)%DISHES.length;renderLb();}
function closeLb(){document.getElementById('lb').classList.remove('open');document.body.style.overflow='';}
document.getElementById('lb').addEventListener('click',e=>{if(e.target===document.getElementById('lb'))closeLb();});
document.addEventListener('keydown',e=>{
  if(!document.getElementById('lb').classList.contains('open'))return;
  if(e.key==='Escape')closeLb();
  if(e.key==='ArrowRight')lbNav(1);
  if(e.key==='ArrowLeft')lbNav(-1);
});

async function loadEvents(){
  const loading=document.getElementById('evt-loading'),list=document.getElementById('evt-list');
  if(!list)return;
  try{
    const res=await fetch('https://api.allorigins.win/get?url='+encodeURIComponent(Q));
    const data=await res.json();
    const doc=new DOMParser().parseFromString(data.contents,'text/html');
    const t=(doc.querySelector('h1')||doc.querySelector('title')||{}).textContent||"Jap'Africa Dining Experience";
    const title=t.replace(/[|\-].*Quicket.*/i,'').trim()||"Jap'Africa Dining Experience";
    const dateEl=doc.querySelector('[class*="date"],[class*="Date"]');
    const date=dateEl?dateEl.textContent.trim():'See Quicket for dates';
    list.innerHTML=`
      <div class="ei"><div><h3>${title}</h3><p>Multi-course Jap'Africa experience &middot; Cape Town</p></div>
      <div class="ei-meta"><span class="ei-date">${date}</span><span class="ei-seats">Limited seats</span><a href="${Q}" target="_blank" class="bsm">Buy Tickets</a></div></div>
      <div class="ei"><div><h3>Private Pop-Up: The Waka Experience</h3><p>Intimate chef's table &middot; Location TBA</p></div>
      <div class="ei-meta"><span class="ei-date">Announcing Soon</span><span class="ei-seats">8 seats only</span><a href="${Q}" target="_blank" class="bsm">Notify Me</a></div></div>`;
    loading.style.display='none';list.style.display='block';
  }catch(e){loading.innerHTML=`<a href="${Q}" target="_blank" class="bp" style="display:inline-block;">View Events on Quicket &rarr;</a>`;}
}

async function submitForm(){
  const btn=document.getElementById('f-btn');
  const name=document.getElementById('f-name').value.trim();
  const email=document.getElementById('f-email').value.trim();
  const type=document.getElementById('f-type').value;
  const msg=document.getElementById('f-msg').value.trim();
  if(!name||!email){btn.textContent='Please fill name & email';setTimeout(()=>btn.textContent='Send Enquiry',2000);return;}
  btn.textContent='Sending…';btn.disabled=true;
  try{
    const res=await fetch('https://formspree.io/f/REPLACE_WITH_YOUR_ID',{
      method:'POST',
      headers:{'Content-Type':'application/json','Accept':'application/json'},
      body:JSON.stringify({name,email,type,message:msg})
    });
    if(res.ok){
      btn.textContent='Sent ✓';btn.style.background='#1a1a1a';btn.style.color='var(--g)';
      ['f-name','f-email','f-type','f-msg'].forEach(id=>document.getElementById(id).value='');
    }else{btn.textContent='Error — try WhatsApp';btn.style.background='#1a1a1a';}
  }catch{btn.textContent='Error — try WhatsApp';btn.style.background='#1a1a1a';}
  setTimeout(()=>{btn.textContent='Send Enquiry';btn.style.background='var(--g)';btn.style.color='var(--k)';btn.disabled=false;},3500);
}

function checkSwipe(){const h=document.getElementById('swipe-h');if(h)h.style.display=window.innerWidth<=580?'block':'none';}
window.addEventListener('resize',checkSwipe);
function initAll(){initReveal();initCards();checkSwipe();}

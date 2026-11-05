(function(){
  function $(id){return document.getElementById(id)}
  function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
  function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML}
  function fmt(t){return new Date(t).toLocaleDateString('ca-ES',{day:'2-digit',month:'short'})}
  function clamp(v,a,b){v=parseInt(v,10);return isNaN(v)?a:Math.max(a,Math.min(b,v))}
  function avg(a){return a.length?a.reduce(function(x,y){return x+y},0)/a.length:0}
  function bindOut(inp,out){var i=$(inp),o=$(out);if(!i||!o)return;i.addEventListener('input',function(){o.textContent=i.value})}
  bindOut('ba-pl','ba-opl');bindOut('ba-mas','ba-omas');bindOut('pa-int','pa-oint');

  /* ---------- 1. Activació conductual ---------- */
  var BK='psi-ba',CATS={cura:'Cura personal',social:'Social',moviment:'Moviment',domini:'Tasques i responsabilitats',plaer:'Plaer i oci'};
  function renderB(){
    var d=load(BK);
    $('ba-list').innerHTML=d.slice().reverse().map(function(x){
      var head='<b>'+esc(x.t)+'</b> <span class="badge" title="Categoria">'+esc(CATS[x.c]||'')+'</span>';
      if(x.done){
        return '<li><span class="when">'+fmt(x.id)+'</span><span class="grow">'+head+'<br>Plaer: previst '+x.pl+' → real '+x.apl+' · Domini: previst '+x.ma+' → real '+x.ama+
          '</span><button class="mini" data-act="del" data-id="'+x.id+'" aria-label="Eliminar">✕</button></li>';
      }
      return '<li><span class="when">'+fmt(x.id)+'</span><span class="grow">'+head+'<br>Previst: plaer '+x.pl+' · domini '+x.ma+
        '<div class="inline-form" data-id="'+x.id+'"><div class="field"><label>Plaer real (0-10)</label><input type="text" class="b-apl" inputmode="numeric" maxlength="2"></div>'+
        '<div class="field"><label>Sensació de domini real (0-10)</label><input type="text" class="b-ama" inputmode="numeric" maxlength="2"></div>'+
        '<button class="btn btn-primary btn-sm" data-act="fin" data-id="'+x.id+'">L\'he fet</button> <button class="mini" data-act="del" data-id="'+x.id+'">Eliminar</button></div></span></li>';
    }).join('')||'<li class="muted">Encara no has planificat cap activitat.</li>';
    var done=d.filter(function(x){return x.done});
    $('ba-sum').textContent=done.length?
      'Has completat '+done.length+' activitat'+(done.length>1?'s':'')+'. Plaer mitjà: previst '+avg(done.map(function(x){return x.pl})).toFixed(1)+' · real '+avg(done.map(function(x){return x.apl})).toFixed(1)+
      '. Si el real supera el previst, és una prova que les ganes de fer coses arriben sovint després d\'actuar, no abans.':'';
  }
  $('ba-add').addEventListener('click',function(){
    var t=$('ba-act').value.trim();if(!t){alert('Escriu l\'activitat que vols fer.');return}
    var d=load(BK);d.push({id:Date.now(),t:t.slice(0,140),c:$('ba-cat').value,pl:+$('ba-pl').value,ma:+$('ba-mas').value,done:false});
    store(BK,d);$('ba-act').value='';renderB();
  });
  $('ba-list').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var id=+b.dataset.id,d=load(BK);
    if(b.dataset.act==='del'){d=d.filter(function(x){return x.id!==id})}
    else{var f=b.closest('.inline-form');
      d.forEach(function(x){if(x.id===id){x.done=true;x.apl=clamp(f.querySelector('.b-apl').value,0,10);x.ama=clamp(f.querySelector('.b-ama').value,0,10)}})}
    store(BK,d);renderB();
  });
  $('ba-clear').addEventListener('click',function(){if(confirm('Vols esborrar totes les activitats?')){store(BK,[]);renderB()}});
  renderB();

  /* ---------- 2. Diari de son ---------- */
  var SK='psi-sleep',FLAGS=['cafeïna tard','alcohol','pantalla al llit','migdiada llarga','exercici avui'];
  function mins(hm){if(!hm)return null;var p=hm.split(':');return (+p[0])*60+(+p[1])}
  function calc(bed,wake,lat,awk){
    var b=mins(bed),w=mins(wake);if(b==null||w==null)return null;
    var inbed=w-b;if(inbed<=0)inbed+=1440;
    var sleep=Math.max(0,inbed-lat-awk);
    return {inbed:inbed,sleep:sleep,eff:inbed?Math.round(sleep/inbed*100):0};
  }
  function hh(m){return Math.floor(m/60)+' h '+('0'+(m%60)).slice(-2)+' min'}
  function renderS(){
    var d=load(SK).sort(function(a,b){return a.t-b.t});
    $('sl-list').innerHTML=d.slice().reverse().slice(0,14).map(function(x){
      return '<li><span class="when">'+fmt(x.t)+'</span><span class="grow"><b>'+hh(x.sleep)+' dormit</b> · eficiència '+x.eff+'% · qualitat '+x.q+'/5<br>'+
        'Llit '+esc(x.bed)+' → llevar '+esc(x.wake)+' · fins adormir-me '+x.lat+' min · desperta '+x.awk+' min'+
        ((x.fl&&x.fl.length)?'<br><span class="muted">'+x.fl.map(function(i){return FLAGS[i]}).join(', ')+'</span>':'')+(x.n?'<br>'+esc(x.n):'')+
        '</span><button class="mini" data-id="'+x.id+'" aria-label="Eliminar">✕</button></li>'}).join('')||'<li class="muted">Encara no hi ha registres.</li>';
    var last=d.slice(-7);
    var sp=$('sl-spark');sp.innerHTML='';
    last.forEach(function(x){var s=document.createElement('span');s.style.height=Math.min(100,Math.round(x.sleep/600*100))+'%';s.title=fmt(x.t)+': '+hh(x.sleep);sp.appendChild(s)});
    $('sl-sum').textContent=last.length?'Mitjana dels últims '+(last.length>1?last.length+' dies':'dia registrat')+': '+hh(Math.round(avg(last.map(function(x){return x.sleep}))))+' dormit · eficiència '+Math.round(avg(last.map(function(x){return x.eff})))+'%.':'';
  }
  (function(){var n=new Date();try{$('sl-date').value=n.getFullYear()+'-'+('0'+(n.getMonth()+1)).slice(-2)+'-'+('0'+n.getDate()).slice(-2)}catch(e){}})();
  $('sl-save').addEventListener('click',function(){
    var lat=clamp($('sl-lat').value,0,600),awk=clamp($('sl-awk').value,0,600),r=calc($('sl-bed').value,$('sl-wake').value,lat,awk);
    if(!r){alert('Indica l\'hora d\'anar al llit i l\'hora de llevar-te.');return}
    var t=$('sl-date').value?new Date($('sl-date').value+'T12:00').getTime():Date.now();
    var fl=[].slice.call(document.querySelectorAll('input[name=slflag]:checked')).map(function(c){return +c.value});
    var d=load(SK);d.push({id:Date.now(),t:t,bed:$('sl-bed').value,wake:$('sl-wake').value,lat:lat,awk:awk,sleep:r.sleep,eff:r.eff,q:+$('sl-q').value,fl:fl,n:$('sl-note').value.trim().slice(0,200)});
    store(SK,d);$('sl-note').value='';[].forEach.call(document.querySelectorAll('input[name=slflag]'),function(c){c.checked=false});renderS();
  });
  $('sl-list').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var id=+b.dataset.id;store(SK,load(SK).filter(function(x){return x.id!==id}));renderS()});
  $('sl-clear').addEventListener('click',function(){if(confirm('Vols esborrar el diari de son?')){store(SK,[]);renderS()}});
  renderS();

  /* ---------- 3. Registre de pànic ---------- */
  var PK='psi-panic',SYM=['Palpitacions','Ofec o pressió al pit','Sudoració','Tremolors','Marejos','Formigueig','Nàusees','Sensació d\'irrealitat','Por de perdre el control','Por de morir'];
  function renderP(){
    var d=load(PK);
    $('pa-list').innerHTML=d.slice().reverse().slice(0,15).map(function(x){
      return '<li><span class="when">'+new Date(x.t).toLocaleString('ca-ES',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})+'</span><span class="grow"><b>Intensitat '+x.i+'/100</b> · '+x.m+' min'+
        ((x.s&&x.s.length)?'<br><span class="muted">'+x.s.map(function(i){return SYM[i]}).join(', ')+'</span>':'')+
        (x.c?'<br><b>Situació:</b> '+esc(x.c):'')+(x.f?'<br><b>Temia que:</b> '+esc(x.f):'')+(x.w?'<br><b>Què vaig fer:</b> '+esc(x.w):'')+
        '</span><button class="mini" data-id="'+x.id+'" aria-label="Eliminar">✕</button></li>'}).join('')||'<li class="muted">Encara no hi ha registres.</li>';
    var m=Date.now()-30*864e5,rec=d.filter(function(x){return x.t>=m});
    $('pa-sum').textContent=rec.length?'Últims 30 dies: '+rec.length+' atac'+(rec.length>1?'s':'')+' · durada mitjana '+Math.round(avg(rec.map(function(x){return x.m})))+' min · intensitat mitjana '+Math.round(avg(rec.map(function(x){return x.i})))+'/100.':'';
  }
  $('pa-save').addEventListener('click',function(){
    var x={id:Date.now(),t:Date.now(),i:+$('pa-int').value,m:clamp($('pa-min').value,0,240),
      s:[].slice.call(document.querySelectorAll('input[name=pasym]:checked')).map(function(c){return +c.value}),
      c:$('pa-ctx').value.trim().slice(0,200),f:$('pa-fear').value.trim().slice(0,200),w:$('pa-did').value.trim().slice(0,200)};
    var d=load(PK);d.push(x);store(PK,d);
    ['pa-ctx','pa-fear','pa-did','pa-min'].forEach(function(i){$(i).value=''});
    [].forEach.call(document.querySelectorAll('input[name=pasym]'),function(c){c.checked=false});renderP();
  });
  $('pa-list').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var id=+b.dataset.id;store(PK,load(PK).filter(function(x){return x.id!==id}));renderP()});
  $('pa-clear').addEventListener('click',function(){if(confirm('Vols esborrar el registre de pànic?')){store(PK,[]);renderP()}});
  renderP();
})();

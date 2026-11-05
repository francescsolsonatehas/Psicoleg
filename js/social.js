(function(){
  function $(id){return document.getElementById(id)}
  function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
  function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML}
  function fmt(t){return new Date(t).toLocaleDateString('ca-ES',{day:'2-digit',month:'short'})}
  function bindOut(inp,out){var i=$(inp),o=$(out);i.addEventListener('input',function(){o.textContent=i.value})}
  bindOut('x-score','x-out');bindOut('p-b1','p-o1');bindOut('p-b2','p-o2');bindOut('e-a1','e-o1');

  /* 1. Jerarquia d'exposició */
  var XK='psi-expo';
  function renderX(){
    var d=load(XK).sort(function(a,b){return a.s-b.s});
    $('x-list').innerHTML=d.map(function(x){
      return '<li><span class="badge" title="Por esperada">'+x.s+'</span><span class="grow'+(x.done?' done':'')+'">'+esc(x.t)+(x.after!=null?' <span class="muted">→ després: '+x.after+'</span>':'')+'</span>'+
        '<button class="mini" data-act="done" data-id="'+x.id+'">'+(x.done?'Desfer':'Fet')+'</button> '+
        '<button class="mini" data-act="del" data-id="'+x.id+'" aria-label="Eliminar">✕</button></li>'}).join('')||'<li class="muted">Encara no has afegit cap situació.</li>';
  }
  $('x-add').addEventListener('click',function(){
    var t=$('x-sit').value.trim();if(!t)return;
    var d=load(XK);d.push({id:Date.now(),t:t.slice(0,140),s:+$('x-score').value});store(XK,d);$('x-sit').value='';renderX();
  });
  $('x-list').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var id=+b.dataset.id,d=load(XK);
    if(b.dataset.act==='del'){d=d.filter(function(x){return x.id!==id})}
    else{d.forEach(function(x){if(x.id===id){
      if(!x.done){var v=prompt('Quanta por has sentit realment (0-100)?','');x.after=(v!==null&&v!==''&&!isNaN(v))?Math.max(0,Math.min(100,+v)):null;x.done=true}
      else{x.done=false;x.after=null}}})}
    store(XK,d);renderX();
  });
  $('x-clear').addEventListener('click',function(){if(confirm('Vols esborrar tota l\'escala?')){store(XK,[]);renderX()}});
  renderX();

  /* 2. Registre de pensaments socials */
  var PK='psi-soc-thoughts',DIST=['Lectura de ment','Catastrofisme','Personalització','Etiquetatge','Filtre mental','Hauria de'];
  function renderP(){
    var d=load(PK);
    $('p-log').innerHTML=d.slice().reverse().slice(0,10).map(function(x){
      var rows=[['Situació',x.sit],['Predicció',x.pred+(x.b1!=null?' ('+x.b1+'%)':'')],['Distorsions',(x.dist||[]).map(function(i){return DIST[i]}).join(', ')],
        ['A favor',x.f],['En contra',x.a],['Alternatiu',x.alt+(x.b2!=null&&x.alt?' ('+x.b2+'%)':'')]];
      return '<li><span class="when">'+fmt(x.t)+'</span><span>'+rows.filter(function(r){return r[1]}).map(function(r){return '<b>'+r[0]+':</b> '+esc(r[1])}).join('<br>')+'</span></li>'}).join('')||'<li class="muted">Encara no hi ha entrades.</li>';
  }
  $('p-save').addEventListener('click',function(){
    var e={t:Date.now(),sit:$('p-sit').value.trim().slice(0,800),pred:$('p-pred').value.trim().slice(0,800),b1:+$('p-b1').value,
      dist:[].slice.call(document.querySelectorAll('input[name=dist]:checked')).map(function(c){return +c.value}),
      f:$('p-for').value.trim().slice(0,800),a:$('p-ag').value.trim().slice(0,800),alt:$('p-alt').value.trim().slice(0,800),b2:+$('p-b2').value};
    if(!e.sit&&!e.pred&&!e.alt)return;
    var d=load(PK);d.push(e);store(PK,d);
    ['p-sit','p-pred','p-for','p-ag','p-alt'].forEach(function(i){$(i).value=''});
    [].forEach.call(document.querySelectorAll('input[name=dist]'),function(c){c.checked=false});renderP();
  });
  $('p-clear').addEventListener('click',function(){if(confirm('Vols esborrar totes les entrades?')){store(PK,[]);renderP()}});
  renderP();

  /* 3. Experiments conductuals */
  var EK='psi-experiments';
  function renderE(){
    var d=load(EK);
    $('e-list').innerHTML=d.slice().reverse().map(function(x){
      if(x.res!=null){
        return '<li><span class="when">'+fmt(x.id)+'</span><span class="grow"><b>'+esc(x.do)+'</b><br>Predicció: '+esc(x.pred)+' · ansietat prevista '+x.a1+'<br>Ha passat: '+esc(x.res)+' · ansietat real '+x.a2+(x.learn?'<br>He après: '+esc(x.learn):'')+'</span></li>'}
      return '<li><span class="when">'+fmt(x.id)+'</span><span class="grow"><b>'+esc(x.do)+'</b><br>Predicció: '+esc(x.pred)+' · ansietat prevista '+x.a1+
        '<div class="inline-form" data-id="'+x.id+'"><div class="field"><label>Què ha passat de debò?</label><input type="text" class="r-res" maxlength="200"></div>'+
        '<div class="field"><label>Ansietat real (0-100)</label><input type="text" class="r-a2" inputmode="numeric" maxlength="3"></div>'+
        '<div class="field"><label>Què n\'he après?</label><input type="text" class="r-learn" maxlength="200"></div>'+
        '<button class="btn btn-primary btn-sm" data-act="fin" data-id="'+x.id+'">Anotar resultat</button> <button class="mini" data-act="del" data-id="'+x.id+'">Eliminar</button></div></span></li>'}).join('')||'<li class="muted">Encara no has planificat cap experiment.</li>';
  }
  $('e-add').addEventListener('click',function(){
    var a=$('e-do').value.trim(),p=$('e-pred').value.trim();if(!a||!p){alert('Escriu què faràs i què creus que passarà.');return}
    var d=load(EK);d.push({id:Date.now(),do:a.slice(0,160),pred:p.slice(0,200),a1:+$('e-a1').value,res:null});store(EK,d);
    $('e-do').value='';$('e-pred').value='';renderE();
  });
  $('e-list').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var id=+b.dataset.id,d=load(EK);
    if(b.dataset.act==='del'){d=d.filter(function(x){return x.id!==id})}
    else{var f=b.closest('.inline-form'),res=f.querySelector('.r-res').value.trim();if(!res){alert('Explica què ha passat.');return}
      var a2=parseInt(f.querySelector('.r-a2').value,10);a2=isNaN(a2)?0:Math.max(0,Math.min(100,a2));
      d.forEach(function(x){if(x.id===id){x.res=res.slice(0,200);x.a2=a2;x.learn=f.querySelector('.r-learn').value.trim().slice(0,200)}})}
    store(EK,d);renderE();
  });
  $('e-clear').addEventListener('click',function(){if(confirm('Vols esborrar tots els experiments?')){store(EK,[]);renderE()}});
  renderE();
})();

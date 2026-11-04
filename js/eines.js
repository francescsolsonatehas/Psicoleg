(function(){
  function $(id){return document.getElementById(id)}
  function load(k){try{return JSON.parse(localStorage.getItem(k))||[]}catch(e){return[]}}
  function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function esc(s){var d=document.createElement('div');d.textContent=s;return d.innerHTML}
  function fmt(t){return new Date(t).toLocaleString('ca-ES',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Respiració */
  var bTimer=null,running=false;
  var circle=$('b-circle'),bText=$('b-text'),bLive=$('b-live'),bBtn=$('b-btn');
  function breathe(){
    var p=$('b-mode').value.split(',').map(Number);
    var phases=[['inhale','Inspira',p[0]],['hold','Aguanta',p[1]],['exhale','Expira',p[2]],['hold','Aguanta',p[3]]].filter(function(x){return x[2]>0});
    var i=0;
    function next(){
      if(!running)return;
      var ph=phases[i%phases.length];i++;
      circle.style.transitionDuration=(reduce?0:ph[2])+'s';
      circle.className='breath-circle '+ph[0];
      bText.textContent=ph[1];bLive.textContent=ph[1]+' ('+ph[2]+' s)';
      bTimer=setTimeout(next,ph[2]*1000);
    }
    next();
  }
  bBtn.addEventListener('click',function(){
    running=!running;
    if(running){bBtn.textContent='Aturar';breathe()}
    else{clearTimeout(bTimer);bBtn.textContent='Començar';circle.className='breath-circle';bText.textContent='Molt bé';bLive.textContent='Has acabat. Com et sents?'}
  });

  /* Pas a pas genèric */
  function stepper(steps,o){
    var i=0;
    function show(){
      var s=steps[i];$(o.t).textContent=s[0];$(o.x).textContent=s[1];
      $(o.b).style.width=((i+1)/steps.length*100)+'%';
    }
    return {show:show,next:function(){if(i<steps.length-1){i++;show()}},prev:function(){if(i>0){i--;show()}},
            reset:function(){i=0},at:function(){return i},len:steps.length};
  }
  var gs=stepper([
    ['5 coses que veus','Mira al teu voltant i anomena cinc coses que veus. Fixa\'t en colors i formes.'],
    ['4 coses que pots tocar','Nota la roba, el terra, una taula... Descriu com són al tacte.'],
    ['3 coses que sents (sons)','Escolta amb atenció. Hi ha sons llunyans? I de propers?'],
    ['2 coses que olores','Respira i busca dues olors, o recorda-ne alguna que t\'agradi.'],
    ['1 cosa que pots tastar','Fixa\'t en el gust que tens a la boca o pensa en un gust agradable.'],
    ['Respira i torna al present','Fes tres respiracions lentes. Ho has fet molt bé.']
  ],{t:'g-title',x:'g-text',b:'g-bar'});
  gs.show();
  $('g-next').addEventListener('click',gs.next);$('g-prev').addEventListener('click',gs.prev);

  var rs=['Mans i avantbraços','Braços i bíceps','Front i cara','Mandíbula i coll','Espatlles','Pit i esquena','Abdomen','Cuixes','Panxells i peus'];
  var rTimer=null,ri=0,rRun=false;
  var rb=$('r-btn');
  function setR(t,x,pct){$('r-title').textContent=t;$('r-text').textContent=x;$('r-bar').style.width=pct+'%'}
  function rStep(){
    if(!rRun)return;
    if(ri>=rs.length){setR('Fet','Nota la calma al cos. Respira tranquil·lament.',100);rRun=false;rb.textContent='Tornar a començar';ri=0;return}
    var pct=(ri+1)/rs.length*100;
    setR(rs[ri],'Tensa durant 5 segons...',pct);
    rTimer=setTimeout(function(){
      if(!rRun)return;
      setR(rs[ri],'Deixa anar durant 10 segons. Nota la diferència.',pct);
      rTimer=setTimeout(function(){ri++;rStep()},10000);
    },5000);
  }
  rb.addEventListener('click',function(){
    rRun=!rRun;
    if(rRun){rb.textContent='Aturar';rStep()}
    else{clearTimeout(rTimer);rb.textContent='Continuar';setR('En pausa','Prem continuar quan vulguis.',(ri/rs.length)*100)}
  });

  /* Registre d'ànim */
  var KEY='psi-mood',val=0,emojis=['','😞','🙁','😐','🙂','😄'];
  var moodBtns=[].slice.call(document.querySelectorAll('.mood-row button'));
  moodBtns.forEach(function(b){b.addEventListener('click',function(){
    val=+b.dataset.v;moodBtns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
  })});
  function renderMood(){
    var d=load(KEY),sp=$('m-spark'),lg=$('m-log');
    sp.innerHTML=d.slice(-30).map(function(m){return '<span style="height:'+(m.v*20)+'%" title="'+m.v+'/5"></span>'}).join('');
    lg.innerHTML=d.slice().reverse().slice(0,15).map(function(m){
      return '<li><span class="when">'+fmt(m.t)+'</span><span>'+emojis[m.v]+' '+esc(m.n||'')+'</span></li>'}).join('')||'<li class="muted">Encara no hi ha registres.</li>';
  }
  $('m-save').addEventListener('click',function(){
    if(!val){alert('Escull primer com et sents.');return}
    var d=load(KEY);d.push({t:Date.now(),v:val,n:$('m-note').value.slice(0,200)});store(KEY,d);
    $('m-note').value='';val=0;moodBtns.forEach(function(x){x.setAttribute('aria-pressed','false')});renderMood();
  });
  $('m-clear').addEventListener('click',function(){if(confirm('Vols esborrar tots els registres d\'ànim?')){store(KEY,[]);renderMood()}});
  $('m-export').addEventListener('click',function(){
    var d=load(KEY),csv='data,valor,nota\n'+d.map(function(m){return new Date(m.t).toISOString()+','+m.v+',"'+(m.n||'').replace(/"/g,'""')+'"'}).join('\n');
    var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='registre-anim.csv';a.click();
  });
  renderMood();

  /* Diari de pensaments */
  var TK='psi-thoughts',fields=['sit','th','em','for','ag','alt'],labels=['Situació','Pensament','Emoció','A favor','En contra','Alternatiu'];
  function renderT(){
    var d=load(TK);
    $('t-log').innerHTML=d.slice().reverse().slice(0,10).map(function(x){
      return '<li><span class="when">'+fmt(x.t)+'</span><span>'+fields.map(function(f,i){return x[f]?'<b>'+labels[i]+':</b> '+esc(x[f]):''}).filter(Boolean).join('<br>')+'</span></li>'}).join('')||'<li class="muted">Encara no hi ha entrades.</li>';
  }
  $('t-save').addEventListener('click',function(){
    var e={t:Date.now()},any=false;
    fields.forEach(function(f){var v=$('t-'+f).value.trim().slice(0,1000);e[f]=v;if(v)any=true});
    if(!any)return;
    var d=load(TK);d.push(e);store(TK,d);fields.forEach(function(f){$('t-'+f).value=''});renderT();
  });
  $('t-clear').addEventListener('click',function(){if(confirm('Vols esborrar totes les entrades del diari?')){store(TK,[]);renderT()}});
  renderT();
})();

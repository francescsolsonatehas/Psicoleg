(function(){
  var __=PSI.t,_f=PSI.f;
  function $(id){return document.getElementById(id)}
  var OPTS=[__('Gens'),__('Alguns dies'),__('Més de la meitat dels dies'),__('Gairebé cada dia')];
  var TESTS={
    phq:{intro:__('Durant les últimes 2 setmanes, amb quina freqüència t\'han molestat els problemes següents?'),
      items:[__('Poc interès o plaer a fer les coses'),__('Sentir-me decaigut/da, deprimit/da o sense esperança'),__('Dificultat per adormir-me o per mantenir-me adormit/da, o dormir massa'),__('Sentir-me cansat/da o amb poca energia'),__('Poca gana o menjar en excés'),__('Sentir-me malament amb mi mateix/a, o que sóc un fracàs o he decebut la família'),__('Dificultat per concentrar-me, per exemple llegint o mirant la televisió'),__('Moure\'m o parlar tan a poc a poc que els altres ho han notat, o al contrari, estar tan inquiet/a que m\'he mogut molt més del normal'),__('Pensar que estaria millor mort/a o fer-me mal d\'alguna manera')],
      bands:[[4,__('Mínim'),__('Els símptomes són mínims. Si et preocupa com et sents, parla-ho amb algú de confiança o amb el teu metge.')],[9,__('Lleu'),__('Poden ser símptomes lleus. Cuida el son, l\'activitat física i el suport social, i valora consultar amb el teu metge si continuen.')],[14,__('Moderat'),__('Convé consultar amb el teu metge de família o un professional de la salut mental.')],[19,__('Moderadament greu'),__('Et recomanem demanar cita amb un professional de la salut mental aviat.')],[27,__('Greu'),__('Et recomanem molt contactar amb un professional de la salut mental ben aviat.')]]},
    gad:{intro:__('Durant les últimes 2 setmanes, amb quina freqüència t\'han molestat els problemes següents?'),
      items:[__('Sentir-me nerviós/a, ansiós/a o molt tens/a'),__('No poder deixar de preocupar-me o controlar la preocupació'),__('Preocupar-me massa per diferents coses'),__('Dificultat per relaxar-me'),__('Estar tan inquiet/a que és difícil estar assegut/da'),__('Irritar-me o enfadar-me amb facilitat'),__('Sentir por, com si pogués passar alguna cosa terrible')]
      ,bands:[[4,__('Mínim'),__('Els símptomes d\'ansietat són mínims.')],[9,__('Lleu'),__('Poden ser símptomes lleus. Les eines de respiració i grounding poden ajudar; si persisteixen, consulta.')],[14,__('Moderat'),__('Convé consultar amb el teu metge de família o un professional de la salut mental.')],[21,__('Greu'),__('Et recomanem demanar cita amb un professional de la salut mental aviat.')]]}
  };
  var cur='phq',form=$('s-form'),res=$('s-result');
  function setTabs(){['phq','gad','cbi'].forEach(function(k){$('tab-'+k).setAttribute('aria-pressed',cur===k)})}
  function renderQ(){
    var t=TESTS[cur];$('s-cbi-box').hidden=true;$('s-intro').textContent=t.intro;res.className='result';res.innerHTML='';
    form.innerHTML=t.items.map(function(q,i){
      return '<fieldset class="q"><legend>'+(i+1)+'. '+q+'</legend><div class="opts">'+
        OPTS.map(function(o,v){return '<label><input type="radio" name="q'+i+'" value="'+v+'"> '+o+'</label>'}).join('')+'</div></fieldset>'}).join('');
    setTabs();
  }

  /* ---------- CBI (Copenhagen Burnout Inventory) ----------
     Ítems i puntuació: Kristensen, Borritz, Villadsen i Christensen (2005); domini públic.
     Castellà: ítems de la versió validada (Molinero Ruiz, Basart Gómez-Quintero i Moncada Lluis, 2013).
     Marques: 'd' = a l'anglès original s'usa l'escala de grau; 'r' = puntuació invertida. */
  var FREQ=[__('Mai'),__('Només alguna vegada'),__('Algunes vegades'),__('Moltes vegades'),__('Sempre')];
  var DEGR=[__('En un grau molt baix'),__('En un grau baix'),__('Una mica'),__('En un grau alt'),__('En un grau molt alt')];
  var CBI=[
    {id:'p',name:__('Burnout personal'),def:__('Estat d\'esgotament físic i psicològic prolongat.'),items:[
      [__('Amb quina freqüència et sents cansat/da?')],
      [__('Amb quina freqüència estàs físicament esgotat/da?')],
      [__('Amb quina freqüència estàs psicològicament esgotat/da?')],
      [__('Amb quina freqüència penses «no puc més»?')],
      [__('Amb quina freqüència et sents esgotat/da?')],
      [__('Amb quina freqüència et sents feble i propens/a a emmalaltir?')]]},
    {id:'w',name:__('Burnout relacionat amb la feina'),def:__('Estat d\'esgotament físic i psicològic prolongat que es percep relacionat amb la teva feina.'),items:[
      [__('La teva feina és emocionalment esgotadora?'),'d'],
      [__('Et sents cremat/da per la feina?'),'d'],
      [__('Et sents frustrat/da per la teva feina?'),'d'],
      [__('Et sents esgotat/da al final de la jornada laboral?')],
      [__('Al matí, t\'esgota pensar en un altre dia de feina?')],
      [__('Sents que cada hora de feina és esgotadora?')],
      [__('Tens prou energia per a la família i els amics durant el temps lliure?'),'r']]},
    {id:'c',name:__('Burnout relacionat amb el treball amb persones'),def:__('Estat d\'esgotament físic i psicològic prolongat que es percep relacionat amb la teva feina amb clients, usuaris, pacients, alumnes o altres persones.'),items:[
      [__('És dur treballar amb clients o usuaris?'),'d'],
      [__('És frustrant treballar amb clients o usuaris?'),'d'],
      [__('Treballar amb clients o usuaris consumeix la teva energia?'),'d'],
      [__('Sents que dónes més del que reps quan treballes amb clients o usuaris?'),'d'],
      [__('Estàs cansat/da de treballar amb clients o usuaris?')],
      [__('De vegades et preguntes quant de temps podràs continuar treballant amb clients o usuaris?')]]}
  ];
  var NOTES={
    ca:__('<strong>Versió en català: no validada.</strong> És una traducció feta per aquest web a partir de la versió castellana validada, sense revisió d\'un traductor ni validació psicomètrica. Fes-ne servir el resultat només com a orientació.'),
    es:__('<strong>Versió en castellà: validada a Espanya.</strong> Els ítems i les opcions de resposta són els de la versió validada per Molinero Ruiz, Basart Gómez-Quintero i Moncada Lluis (2013).'),
    en:__('<strong>Versió en anglès: text original dels autors, no validat per aquest web.</strong> Són els ítems publicats pels autors del CBI. La validació original es va fer amb mostres daneses, no a Espanya ni a Catalunya.')};
  var cbiAns={};
  function cbiSections(){var wc=$('s-cbi-cl').checked;return CBI.filter(function(x){return x.id!=='c'||wc})}
  function drawCbi(){
    var h='';
    cbiSections().forEach(function(sec){
      h+='<h2 class="cbi-h" style="margin:26px 0 6px">'+sec.name+'</h2><p class="muted">'+sec.def+'</p>';
      sec.items.forEach(function(it,i){
        var deg=PSI.lang==='en'&&it[1]&&it[1].indexOf('d')>-1,labels=deg?DEGR:FREQ,nm='c'+sec.id+i;
        h+='<fieldset class="q"><legend>'+(i+1)+'. '+it[0]+'</legend><div class="opts">'+
          labels.map(function(o,v){return '<label><input type="radio" name="'+nm+'" value="'+v+'"'+(cbiAns[nm]===String(v)?' checked':'')+'> '+o+'</label>'}).join('')+'</div></fieldset>';
      });
    });
    form.innerHTML=h;res.className='result';res.innerHTML='';
  }
  function renderCbi(){
    cbiAns={};$('s-cbi-box').hidden=false;
    $('s-cbi-note').innerHTML=(NOTES[PSI.lang]||NOTES.ca)+' '+__('Només la versió en castellà està validada a Espanya. La catalana és una traducció d\'aquest web sense validar, i l\'anglesa és el text original dels autors, validat amb mostres daneses.');
    $('s-intro').textContent=__('Respon pensant en com et sents habitualment. Les dues primeres parts són per a tothom; la tercera només si treballes amb persones.');
    drawCbi();setTabs();
  }
  form.addEventListener('change',function(e){if(cur==='cbi'&&e.target&&e.target.name)cbiAns[e.target.name]=e.target.value});
  $('s-cbi-cl').addEventListener('change',function(){if(cur==='cbi')drawCbi()});
  function calcCbi(){
    var secs=cbiSections(),miss=0,out=[];
    secs.forEach(function(sec){
      var sum=0;
      sec.items.forEach(function(it,i){
        var c=form.querySelector('input[name="c'+sec.id+i+'"]:checked');
        if(!c){miss++;return}
        var sc=(+c.value)*25;if(it[1]&&it[1].indexOf('r')>-1)sc=100-sc;sum+=sc;
      });
      out.push({sec:sec,score:sum/sec.items.length});
    });
    if(miss){res.className='result show';res.innerHTML='<div class="notice">'+_f('Falten {0} pregunta(es) per respondre.',[miss])+'</div>';return}
    var h='<div class="card"><h2>'+__('Resultat del CBI')+'</h2>'+out.map(function(o){
      var r=Math.round(o.score);
      return '<div class="cbi-res" style="margin:18px 0"><div><strong>'+o.sec.name+'</strong>: '+_f('{0} de 100',[r])+'</div><div class="progress" role="img" aria-label="'+_f('{0} de 100',[r])+'"><i style="width:'+o.score+'%"></i></div><p class="muted" style="margin:0">'+(o.score>=50?__('50 o més: un grau alt d\'esgotament segons el criteri dels autors.'):__('Per sota de 50.'))+'</p></div>';
    }).join('')+'<p>'+__('Com més alta és la puntuació (de 0 a 100), més esgotament. Als estudis dels autors, un grau alt d\'esgotament es va definir com 50 punts o més. És un criteri de recerca, no un punt de tall clínic ni un diagnòstic.')+'</p><p class="muted">'+__('Aquest resultat és orientatiu i no és un diagnòstic.')+'</p></div>';
    h+=__('<div class="notice soft"><strong>Si t\'ho estàs passant molt malament</strong>Pots parlar-ne amb el teu metge o amb un psicòleg. Si penses a fer-te mal, truca ara al <a href="tel:024"><b>024</b></a> (gratuït, 24 h) o al <a href="tel:112"><b>112</b></a>.</div>');
    h+=__('<div class="btn-row"><a class="btn btn-primary" href="trastorns/burnout.html">Llegir la fitxa de burnout</a><a class="btn btn-outline" href="ajuda.html">Trobar ajuda</a></div>');
    res.className='result show';res.innerHTML=h;res.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function render(){if(cur==='cbi')renderCbi();else renderQ()}
  $('tab-phq').addEventListener('click',function(){cur='phq';render()});
  $('tab-gad').addEventListener('click',function(){cur='gad';render()});
  $('tab-cbi').addEventListener('click',function(){cur='cbi';render()});
  $('s-reset').addEventListener('click',render);
  $('s-calc').addEventListener('click',function(e){
    e.preventDefault();
    if(cur==='cbi'){calcCbi();return}
    var t=TESTS[cur],sum=0,miss=0,risk=false;
    t.items.forEach(function(_,i){
      var c=form.querySelector('input[name="q'+i+'"]:checked');
      if(!c){miss++;return}
      sum+=+c.value;
      if(cur==='phq'&&i===8&&+c.value>0)risk=true;
    });
    if(miss){res.className='result show';res.innerHTML='<div class="notice">'+_f('Falten {0} pregunta(es) per respondre.',[miss])+'</div>';return}
    var band=t.bands.filter(function(b){return sum<=b[0]})[0];
    var h='<div class="card"><h2>'+_f('Puntuació: {0}',[sum])+' · '+band[1]+'</h2><p>'+band[2]+'</p><p class="muted">'+__('Aquest resultat és orientatiu i no és un diagnòstic.')+'</p></div>';
    if(risk)h=__('<div class="notice warn" role="alert"><strong>Gràcies per ser sincer/a</strong>Has indicat que has tingut pensaments de fer-te mal o de no voler viure. No estàs sol/a, i això es pot tractar. Truca ara al <a href="tel:024"><b>024</b></a> (gratuït, 24 h) o al <a href="tel:112"><b>112</b></a> si hi ha perill immediat, i parla-ho amb una persona de confiança o amb el teu metge.</div>')+h;
    h+=__('<div class="btn-row"><a class="btn btn-primary" href="ajuda.html">Trobar ajuda</a><a class="btn btn-outline" href="eines.html">Eines d\'autoajuda</a></div>');
    res.className='result show';res.innerHTML=h;res.scrollIntoView({behavior:'smooth',block:'start'});
  });
  render();
})();

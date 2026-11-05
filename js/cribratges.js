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
  function render(){
    var t=TESTS[cur];$('s-intro').textContent=t.intro;res.className='result';res.innerHTML='';
    form.innerHTML=t.items.map(function(q,i){
      return '<fieldset class="q"><legend>'+(i+1)+'. '+q+'</legend><div class="opts">'+
        OPTS.map(function(o,v){return '<label><input type="radio" name="q'+i+'" value="'+v+'"> '+o+'</label>'}).join('')+'</div></fieldset>'}).join('');
    $('tab-phq').setAttribute('aria-pressed',cur==='phq');$('tab-gad').setAttribute('aria-pressed',cur==='gad');
  }
  $('tab-phq').addEventListener('click',function(){cur='phq';render()});
  $('tab-gad').addEventListener('click',function(){cur='gad';render()});
  $('s-reset').addEventListener('click',render);
  $('s-calc').addEventListener('click',function(e){
    e.preventDefault();
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

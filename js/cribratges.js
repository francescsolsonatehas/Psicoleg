(function(){
  function $(id){return document.getElementById(id)}
  var OPTS=['Gens','Alguns dies','Més de la meitat dels dies','Gairebé cada dia'];
  var TESTS={
    phq:{intro:'Durant les últimes 2 setmanes, amb quina freqüència t\'han molestat els problemes següents?',
      items:['Poc interès o plaer a fer les coses','Sentir-me decaigut/da, deprimit/da o sense esperança','Dificultat per adormir-me o per mantenir-me adormit/da, o dormir massa','Sentir-me cansat/da o amb poca energia','Poca gana o menjar en excés','Sentir-me malament amb mi mateix/a, o que sóc un fracàs o he decebut la família','Dificultat per concentrar-me, per exemple llegint o mirant la televisió','Moure\'m o parlar tan a poc a poc que els altres ho han notat, o al contrari, estar tan inquiet/a que m\'he mogut molt més del normal','Pensar que estaria millor mort/a o fer-me mal d\'alguna manera'],
      bands:[[4,'Mínim','Els símptomes són mínims. Si et preocupa com et sents, parla-ho amb algú de confiança o amb el teu metge.'],[9,'Lleu','Poden ser símptomes lleus. Cuida el son, l\'activitat física i el suport social, i valora consultar amb el teu metge si continuen.'],[14,'Moderat','Convé consultar amb el teu metge de família o un professional de la salut mental.'],[19,'Moderadament greu','Et recomanem demanar cita amb un professional de la salut mental aviat.'],[27,'Greu','Et recomanem molt contactar amb un professional de la salut mental ben aviat.']]},
    gad:{intro:'Durant les últimes 2 setmanes, amb quina freqüència t\'han molestat els problemes següents?',
      items:['Sentir-me nerviós/a, ansiós/a o molt tens/a','No poder deixar de preocupar-me o controlar la preocupació','Preocupar-me massa per diferents coses','Dificultat per relaxar-me','Estar tan inquiet/a que és difícil estar assegut/da','Irritar-me o enfadar-me amb facilitat','Sentir por, com si pogués passar alguna cosa terrible']
      ,bands:[[4,'Mínim','Els símptomes d\'ansietat són mínims.'],[9,'Lleu','Poden ser símptomes lleus. Les eines de respiració i grounding poden ajudar; si persisteixen, consulta.'],[14,'Moderat','Convé consultar amb el teu metge de família o un professional de la salut mental.'],[21,'Greu','Et recomanem demanar cita amb un professional de la salut mental aviat.']]}
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
    if(miss){res.className='result show';res.innerHTML='<div class="notice">Falten <strong style="display:inline">'+miss+'</strong> pregunta(es) per respondre.</div>';return}
    var band=t.bands.filter(function(b){return sum<=b[0]})[0];
    var h='<div class="card"><h2>Puntuació: '+sum+' · '+band[1]+'</h2><p>'+band[2]+'</p><p class="muted">Aquest resultat és orientatiu i no és un diagnòstic.</p></div>';
    if(risk)h='<div class="notice warn" role="alert"><strong>Gràcies per ser sincer/a</strong>Has indicat que has tingut pensaments de fer-te mal o de no voler viure. No estàs sol/a, i això es pot tractar. Truca ara al <a href="tel:024"><b>024</b></a> (gratuït, 24 h) o al <a href="tel:112"><b>112</b></a> si hi ha perill immediat, i parla-ho amb una persona de confiança o amb el teu metge.</div>'+h;
    h+='<div class="btn-row"><a class="btn btn-primary" href="ajuda.html">Trobar ajuda</a><a class="btn btn-outline" href="eines.html">Eines d\'autoajuda</a></div>';
    res.className='result show';res.innerHTML=h;res.scrollIntoView({behavior:'smooth',block:'start'});
  });
  render();
})();

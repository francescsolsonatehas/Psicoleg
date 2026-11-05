(function(){
  var __=PSI.t,_f=PSI.f;
  function $(id){return document.getElementById(id)}
  function load(k){try{var v=JSON.parse(localStorage.getItem(k));return Array.isArray(v)?v:[]}catch(e){return[]}}
  function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML}
  function dt(t){return new Date(t).toLocaleDateString(PSI.locale,{day:'2-digit',month:'2-digit',year:'numeric'})}
  function dtm(t){return new Date(t).toLocaleString(PSI.locale,{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})}
  function hh(m){return Math.floor(m/60)+' h '+('0'+(m%60)).slice(-2)+' min'}
  var MOOD=['',__('Molt malament'),__('Malament'),__('Regular'),__('Bé'),__('Molt bé')];
  var CATS={cura:__('Cura personal'),social:__('Social'),moviment:__('Moviment'),domini:__('Tasques'),plaer:__('Plaer i oci')};
  var FL=[__('cafeïna tard'),'alcohol',__('pantalla al llit'),__('migdiada llarga'),'exercici'];
  var SYM=[__('Palpitacions'),__('Ofec o pressió al pit'),__('Sudoració'),__('Tremolors'),__('Marejos'),__('Formigueig'),__('Nàusees'),__('Sensació d\'irrealitat'),__('Por de perdre el control'),__('Por de morir')];
  var DIST=[__('Lectura de ment'),__('Catastrofisme'),__('Personalització'),__('Etiquetatge'),__('Filtre mental'),__('Hauria de')];

  /* Cada font: clau, títol, funció que retorna {when, lines[]} per cada entrada, i com ordenar per data. */
  var SRC=[
    {k:'psi-mood',t:__('Registre d\'estat d\'ànim'),ts:function(x){return x.t},f:function(x){return [[__('Ànim'),(MOOD[x.v]||x.v)+' ('+x.v+'/5)'],[__('Nota'),x.n]]}},
    {k:'psi-thoughts',t:__('Diari de pensaments'),ts:function(x){return x.t},f:function(x){return [[__('Situació'),x.sit],[__('Pensament'),x.th],[__('Emoció'),x.em],[__('A favor'),x.for],[__('En contra'),x.ag],[__('Alternatiu'),x.alt]]}},
    {k:'psi-ba',t:__('Activació conductual'),ts:function(x){return x.id},f:function(x){return [[__('Activitat'),x.t+' ('+(CATS[x.c]||'')+')'],[__('Previst'),__('plaer ')+x.pl+__('/10, domini ')+x.ma+'/10'],[__('Real'),x.done?(__('plaer ')+x.apl+__('/10, domini ')+x.ama+'/10'):'pendent']]}},
    {k:'psi-sleep',t:__('Diari de son'),ts:function(x){return x.t},f:function(x){return [[__('Dormit'),hh(x.sleep)+__(' · eficiència ')+x.eff+__('% · qualitat ')+x.q+'/5'],[__('Horari'),__('llit ')+x.bed+__(' · llevar ')+x.wake+__(' · fins adormir-me ')+x.lat+__(' min · desperta ')+x.awk+' min'],[__('Factors'),(x.fl||[]).map(function(i){return FL[i]}).join(', ')],[__('Nota'),x.n]]}},
    {k:'psi-panic',t:__('Registre de pànic'),dtm:true,ts:function(x){return x.t},f:function(x){return [[__('Intensitat'),__('màxim ')+x.i+'/100 · '+x.m+' min'],[__('Símptomes'),(x.s||[]).map(function(i){return SYM[i]}).join(', ')],[__('Situació'),x.c],[__('Temia que'),x.f],[__('Què vaig fer'),x.w]]}},
    {k:'psi-expo',t:__('Ansietat social · Jerarquia d\'exposició'),ts:function(x){return x.id},f:function(x){return [[__('Situació'),x.t],[__('Por esperada'),x.s+'/100'],[__('Estat'),x.done?('fet'+(x.after!=null?__(' · por real ')+x.after+'/100':'')):'pendent']]}},
    {k:'psi-soc-thoughts',t:__('Ansietat social · Registre de pensaments'),ts:function(x){return x.t},f:function(x){return [[__('Situació'),x.sit],[__('Predicció'),x.pred?x.pred+' ('+x.b1+'%)':''],[__('Distorsions'),(x.dist||[]).map(function(i){return DIST[i]}).join(', ')],[__('A favor'),x.f],[__('En contra'),x.a],[__('Alternatiu'),x.alt?x.alt+' ('+x.b2+'%)':'']]}},
    {k:'psi-experiments',t:__('Ansietat social · Experiments conductuals'),ts:function(x){return x.id},f:function(x){return [[__('Experiment'),x.do],[__('Predicció'),x.pred+__(' · ansietat prevista ')+x.a1],[__('Resultat'),x.res!=null?x.res+__(' · ansietat real ')+x.a2:'pendent'],[__('Après'),x.learn]]}}
  ];
  var KEYS=SRC.map(function(s){return s.k});

  function entries(s){return load(s.k).slice().sort(function(a,b){return s.ts(a)-s.ts(b)})}
  function chosen(){return [].slice.call(document.querySelectorAll('input[name=dpick]:checked')).map(function(c){return SRC[+c.value]})}

  function renderCount(){
    $('d-count').innerHTML=SRC.map(function(s){var n=load(s.k).length;return '<li><span class="grow">'+esc(s.t)+'</span><span class="badge">'+n+'</span></li>'}).join('');
    $('d-pick').innerHTML=SRC.map(function(s,i){var n=load(s.k).length;return '<label class="chk"><input type="checkbox" name="dpick" value="'+i+'"'+(n?' checked':' disabled')+'> <span>'+esc(s.t)+' ('+n+')</span></label>'}).join('');
  }

  function reportHTML(list){
    if(!list.length)return __('<p class="muted">No hi ha dades per mostrar.</p>');
    var out=__('<h2>Resum de registres</h2><p class="muted">Generat el ')+dtm(Date.now())+__(' des del web Psicòleg. Dades escrites per la mateixa persona: no constitueixen un diagnòstic.</p>');
    list.forEach(function(s){
      out+='<h3>'+esc(s.t)+'</h3>';
      entries(s).forEach(function(x){
        var rows=s.f(x).filter(function(r){return r[1]});
        out+='<div class="rep-entry"><b>'+(s.dtm?dtm(s.ts(x)):dt(s.ts(x)))+'</b><br>'+rows.map(function(r){return esc(r[0])+': '+esc(r[1])}).join('<br>')+'</div>';
      });
    });
    return out;
  }
  function reportText(list){
    var o=__('RESUM DE REGISTRES — web Psicòleg\nGenerat: ')+dtm(Date.now())+__('\n(Dades escrites per la mateixa persona; no són un diagnòstic.)\n');
    list.forEach(function(s){
      o+='\n== '+s.t.toUpperCase()+' ==\n';
      entries(s).forEach(function(x){
        o+='\n'+(s.dtm?dtm(s.ts(x)):dt(s.ts(x)))+'\n'+s.f(x).filter(function(r){return r[1]}).map(function(r){return '  '+r[0]+': '+r[1]}).join('\n')+'\n';
      });
    });
    return o;
  }
  function download(name,text,type){
    var b=new Blob([text],{type:type+';charset=utf-8'}),a=document.createElement('a');
    a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();
    setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500);
  }
  function stamp(){var n=new Date();return n.getFullYear()+('0'+(n.getMonth()+1)).slice(-2)+('0'+n.getDate()).slice(-2)}

  $('d-view').addEventListener('click',function(){var o=$('d-out');o.innerHTML=reportHTML(chosen());o.hidden=false;o.scrollIntoView({behavior:'smooth',block:'start'})});
  $('d-print').addEventListener('click',function(){var o=$('d-out');o.innerHTML=reportHTML(chosen());o.hidden=false;window.print()});
  $('d-txt').addEventListener('click',function(){var l=chosen();if(!l.length){$('d-msg').textContent=__('No hi ha dades per descarregar.');return}download('registres-'+stamp()+'.txt',reportText(l),'text/plain')});

  /* Còpia de seguretat */
  $('d-export').addEventListener('click',function(){
    var data={};KEYS.forEach(function(k){data[k]=load(k)});
    download('copia-psicoleg-'+stamp()+'.json',JSON.stringify({app:'psicoleg',version:1,exported:new Date().toISOString(),data:data},null,1),'application/json');
    $('d-msg').textContent=__('Còpia descarregada.');
  });
  var pending=null;
  $('d-file').addEventListener('change',function(){
    var f=this.files[0];pending=null;$('d-import').disabled=true;if(!f)return;
    if(f.size>5*1024*1024){$('d-msg').textContent=__('El fitxer és massa gran.');return}
    var r=new FileReader();
    r.onload=function(){
      try{
        var j=JSON.parse(r.result);
        if(!j||j.app!=='psicoleg'||!j.data||typeof j.data!=='object')throw new Error('format');
        var clean={},n=0;
        KEYS.forEach(function(k){if(Array.isArray(j.data[k])){clean[k]=j.data[k].filter(function(x){return x&&typeof x==='object'});n+=clean[k].length}});
        pending=clean;$('d-import').disabled=false;$('d-msg').textContent=__('Fitxer vàlid: ')+n+__(' entrades trobades. Prem «Importar».');
      }catch(e){$('d-msg').textContent=__('Aquest fitxer no és una còpia vàlida d\'aquesta web.')}
    };
    r.readAsText(f);
  });
  $('d-import').addEventListener('click',function(){
    if(!pending)return;
    var replace=document.querySelector('input[name=d-mode]:checked').value==='replace';
    if(replace&&!confirm(__('Es substituiran les dades actuals per les del fitxer. Vols continuar?')))return;
    Object.keys(pending).forEach(function(k){
      if(replace){store(k,pending[k]);return}
      var cur=load(k),seen={};cur.forEach(function(x){seen[JSON.stringify(x)]=1});
      pending[k].forEach(function(x){if(!seen[JSON.stringify(x)])cur.push(x)});store(k,cur);
    });
    pending=null;$('d-import').disabled=true;$('d-file').value='';$('d-msg').textContent=__('Dades importades.');renderCount();$('d-out').hidden=true;
  });
  $('d-wipe').addEventListener('click',function(){
    if(!confirm(__('Vols esborrar de manera definitiva totes les dades de les eines? No es pot desfer.')))return;
    KEYS.forEach(function(k){try{localStorage.removeItem(k)}catch(e){}});renderCount();$('d-out').hidden=true;$('d-msg').textContent=__('Totes les dades s\'han esborrat.');
  });

  /* Recordatoris .ics */
  var MSG={
    anim:[__('Un moment per a tu'),__('Com et sents avui? Apunta-ho al registre d\'ànim.'),'eines.html#anim'],
    resp:[__('Una pausa per respirar'),__('Uns minuts de respiració guiada.'),'eines.html#respiracio'],
    son:[__('Diari de son'),__('Apunta com has dormit.'),'eines-tcc.html#son'],
    activitat:[__('Activitat planificada'),__('Un pas petit per a avui: fes l\'activitat que has planificat.'),'eines-tcc.html#activacio'],
    pensaments:[__('Diari de pensaments'),__('Si avui t\'ha vingut un pensament que pesa, mira\'l amb distància.'),'eines.html#pensaments'],
    exposicio:[__('Un pas d\'exposició'),__('Un pas petit amb la situació que et costa.'),'ansietat-social-eines.html']
  };
  function icsEsc(s){return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n')}
  function fold(l){var o=[];while(l.length>73){o.push(l.slice(0,73));l=' '+l.slice(73)}o.push(l);return o.join('\r\n')}
  function p2(n){return ('0'+n).slice(-2)}
  $('r-make').addEventListener('click',function(){
    var m=MSG[$('r-what').value],tm=$('r-time').value||'21:00',hm=tm.split(':'),n=new Date();
    var d=n.getFullYear()+p2(n.getMonth()+1)+p2(n.getDate());
    var start=d+'T'+hm[0]+hm[1]+'00',weeks=+$('r-weeks').value,fr=$('r-freq').value,rule;
    if(fr==='daily')rule='FREQ=DAILY;COUNT='+(weeks*7);
    else if(fr==='weekdays')rule='FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR;COUNT='+(weeks*5);
    else rule='FREQ=WEEKLY;COUNT='+weeks;
    var url=location.href.replace(/[^\/]*$/,'')+m[2];
    var uid='psicoleg-'+Date.now()+'@psicoleg';
    var stamp=n.getUTCFullYear()+p2(n.getUTCMonth()+1)+p2(n.getUTCDate())+'T'+p2(n.getUTCHours())+p2(n.getUTCMinutes())+p2(n.getUTCSeconds())+'Z';
    var L=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Psicoleg//Recordatoris//CA','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+uid,'DTSTAMP:'+stamp,
      'DTSTART:'+start,'DURATION:PT10M','RRULE:'+rule,'SUMMARY:'+icsEsc(m[0]),'DESCRIPTION:'+icsEsc(m[1]+'\n'+url),'URL:'+url,
      'BEGIN:VALARM','ACTION:DISPLAY','DESCRIPTION:'+icsEsc(m[0]),'TRIGGER:PT0M','END:VALARM','END:VEVENT','END:VCALENDAR'];
    download('recordatori-'+$('r-what').value+'.ics',L.map(fold).join('\r\n')+'\r\n','text/calendar');
  });

  renderCount();
})();

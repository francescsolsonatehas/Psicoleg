(function(){
  var __=PSI.t,_f=PSI.f,C=window.PSI_PLAN,KEY='psi-plan',cur=null;
  function $(id){return document.getElementById(id)}
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML}
  function dt(t){return new Date(t).toLocaleDateString(PSI.locale,{day:'2-digit',month:'2-digit',year:'numeric'})}
  function valid(p){
    if(!p||typeof p!=='object'||!Array.isArray(p.a)||p.a.length!==5||!Array.isArray(p.s))return false;
    for(var i=0;i<5;i++)if(!(p.a[i]>=0&&p.a[i]<=3))return false;
    return p.s.every(function(s){return s&&C.acts[s.a]&&C.acts[s.a][s.i]});
  }
  function load(){try{var v=JSON.parse(localStorage.getItem(KEY));return Array.isArray(v)&&valid(v[0])?v[0]:null}catch(e){return null}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify([cur]))}catch(e){}}

  /* Proposta de passos: 1 per àrea amb dificultats, un 2n i un 3r per a les més marcades (màx. 5), i mínim 3 amb passos generals. */
  function build(a){
    var ord=C.keys.map(function(k,i){return {k:k,s:a[i],i:i}}).filter(function(x){return x.s>0}).sort(function(x,y){return y.s-x.s||x.i-y.i});
    var steps=[],cnt={};
    function add(k){var n=cnt[k]||0;if(n>=C.acts[k].length||steps.length>=5)return;steps.push({a:k,i:n,d:null});cnt[k]=n+1}
    ord.forEach(function(x){add(x.k)});
    ord.forEach(function(x){if(x.s>=2)add(x.k)});
    ord.forEach(function(x){if(x.s>=3)add(x.k)});
    while(steps.length<3&&(cnt.general||0)<C.acts.general.length)add('general');
    return steps;
  }

  function render(){
    var p=cur;
    $('p-date').textContent=_f('Pla creat el {0}.',[dt(p.t)]);
    $('p-crisis').hidden=!(p.x>0);
    var total=p.a.reduce(function(s,v){return s+v},0);
    $('p-heavy').hidden=!(total>=10||p.a[1]>=3||p.a[2]>=3);
    $('p-areas').innerHTML=C.keys.map(function(k,i){return '<li><span class="grow">'+esc(C.areas[k])+'</span><span class="badge" style="min-width:0">'+esc(C.levels[p.a[i]])+'</span></li>'}).join('');
    $('p-steps').innerHTML=p.s.map(function(s,n){
      var a=C.acts[s.a][s.i];
      return '<li><input type="checkbox" id="st'+n+'" data-i="'+n+'" aria-labelledby="st'+n+'t"'+(s.d?' checked':'')+'> '
        +'<span class="grow'+(s.d?' done':'')+'" id="st'+n+'t">'+esc(a.t)+(s.d?' <small class="muted">('+esc(_f('feta el {0}',[dt(s.d)]))+')</small>':'')+'</span>'
        +(a.h?'<a href="'+esc(a.h)+'" aria-describedby="st'+n+'t">'+esc(__('Obre l\'eina'))+'</a>':'')
        +'<button type="button" class="mini" data-sw="'+n+'" aria-describedby="st'+n+'t">'+esc(__('Canvia'))+'</button></li>';
    }).join('');
    $('p-quiz').hidden=true;$('p-plan').hidden=false;
  }

  $('p-steps').addEventListener('change',function(ev){
    var i=ev.target.getAttribute('data-i');if(i==null)return;
    cur.s[+i].d=ev.target.checked?Date.now():null;save();$('p-msg').textContent='';render();
    var b=$('st'+i);if(b)b.focus();
  });
  $('p-steps').addEventListener('click',function(ev){
    var n=ev.target.getAttribute&&ev.target.getAttribute('data-sw');if(n==null)return;
    n=+n;var s=cur.s[n],used={};cur.s.forEach(function(x){used[x.a+':'+x.i]=1});
    var len=C.acts[s.a].length,found=null,j;
    for(j=1;j<len&&!found;j++){var k=(s.i+j)%len;if(!used[s.a+':'+k])found={a:s.a,i:k,d:null}}
    for(j=0;j<C.acts.general.length&&!found;j++){if(!used['general:'+j])found={a:'general',i:j,d:null}}
    if(!found){$('p-msg').textContent=__('No hi ha més alternatives per a aquest pas.');return}
    cur.s[n]=found;save();$('p-msg').textContent='';render();
    var b=document.querySelector('[data-sw="'+n+'"]');if(b)b.focus();
  });

  function answers(){
    var a=[],first=-1;
    for(var i=0;i<5;i++){var c=document.querySelector('input[name=q'+i+']:checked');if(c)a.push(+c.value);else{a.push(null);if(first<0)first=i}}
    return {a:a,first:first};
  }
  $('p-go').addEventListener('click',function(){
    var r=answers();
    if(r.first>=0){
      $('p-err').textContent=__('Falten respostes: respon les cinc preguntes per veure el pla.');
      var el=document.querySelector('input[name=q'+r.first+']');if(el)el.focus();return;
    }
    $('p-err').textContent='';
    var sc=document.querySelector('input[name=s]:checked');
    cur={t:Date.now(),a:r.a,x:sc?+sc.value:0,s:build(r.a)};
    save();render();
    var h=$('p-plan').querySelector('h2');h.setAttribute('tabindex','-1');h.focus();
  });
  $('p-redo').addEventListener('click',function(){
    if(cur){C.keys.forEach(function(k,i){var c=document.querySelector('input[name=q'+i+'][value="'+cur.a[i]+'"]');if(c)c.checked=true})}
    $('p-plan').hidden=true;$('p-quiz').hidden=false;$('p-quiz').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('p-wipe').addEventListener('click',function(){
    if(!confirm(__('Vols esborrar el pla? No es pot desfer.')))return;
    cur=null;try{localStorage.removeItem(KEY)}catch(e){}
    [].slice.call(document.querySelectorAll('#p-form input:checked')).forEach(function(c){c.checked=false});
    $('p-plan').hidden=true;$('p-quiz').hidden=false;
  });

  cur=load();
  if(cur)render();
})();

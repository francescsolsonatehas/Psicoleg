(function(){
  var __=PSI.t,_f=PSI.f;
  function $(id){return document.getElementById(id)}
  function esc(s){var d=document.createElement('div');d.textContent=s==null?'':String(s);return d.innerHTML}
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  var KIND={f:__('Fitxa'),e:__('Eina'),p:__('Pàgina')};
  /* Clau d'ordre: sense articles ni «Trastorn(s) de…» al davant, perquè l'índex quedi per tema. */
  var PRE={
    ca:/^(?:trastorns?\s+(?:de la |de l'|del |dels |de les |de |d')?|(?:el|la|els|les)\s+|l')/i,
    es:/^(?:trastornos?\s+(?:de la |del |de los |de las |de )?|(?:el|la|los|las)\s+)/i,
    en:/^(?:the\s+)/i
  };
  var IDX=[];

  function prep(){
    IDX=(window.PSI_INDEX||[]).map(function(e){
      var nx=norm(e.x);
      return {u:e.u,t:e.t,h:e.h,x:e.x,k:e.k,nt:norm(e.t),nh:norm(e.h),nx:nx,ok:nx.length===e.x.length,
              sk:norm(e.t.replace(PRE[PSI.lang]||PRE.ca,'')||e.t)};
    });
  }

  /* ---- Índex alfabètic ---- */
  var coll=(window.Intl&&Intl.Collator)?new Intl.Collator(PSI.locale,{sensitivity:'base'}):null;
  function cmp(a,b){return coll?coll.compare(a.sk,b.sk):(a.sk<b.sk?-1:a.sk>b.sk?1:0)}
  function letter(e){var m=e.sk.match(/[a-z]/);return m?m[0].toUpperCase():'#'}
  function link(e,extra){
    return '<a href="'+esc(e.u)+'">'+esc(e.t)+'</a>'+(extra?' <span class="muted" style="font-size:.85rem">'+esc(extra)+'</span>':'');
  }
  function renderAZ(){
    var items=IDX.slice().sort(cmp),groups={},order=[];
    items.forEach(function(e){var l=letter(e);if(!groups[l]){groups[l]=[];order.push(l)}groups[l].push(e)});
    $('c-letters').innerHTML=order.map(function(l){return '<a href="#l-'+l+'">'+l+'</a>'}).join('');
    $('c-groups').innerHTML=order.map(function(l){
      return '<div class="az-group"><h3 id="l-'+l+'">'+l+'</h3><ul>'+groups[l].map(function(e){
        return '<li>'+link(e,e.k==='e'?KIND.e:'')+'</li>';
      }).join('')+'</ul></div>';
    }).join('');
  }

  /* ---- Cerca ---- */
  function snippet(e,toks){
    var i=-1;
    if(e.ok)toks.forEach(function(t){var j=e.nx.indexOf(t);if(j>-1&&(i<0||j<i))i=j});
    if(i<0)return esc(e.x.slice(0,150))+(e.x.length>150?'…':'');
    var s=Math.max(0,i-60),en=Math.min(e.x.length,i+120);
    var orig=e.x.slice(s,en),nn=e.nx.slice(s,en),marks=[];
    toks.forEach(function(t){var p=0,j;while((j=nn.indexOf(t,p))>-1){marks.push([j,j+t.length]);p=j+t.length}});
    marks.sort(function(a,b){return a[0]-b[0]});
    var out='',pos=0;
    marks.forEach(function(m){if(m[0]<pos)return;out+=esc(orig.slice(pos,m[0]))+'<mark>'+esc(orig.slice(m[0],m[1]))+'</mark>';pos=m[1]});
    out+=esc(orig.slice(pos));
    return (s>0?'…':'')+out+(en<e.x.length?'…':'');
  }
  function search(q){
    var toks=norm(q).split(/\s+/).filter(Boolean);
    if(!toks.length)return null;
    var res=[];
    IDX.forEach(function(e){
      var sc=0;
      for(var i=0;i<toks.length;i++){
        var t=toks[i];
        if(e.nt.indexOf(t)>-1)sc+=(e.nt.indexOf(t)===0||e.nt.indexOf(' '+t)>-1)?15:10;
        else if(e.nh.indexOf(t)>-1)sc+=4;
        else if(e.nx.indexOf(t)>-1)sc+=1;
        else return;
      }
      res.push({e:e,s:sc});
    });
    res.sort(function(a,b){return b.s-a.s||cmp(a.e,b.e)});
    return {toks:toks,res:res};
  }
  function run(){
    var q=$('c-q').value.trim(),r=search(q);
    if(!r){$('c-results').innerHTML='';$('c-count').textContent='';$('c-az').hidden=false;return}
    $('c-az').hidden=true;
    var n=r.res.length;
    $('c-count').textContent=n===0?__('No hem trobat cap resultat. Prova amb altres paraules.'):(n===1?__('1 resultat'):_f('{0} resultats',[n]));
    $('c-results').innerHTML=r.res.slice(0,30).map(function(x){
      return '<li><a href="'+esc(x.e.u)+'">'+esc(x.e.t)+'</a> <span class="tag">'+esc(KIND[x.e.k]||'')+'</span><p>'+snippet(x.e,r.toks)+'</p></li>';
    }).join('');
  }

  function init(){
    prep();renderAZ();
    $('c-q').addEventListener('input',run);
    $('c-form').addEventListener('submit',function(ev){ev.preventDefault();run()});
    var h=(location.hash||'').match(/^#q=(.*)$/);
    if(h){try{$('c-q').value=decodeURIComponent(h[1])}catch(e){}run()}
  }
  var s=document.createElement('script');
  s.src=(PSI.lang==='ca'?'':'../')+'js/search/'+PSI.lang+'.js';
  s.onload=init;
  s.onerror=function(){$('c-count').textContent=__('No s\'ha pogut carregar el cercador.')};
  document.head.appendChild(s);
})();

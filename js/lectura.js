(function(){
  var host=document.querySelector('[data-read]');
  if(!host||!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined')return;
  var synth=window.speechSynthesis,lang=document.documentElement.lang||'ca';
  var T={ca:{play:'🔊 Escoltar la pàgina',pause:'⏸ Pausa',resume:'▶ Continuar',stop:'⏹ Atura',speed:'Velocitat',lbl:'Lectura en veu alta',slow:'Lenta',norm:'Normal',fast:'Ràpida'},
         es:{play:'🔊 Escuchar la página',pause:'⏸ Pausa',resume:'▶ Continuar',stop:'⏹ Detener',speed:'Velocidad',lbl:'Lectura en voz alta',slow:'Lenta',norm:'Normal',fast:'Rápida'},
         en:{play:'🔊 Listen to this page',pause:'⏸ Pause',resume:'▶ Resume',stop:'⏹ Stop',speed:'Speed',lbl:'Read aloud',slow:'Slow',norm:'Normal',fast:'Fast'}}[lang.slice(0,2)]||{};
  var bar=document.createElement('div');bar.className='read-bar no-print';bar.setAttribute('role','group');bar.setAttribute('aria-label',T.lbl);
  bar.innerHTML='<button type="button" class="btn btn-outline btn-sm read-btn" id="rd-play">'+T.play+'</button>'+
    '<button type="button" class="btn btn-outline btn-sm read-btn" id="rd-pause" hidden>'+T.pause+'</button>'+
    '<button type="button" class="btn btn-outline btn-sm read-btn" id="rd-stop" hidden>'+T.stop+'</button>'+
    '<label class="read-speed"><span>'+T.speed+'</span> <select id="rd-rate"><option value="0.85">'+T.slow+'</option><option value="1" selected>'+T.norm+'</option><option value="1.2">'+T.fast+'</option></select></label>';
  host.insertBefore(bar,host.firstChild);
  var play=bar.querySelector('#rd-play'),pause=bar.querySelector('#rd-pause'),stop=bar.querySelector('#rd-stop'),rate=bar.querySelector('#rd-rate');
  var queue=[],idx=0,active=false,paused=false,cur=null,voice=null;
  function pickVoice(){var vs=synth.getVoices(),l=lang.toLowerCase();voice=vs.filter(function(v){return v.lang.toLowerCase().indexOf(l)===0})[0]||null}
  pickVoice();if(synth.onvoiceschanged!==undefined)synth.onvoiceschanged=pickVoice;
  function build(){
    queue=[];
    var els=host.querySelectorAll('h2,h3,p,li,.myth,.notice');
    [].forEach.call(els,function(el){
      if(el.closest('.read-bar')||el.closest('.btn-row'))return;
      if(el.tagName==='LI'&&el.querySelector('li'))return;
      var t=(el.innerText||el.textContent).replace(/\s*\n+\s*/g,'. ').replace(/\.\s*\./g,'.').replace(/\s+/g,' ').trim();if(!t)return;
      (t.match(/[^.!?;:]+[.!?;:]*\s*/g)||[t]).forEach(function(s,i){if(s.trim())queue.push({el:el,t:s.trim(),first:i===0})});
    });
  }
  function mark(el){if(cur)cur.classList.remove('reading');cur=el;if(el){el.classList.add('reading');try{el.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}}}
  function reset(){active=false;paused=false;mark(null);play.hidden=false;pause.hidden=true;stop.hidden=true;pause.textContent=T.pause}
  function next(){
    if(!active)return;
    if(idx>=queue.length){reset();return}
    var q=queue[idx++],u=new SpeechSynthesisUtterance(q.t);
    u.lang=lang;if(voice)u.voice=voice;u.rate=parseFloat(rate.value)||1;
    u.onstart=function(){if(q.first||cur!==q.el)mark(q.el)};
    u.onend=next;u.onerror=function(e){if(e.error==='canceled'||e.error==='interrupted')return;reset()};
    synth.speak(u);
  }
  play.addEventListener('click',function(){
    synth.cancel();build();if(!queue.length)return;
    idx=0;active=true;paused=false;play.hidden=true;pause.hidden=false;stop.hidden=false;next();
  });
  pause.addEventListener('click',function(){
    if(!paused){synth.pause();paused=true;pause.textContent=T.resume}else{synth.resume();paused=false;pause.textContent=T.pause}
  });
  stop.addEventListener('click',function(){active=false;synth.cancel();reset()});
  rate.addEventListener('change',function(){if(active&&!paused){idx=Math.max(0,idx-1);synth.cancel()}});
  window.addEventListener('pagehide',function(){synth.cancel()});
})();

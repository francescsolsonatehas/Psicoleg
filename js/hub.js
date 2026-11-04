(function(){
  var cards=[].slice.call(document.querySelectorAll('#cards .card')),q=document.getElementById('q'),
      chips=[].slice.call(document.querySelectorAll('.chip')),empty=document.getElementById('empty'),g='';
  function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')}
  function apply(){
    var t=norm(q.value.trim()),n=0;
    cards.forEach(function(c){
      var ok=(!g||c.dataset.group===g)&&(!t||norm(c.dataset.text).indexOf(t)>-1);
      c.hidden=!ok;if(ok)n++;
    });
    empty.hidden=n>0;
  }
  q.addEventListener('input',apply);
  chips.forEach(function(b){b.addEventListener('click',function(){
    g=b.dataset.g;chips.forEach(function(x){x.setAttribute('aria-pressed',x===b)});apply();
  })});
})();

(function(){
  var root=document.documentElement;
  function save(k,v){try{localStorage.setItem(k,v)}catch(e){}}
  document.getElementById('theme').addEventListener('click',function(){
    var next=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',next);save('psi-theme',next);
  });
  var fs=parseFloat(getComputedStyle(root).getPropertyValue('--fs'))||1;
  function setFs(v){fs=Math.min(1.4,Math.max(.85,v));root.style.setProperty('--fs',fs);save('psi-fs',fs)}
  document.getElementById('fs-up').addEventListener('click',function(){setFs(fs+.1)});
  document.getElementById('fs-down').addEventListener('click',function(){setFs(fs-.1)});
  var btn=document.getElementById('menu-btn'),menu=document.getElementById('menu');
  btn.addEventListener('click',function(){var o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',o)});
})();

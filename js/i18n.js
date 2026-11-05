/* i18n del costat del client: les cadenes en català són la clau; js/lang/<idioma>.js defineix PSI_DICT. */
(function(){
  var lang=(document.documentElement.lang||'ca').slice(0,2);
  var D=window.PSI_DICT||{};
  function t(s){return Object.prototype.hasOwnProperty.call(D,s)?D[s]:s}
  function f(s,a){return t(s).replace(/\{(\d+)\}/g,function(m,i){return a[+i]})}
  window.PSI={lang:lang,locale:{ca:'ca-ES',es:'es-ES',en:'en-GB'}[lang]||'ca-ES',t:t,f:f};
})();

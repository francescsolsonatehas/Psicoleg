/* Assistent de TCC (experimental). Tot opcional: res no es descarrega ni s'executa fins que l'usuari ho demana. */
const WEBLLM_URL = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm';
const OLLAMA = 'http://localhost:11434';
const $ = (id) => document.getElementById(id);

const COMMON = [
  'Ets un assistent d\'una web d\'ajuda per a l\'ansietat social. NO ets un terapeuta ni un professional sanitari.',
  'Respon SEMPRE en català, amb frases curtes (màxim 3), tó càlid i respectuós.',
  'No diagnostiquis, no parlis de medicació ni de dosis, i no donis consells mèdics.',
  'Si la persona expressa pensaments de fer-se mal o de no voler viure, digues-li amb calma que truqui al 024 o al 112 i atura\'t.',
  'No inventis dades sobre la persona. Si no saps alguna cosa, digues-ho.'
].join(' ');

const SCENARIOS = {
  feina: 'un company de feina que es creua amb la persona a la màquina de cafè',
  veí: 'un veí que es troba amb la persona a l\'ascensor',
  botiga: 'un/a dependent/a d\'una botiga on la persona vol fer una consulta o un canvi',
  desconegut: 'una persona desconeguda que espera al costat de la persona a la parada de l\'autobús',
  reunio: 'un company en una reunió de feina, abans que comenci, mentre s\'esperen els altres',
  entrevista: 'una persona de recursos humans que fa una entrevista de feina curta i amable'
};
const LEVELS = {
  facil: 'Fàcil: ets molt amable, fas preguntes obertes senzilles i deixes silencis còmodes.',
  mitja: 'Mitjà: ets neutre, de vegades poc expressiu, fas alguna pregunta inesperada.',
  dificil: 'Difícil però respectuós: ets una mica reservat/ada, fas preguntes directes i de vegades interromps amb tacte. Mai ets cruel ni humiliant.'
};
function systemFor(mode) {
  if (mode === 'roleplay') {
    return COMMON + ' MODE PRÀCTICA: fas de ' + SCENARIOS[$('a-scenario').value] + '. ' + LEVELS[$('a-level').value] +
      ' Mantén-te en el personatge i en una conversa breu i natural. Comença tu amb una sola frase. No facis de terapeuta mentre dura l\'escena.';
  }
  if (mode === 'reformula') {
    return COMMON + ' MODE REFORMULAR PENSAMENTS (TCC): ajuda la persona a mirar un pensament de por social amb distància. Fes UNA sola pregunta socràtica cada vegada (proves a favor i en contra, alternatives, què diria a un amic). No donis la resposta feta ni diguis que té raó o no. Quan hagi trobat una versió més equilibrada, resumeix-la en una frase. Comença demanant quina situació social li preocupa.';
  }
  return COMMON + ' MODE PREPARAR UN EXPERIMENT CONDUCTUAL: ajuda la persona a definir un pas petit, concret i assolible, a escriure què prediu que passarà (i quanta ansietat espera, de 0 a 100) i a decidir què observarà. Recorda-li que provi de no usar conductes de seguretat. Fes una pregunta cada vegada. Comença demanant quina situació vol provar.';
}

/* Detecció de crisi: CODI FIX, no depèn del model. Es mira abans d'enviar qualsevol missatge. */
const CRISIS = [/suicid/, /matar[- ]?me/, /m'?he de matar/, /vull matar-?me/, /no vull (viure|seguir|continuar)/, /voldria (morir|desapar)/,
  /vull morir/, /morir-?me/, /acabar amb (tot|la meva vida|la vida)/, /fer[- ]?me mal/, /autolesi/, /tallar[- ]?me/, /treure[- ]?me la vida/,
  /quitarme la vida|quitarse la vida|quiero morir|no quiero vivir|hacerme dano|acabar con todo|quiero desaparecer/];
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const isCrisis = (t) => CRISIS.some((r) => r.test(norm(t)));

let engineKind = 'web', webEngine = null, ollamaModel = '', history = [], busy = false, abortCtl = null, stopped = false;

function bubble(role, text) {
  const d = document.createElement('div');
  d.className = 'bubble ' + (role === 'user' ? 'me' : 'ai');
  d.textContent = text;
  $('a-log').appendChild(d);
  $('a-log').scrollTop = $('a-log').scrollHeight;
  return d;
}
function setBusy(b) {
  busy = b;
  $('a-send').disabled = b; $('a-stop').hidden = !b; $('a-end').disabled = b; $('a-input').disabled = b;
}
function showCrisis() {
  setBusy(false); history = [];
  $('a-crisis').hidden = false;
  $('a-crisis').scrollIntoView({ behavior: 'smooth', block: 'center' });
  $('a-input').disabled = true; $('a-send').disabled = true; $('a-end').disabled = true;
}
function setStatus(t, err) { const s = $('a-status'); s.textContent = t; s.className = err ? 'notice warn' : 'muted'; }

/* ---- Motors ---- */
async function loadWeb() {
  if (!('gpu' in navigator)) throw new Error('El teu navegador no admet WebGPU (prova Chrome o Edge d\'escriptori recents). Pots usar Ollama local.');
  setStatus('Carregant la llibreria...');
  const webllm = await import(WEBLLM_URL);
  const id = $('a-model').value;
  $('a-progress').hidden = false;
  webEngine = await webllm.CreateMLCEngine(id, {
    initProgressCallback: (r) => { setStatus(r.text || 'Descarregant el model...'); $('a-bar').style.width = Math.round((r.progress || 0) * 100) + '%'; }
  });
  $('a-progress').hidden = true;
}
async function detectOllama() {
  const r = await fetch(OLLAMA + '/api/tags', { signal: AbortSignal.timeout(3000) });
  const j = await r.json();
  const names = (j.models || []).map((m) => m.name);
  if (!names.length) throw new Error('Ollama funciona però no té cap model. Executa, per exemple: ollama pull llama3.2');
  const sel = $('a-oll-model'); sel.innerHTML = '';
  names.forEach((n) => { const o = document.createElement('option'); o.value = n; o.textContent = n; sel.appendChild(o); });
  return names;
}
function withSystem(msgs, mode) {
  const c = msgs.map((m) => ({ role: m.role, content: m.content }));
  c[0] = { role: 'user', content: systemFor(mode) + '\n\n' + c[0].content };
  return c;
}
async function generate(mode, onText) {
  const msgs = withSystem(history, mode);
  let out = '';
  if (engineKind === 'web') {
    const stream = await webEngine.chat.completions.create({ messages: msgs, stream: true, temperature: 0.7, max_tokens: 260 });
    for await (const ch of stream) { const d = ch.choices[0]?.delta?.content || ''; out += d; onText(out); if (stopped) break; }
  } else {
    abortCtl = new AbortController();
    const r = await fetch(OLLAMA + '/api/chat', { method: 'POST', signal: abortCtl.signal,
      body: JSON.stringify({ model: ollamaModel, messages: msgs, stream: true, options: { temperature: 0.7, num_predict: 260 } }) });
    if (!r.ok || !r.body) throw new Error('Ollama ha retornat un error (' + r.status + ').');
    const rd = r.body.getReader(), dec = new TextDecoder(); let buf = '';
    for (;;) {
      const { done, value } = await rd.read(); if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n'); buf = lines.pop();
      for (const ln of lines) { if (!ln.trim()) continue; try { const j = JSON.parse(ln); out += (j.message && j.message.content) || ''; onText(out); } catch (e) { /* línia parcial */ } }
    }
  }
  return out.trim();
}

async function turn(userText, hidden) {
  if (!hidden && isCrisis(userText)) { bubble('user', userText); showCrisis(); return; }
  history.push({ role: 'user', content: userText });
  if (!hidden) bubble('user', userText);
  const b = bubble('ai', '…'); setBusy(true); stopped = false;
  try {
    const mode = $('a-mode').value;
    const out = await generate(mode, (t) => { b.textContent = t; $('a-log').scrollTop = $('a-log').scrollHeight; });
    b.textContent = out || '(sense resposta)';
    history.push({ role: 'assistant', content: out });
  } catch (e) {
    if (e.name !== 'AbortError') { b.textContent = 'S\'ha produït un error: ' + e.message; b.classList.add('err'); }
    else { b.textContent += ' [aturat]'; }
  } finally { setBusy(false); abortCtl = null; if (!$('a-crisis').hidden) return; $('a-input').focus(); }
}

/* ---- Interfície ---- */
function refreshOpts() {
  const m = $('a-mode').value;
  $('a-role-opts').hidden = m !== 'roleplay';
  $('a-end').textContent = m === 'roleplay' ? 'Acabar i demanar feedback' : 'Resumir la conversa';
}
$('a-mode').addEventListener('change', refreshOpts); refreshOpts();

document.querySelectorAll('input[name=engine]').forEach((r) => r.addEventListener('change', () => {
  engineKind = r.value; $('a-web-box').hidden = engineKind !== 'web'; $('a-oll-box').hidden = engineKind !== 'ollama';
}));
$('a-consent').addEventListener('change', () => { $('a-load').disabled = !$('a-consent').checked; });
$('a-oll-check').addEventListener('click', async () => {
  try { await detectOllama(); setStatus('Ollama detectat. Escull un model i prem «Activar».'); $('a-oll-sel').hidden = false; }
  catch (e) { setStatus('No he pogut connectar amb Ollama a ' + OLLAMA + '. ' + (e.message || '') + ' Comprova que està en marxa i que permet aquest origen (OLLAMA_ORIGINS).', true); }
});
$('a-load').addEventListener('click', async () => {
  $('a-load').disabled = true;
  try {
    if (engineKind === 'web') await loadWeb();
    else { ollamaModel = $('a-oll-model').value; if (!ollamaModel) throw new Error('Primer prem «Detectar Ollama» i escull un model.'); }
    setStatus('Assistent llest.');
    $('a-setup').hidden = true; $('a-chat').hidden = false;
  } catch (e) { setStatus(e.message || String(e), true); $('a-progress').hidden = true; $('a-load').disabled = !$('a-consent').checked; }
});
$('a-start').addEventListener('click', () => {
  history = []; $('a-log').innerHTML = ''; $('a-crisis').hidden = true; $('a-input').disabled = false; $('a-send').disabled = false; $('a-end').disabled = false;
  const m = $('a-mode').value;
  turn(m === 'roleplay' ? '(Comença l\'escena amb una sola frase.)' : '(Comença la conversa.)', true);
});
$('a-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const t = $('a-input').value.trim(); if (!t || busy || history.length === 0) return;
  $('a-input').value = ''; turn(t, false);
});
$('a-stop').addEventListener('click', () => { stopped = true; if (webEngine) webEngine.interruptGenerate(); if (abortCtl) abortCtl.abort(); });
$('a-end').addEventListener('click', () => {
  if (busy || history.length === 0) return;
  const m = $('a-mode').value;
  turn(m === 'roleplay'
    ? '(Surt del personatge. Dona\'m feedback amable en català: 2 coses que he fet bé, 1 suggeriment concret, una frase d\'ànim, i recorda que no substitueixes un professional.)'
    : '(Resumeix en 3 punts el que hem treballat i proposa un pas petit per a aquesta setmana.)', true);
});
$('a-reset').addEventListener('click', () => { history = []; $('a-log').innerHTML = ''; $('a-crisis').hidden = true; $('a-input').disabled = false; $('a-send').disabled = false; $('a-end').disabled = false; });

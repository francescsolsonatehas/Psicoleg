/* Assistent de TCC (experimental). Tot opcional: res no es descarrega ni s'executa fins que l'usuari ho demana. */
const WEBLLM_URL = 'https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm@0.2.85/+esm';
const OLLAMA = 'http://localhost:11434';
const $ = (id) => document.getElementById(id);

const LANG = () => ($('a-lang') && $('a-lang').value) || 'es';
const T = {
  ca: {
    /* Redactat en positiu: amb una llista de prohibicions («NO ets…», «No diagnostiquis…») els models petits tendeixen a negar-se a respondre. */
    common: 'Ets un acompanyant amable d\'una web d\'autoajuda per a l\'ansietat social. Parles sempre en català, amb frases curtes (màxim 3) i to càlid i respectuós. No ets terapeuta: no fas diagnòstics ni parles de medicació. Si la persona parla de fer-se mal o de no voler viure, li dius amb calma que truqui al 024 o al 112.',
    scenarios: {
      feina: 'un company de feina que es creua amb la persona a la màquina de cafè',
      veí: 'un veí que es troba amb la persona a l\'ascensor',
      botiga: 'un/a dependent/a d\'una botiga on la persona vol fer una consulta o un canvi',
      desconegut: 'una persona desconeguda que espera al costat de la persona a la parada de l\'autobús',
      reunio: 'un company en una reunió de feina, abans que comenci, mentre s\'esperen els altres',
      entrevista: 'una persona de recursos humans que fa una entrevista de feina curta i amable'
    },
    levels: {
      facil: 'Fàcil: ets molt amable, fas preguntes obertes senzilles i deixes silencis còmodes.',
      mitja: 'Mitjà: ets neutre, de vegades poc expressiu, fas alguna pregunta inesperada.',
      dificil: 'Difícil però respectuós: ets una mica reservat/ada, fas preguntes directes i de vegades interromps amb tacte. Mai ets cruel ni humiliant.'
    },
    role: (sc, lv) => ' MODE PRÀCTICA: fas de ' + sc + '. ' + lv + ' Mantén-te en el personatge i en una conversa breu i natural. Comença tu amb una sola frase. No facis de terapeuta mentre dura l\'escena.',
    reformula: ' MODE REFORMULAR PENSAMENTS (TCC): ajuda la persona a mirar un pensament de por social amb distància. Fes UNA sola pregunta socràtica cada vegada (proves a favor i en contra, alternatives, què diria a un amic). No donis la resposta feta ni diguis que té raó o no. Quan hagi trobat una versió més equilibrada, resumeix-la en una frase. Comença demanant quina situació social li preocupa.',
    experiment: ' MODE PREPARAR UN EXPERIMENT CONDUCTUAL: ajuda la persona a definir un pas petit, concret i assolible, a escriure què prediu que passarà (i quanta ansietat espera, de 0 a 100) i a decidir què observarà. Recorda-li que provi de no usar conductes de seguretat. Fes una pregunta cada vegada. Comença demanant quina situació vol provar.',
    /* Missatges d'obertura en to natural: amb «(Comença la conversa.)» els models petits es neguen a respondre. */
    startRole: 'Hola, vull practicar una conversa. Comencem?',
    startRef: 'Hola, m\'agradaria revisar un pensament que em preocupa.',
    startExp: 'Hola, vull preparar un petit experiment per provar una cosa que em fa por.',
    endRole: 'D\'acord, acabem aquí la pràctica. Em dones la teva opinió? Digues-me 2 coses que he fet bé, 1 suggeriment concret i una frase d\'ànim.',
    endChat: 'Gràcies. Em fas un resum en 3 punts del que hem treballat i em proposes un pas petit per a aquesta setmana?',
    none: '(sense resposta)', stopped: ' [aturat]', err: 'S\'ha produït un error: '
  },
  es: {
    common: 'Eres un acompañante amable de una web de autoayuda para la ansiedad social. Hablas siempre en español, con frases cortas (máximo 3) y tono cálido y respetuoso. No eres terapeuta: no diagnosticas ni hablas de medicación. Si la persona habla de hacerse daño o de no querer vivir, le dices con calma que llame al 024 o al 112.',
    scenarios: {
      feina: 'un compañero de trabajo que se cruza con la persona en la máquina de café',
      veí: 'un vecino que se encuentra con la persona en el ascensor',
      botiga: 'un/a dependiente/a de una tienda donde la persona quiere hacer una consulta o un cambio',
      desconegut: 'una persona desconocida que espera junto a la persona en la parada del autobús',
      reunio: 'un compañero en una reunión de trabajo, antes de que empiece, mientras esperan a los demás',
      entrevista: 'una persona de recursos humanos que hace una entrevista de trabajo breve y amable'
    },
    levels: {
      facil: 'Fácil: eres muy amable, haces preguntas abiertas sencillas y dejas silencios cómodos.',
      mitja: 'Medio: eres neutro, a veces poco expresivo, haces alguna pregunta inesperada.',
      dificil: 'Difícil pero respetuoso: eres algo reservado/a, haces preguntas directas y a veces interrumpes con tacto. Nunca eres cruel ni humillante.'
    },
    role: (sc, lv) => ' MODO PRÁCTICA: haces de ' + sc + '. ' + lv + ' Mantente en el personaje y en una conversación breve y natural. Empieza tú con una sola frase. No hagas de terapeuta mientras dure la escena.',
    reformula: ' MODO REFORMULAR PENSAMIENTOS (TCC): ayuda a la persona a mirar con distancia un pensamiento de miedo social. Haz UNA sola pregunta socrática cada vez (pruebas a favor y en contra, alternativas, qué le diría a un amigo). No des la respuesta hecha ni digas si tiene razón o no. Cuando haya encontrado una versión más equilibrada, resúmela en una frase. Empieza preguntando qué situación social le preocupa.',
    experiment: ' MODO PREPARAR UN EXPERIMENTO CONDUCTUAL: ayuda a la persona a definir un paso pequeño, concreto y alcanzable, a escribir qué predice que pasará (y cuánta ansiedad espera, de 0 a 100) y a decidir qué observará. Recuérdale que intente no usar conductas de seguridad. Haz una pregunta cada vez. Empieza preguntando qué situación quiere probar.',
    startRole: 'Hola, quiero practicar una conversación. ¿Empezamos?',
    startRef: 'Hola, me gustaría revisar un pensamiento que me preocupa.',
    startExp: 'Hola, quiero preparar un pequeño experimento para probar algo que me da miedo.',
    endRole: 'Vale, terminemos aquí la práctica. ¿Me das tu opinión? Dime 2 cosas que he hecho bien, 1 sugerencia concreta y una frase de ánimo.',
    endChat: 'Gracias. ¿Me haces un resumen en 3 puntos de lo que hemos trabajado y me propones un paso pequeño para esta semana?',
    none: '(sin respuesta)', stopped: ' [detenido]', err: 'Se ha producido un error: '
  },
  en: {
    common: 'You are a kind companion on a self-help website for social anxiety. You always speak in English, in short sentences (3 at most) and in a warm, respectful tone. You are not a therapist: you do not diagnose or talk about medication. If the person talks about harming themselves or not wanting to live, you calmly tell them to call 024 or 112.',
    scenarios: {
      feina: 'a work colleague who bumps into the person at the coffee machine',
      veí: 'a neighbour who meets the person in the lift',
      botiga: 'a shop assistant where the person wants to ask a question or exchange something',
      desconegut: 'a stranger waiting next to the person at the bus stop',
      reunio: 'a colleague in a work meeting, before it starts, while waiting for the others',
      entrevista: 'a human resources person doing a short, friendly job interview'
    },
    levels: {
      facil: 'Easy: you are very friendly, ask simple open questions and leave comfortable silences.',
      mitja: 'Medium: you are neutral, sometimes not very expressive, and ask the occasional unexpected question.',
      dificil: 'Hard but respectful: you are a bit reserved, ask direct questions and sometimes interrupt politely. You are never cruel or humiliating.'
    },
    role: (sc, lv) => ' PRACTICE MODE: you play ' + sc + '. ' + lv + ' Stay in character and keep the conversation brief and natural. Start with a single sentence. Do not act as a therapist while the scene lasts.',
    reformula: ' THOUGHT REFRAMING MODE (CBT): help the person look at a socially fearful thought from a distance. Ask ONE Socratic question at a time (evidence for and against, alternatives, what they would say to a friend). Do not give the answer or say whether they are right. When they have found a more balanced version, sum it up in one sentence. Start by asking which social situation worries them.',
    experiment: ' BEHAVIOURAL EXPERIMENT MODE: help the person define a small, specific, achievable step, write down what they predict will happen (and how anxious they expect to be, from 0 to 100) and decide what they will observe. Remind them to try not to use safety behaviours. Ask one question at a time. Start by asking which situation they want to try.',
    startRole: 'Hi, I want to practise a conversation. Shall we start?',
    startRef: 'Hi, I\'d like to look at a thought that worries me.',
    startExp: 'Hi, I want to plan a small experiment to try something that scares me.',
    endRole: 'OK, let\'s end the practice here. Can you give me your feedback? Tell me 2 things I did well, 1 concrete suggestion and a word of encouragement.',
    endChat: 'Thanks. Can you sum up in 3 points what we\'ve worked on and suggest one small step for this week?',
    none: '(no reply)', stopped: ' [stopped]', err: 'An error occurred: '
  }
};
function systemFor(mode) {
  const t = T[LANG()];
  if (mode === 'roleplay') return t.common + t.role(t.scenarios[$('a-scenario').value], t.levels[$('a-level').value]);
  return t.common + (mode === 'reformula' ? t.reformula : t.experiment);
}

/* Detecció de crisi: CODI FIX, no depèn del model. Es mira abans d'enviar qualsevol missatge. */
const CRISIS = [/suicid/, /matar[- ]?me/, /m'?he de matar/, /vull matar-?me/, /no vull (viure|seguir|continuar)/, /voldria (morir|desapar)/,
  /vull morir/, /morir-?me/, /acabar amb (tot|la meva vida|la vida)/, /fer[- ]?me mal/, /autolesi/, /tallar[- ]?me/, /treure[- ]?me la vida/,
  /quitarme la vida|quitarse la vida|quiero morir|no quiero vivir|hacerme dano|acabar con todo|quiero desaparecer/,
  /\bem (vull|voldria|vaig a) (fer mal|matar)|\bme (quiero|quisiera|voy a) (hacer dano|matar)/,
  /kill(ing)? myself|end(ing)? it all|want to die|end my life|take my (own )?life|don.?t want to (live|be here|go on)|hurt myself|harm myself|self[- ]?harm|better off dead|wish i (was|were) dead|no reason to live/];
const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const isCrisis = (t) => CRISIS.some((r) => r.test(norm(t)));

let engineKind = 'web', webEngine = null, loadedModel = '', ollamaModel = '', history = [], busy = false, abortCtl = null, stopped = false;

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
if ($('a-lang')) { $('a-lang').value = PSI.lang === 'en' ? 'en' : 'es'; }
function setStatus(t, err) { const s = $('a-status'); s.textContent = t; s.className = err ? 'notice warn' : 'muted'; }

/* ---- Motors ---- */
async function loadWeb() {
  setStatus(PSI.t('Carregant la llibreria...'));
  $('a-progress').hidden = false; $('a-bar').style.width = '4%'; // feedback immediat: la barra es veu des del primer moment
  if (!('gpu' in navigator)) throw new Error(PSI.t('El teu navegador no admet WebGPU (prova Chrome o Edge d\'escriptori recents). Pots usar Ollama local.'));
  /* Comprovació prèvia: sense targeta gràfica compatible, o sense «shader-f16», el model ràpid (q4f16) no arrenca. */
  let adapter = null;
  try { adapter = await navigator.gpu.requestAdapter(); } catch (e) { adapter = null; }
  if (!adapter) throw new Error(PSI.t('El navegador té WebGPU però no ha trobat cap targeta gràfica compatible. Prova Chrome o Edge d\'escriptori actualitzats, o usa Ollama local.'));
  let id = $('a-model').value;
  if (!adapter.features.has('shader-f16')) id = id.replace('q4f16_1', 'q4f32_1'); // variant que no necessita f16 (existeix per als tres models)
  const webllm = await import(WEBLLM_URL);
  $('a-progress').hidden = false;
  webEngine = await webllm.CreateMLCEngine(id, {
    initProgressCallback: (r) => { setStatus(r.text || PSI.t('Descarregant el model...')); $('a-bar').style.width = Math.max(4, Math.round((r.progress || 0) * 100)) + '%'; }
  });
  loadedModel = id;
  $('a-progress').hidden = true;
}
async function detectOllama() {
  const r = await fetch(OLLAMA + '/api/tags', { signal: AbortSignal.timeout(3000) });
  const j = await r.json();
  const names = (j.models || []).map((m) => m.name);
  if (!names.length) throw new Error(PSI.t('Ollama funciona però no té cap model. Executa, per exemple: ollama pull llama3.2'));
  const sel = $('a-oll-model'); sel.innerHTML = '';
  names.forEach((n) => { const o = document.createElement('option'); o.value = n; o.textContent = n; sel.appendChild(o); });
  return names;
}
/* Les instruccions van en un missatge de rol «system» (Llama i Ollama). Si es barregen dins del primer missatge de l'usuari,
   Llama 3.2 1B/3B respon «Lo siento, pero no puedo cumplir con esa solicitud». Gemma no té rol system: allà sí que s'hi afegeixen. */
function withSystem(msgs, mode) {
  const c = msgs.map((m) => ({ role: m.role, content: m.content }));
  if (engineKind === 'web' && /gemma/i.test(loadedModel)) {
    c[0] = { role: 'user', content: systemFor(mode) + '\n\n' + c[0].content };
    return c;
  }
  return [{ role: 'system', content: systemFor(mode) }].concat(c);
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
    if (!r.ok || !r.body) throw new Error(PSI.f('Ollama ha retornat un error ({0}).', [r.status]));
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
    b.textContent = out || T[LANG()].none;
    history.push({ role: 'assistant', content: out });
  } catch (e) {
    if (e.name !== 'AbortError') { b.textContent = T[LANG()].err + e.message; b.classList.add('err'); }
    else { b.textContent += T[LANG()].stopped; }
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
$('a-consent').addEventListener('change', () => { $('a-load').disabled = !$('a-consent').checked; $('a-hint').hidden = $('a-consent').checked; });
$('a-oll-check').addEventListener('click', async () => {
  try { await detectOllama(); setStatus(PSI.t('Ollama detectat. Escull un model i prem «Activar».')); $('a-oll-sel').hidden = false; }
  catch (e) { setStatus(PSI.f('No he pogut connectar amb Ollama a {0}. {1} Comprova que està en marxa i que permet aquest origen (OLLAMA_ORIGINS).', [OLLAMA, e.message || '']), true); }
});
$('a-load').addEventListener('click', async () => {
  $('a-load').disabled = true;
  try {
    if (engineKind === 'web') await loadWeb();
    else { ollamaModel = $('a-oll-model').value; if (!ollamaModel) throw new Error(PSI.t('Primer prem «Detectar Ollama» i escull un model.')); }
    setStatus(PSI.t('Assistent llest.'));
    $('a-setup').hidden = true; $('a-chat').hidden = false;
  } catch (e) {
    let m = e.message || String(e);
    if (/cache|quota|storage/i.test(m)) m += ' — ' + PSI.t('Probablement no hi ha prou espai lliure al disc o el navegador limita l\'emmagatzematge. Allibera espai, prova un model més petit (Llama 1B) o usa Ollama local.');
    setStatus(m, true); $('a-status').scrollIntoView({ block: 'nearest' }); $('a-progress').hidden = true; $('a-load').disabled = !$('a-consent').checked; }
});
$('a-start').addEventListener('click', () => {
  history = []; $('a-log').innerHTML = ''; $('a-crisis').hidden = true; $('a-input').disabled = false; $('a-send').disabled = false; $('a-end').disabled = false;
  const m = $('a-mode').value, t = T[LANG()];
  turn(m === 'roleplay' ? t.startRole : m === 'reformula' ? t.startRef : t.startExp, true);
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
  turn(m === 'roleplay' ? T[LANG()].endRole : T[LANG()].endChat, true);
});
$('a-reset').addEventListener('click', () => { history = []; $('a-log').innerHTML = ''; $('a-crisis').hidden = true; $('a-input').disabled = false; $('a-send').disabled = false; $('a-end').disabled = false; });

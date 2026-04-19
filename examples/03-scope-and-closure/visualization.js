// ─── i18n ───
let lang = 'ko';

const I18N = {
  headerTitle:   { ko: '03. 스코프와 클로저', en: '03. Scope & Closure' },
  headerDesc:    { ko: '함수가 끝나도 환경이 살아남는 모습을 단계별로 확인해 보세요.', en: 'Step through and watch an environment survive after its function has returned.' },
  btnPrev:       { ko: '← 이전', en: '← Prev' },
  btnNext:       { ko: '다음 →', en: 'Next →' },
  btnReset:      { ko: '초기화', en: 'Reset' },
  running:       { ko: '실행 중', en: 'running' },
  emptyStack:    { ko: '콜 스택이 비어 있습니다', en: 'Call stack is empty' },
  consoleWait:   { ko: '// 출력 대기 중...', en: '// waiting for output...' },
  consoleLabel:  { ko: 'Console', en: 'Console' },
  initPrompt:    { ko: '▶ "다음" 버튼을 눌러 코드 실행을 시작하세요.', en: '▶ Press "Next" to start stepping through the code.' },
  envPanelTitle: { ko: 'Environments (Lexical)', en: 'Environments (Lexical)' },
  envPanelHint:  { ko: 'active = 스택 프레임에 묶여 있음 · persisted = 클로저로 살아남음', en: 'active = tied to a stack frame · persisted = kept alive by a closure' },
  badgeActive:   { ko: 'active', en: 'active' },
  badgePersist:  { ko: 'persisted', en: 'persisted' },
  refBy:         { ko: '← 참조 중:', en: '← referenced by:' },
};

// ─── Static Data ───
const CODE_LINES = [
  'function makeCounter() {',          // 0
  '  let count = 0;',                  // 1
  '  return function () {',            // 2
  '    count += 1;',                   // 3
  '    return count;',                 // 4
  '  };',                              // 5
  '}',                                 // 6
  '',                                  // 7
  'const counter = makeCounter();',    // 8
  'console.log(counter()); // 1',      // 9
  'console.log(counter()); // 2',      // 10
  '',                                  // 11
  'const counter2 = makeCounter();',   // 12
  'console.log(counter2()); // 1',     // 13
];

const CTX_STYLES = {
  'Global':           { color: 'ctx-global',   dot: 'dot-global',   label: { ko: 'Global Execution Context', en: 'Global Execution Context' } },
  'makeCounter() #1': { color: 'ctx-make1',    dot: 'dot-make1',    label: { ko: 'makeCounter — env#1 생성', en: 'makeCounter — creates env#1' } },
  'makeCounter() #2': { color: 'ctx-make2',    dot: 'dot-make2',    label: { ko: 'makeCounter — env#2 생성', en: 'makeCounter — creates env#2' } },
  'counter()':        { color: 'ctx-counter1', dot: 'dot-counter1', label: { ko: 'counter — env#1 참조', en: 'counter — uses env#1' } },
  'counter2()':       { color: 'ctx-counter2', dot: 'dot-counter2', label: { ko: 'counter2 — env#2 참조', en: 'counter2 — uses env#2' } },
};

const ENV_STYLE = {
  env1: { activeClass: 'env-active',   badgeActive: 'env-badge-active',   dot: 'dot-make1' },
  env2: { activeClass: 'env-active-2', badgeActive: 'env-badge-active-2', dot: 'dot-make2' },
};

// ─── Step Data ───
// Each step: { highlightLine, stack, envs, console, description }
// envs: array of { id, labelKo, labelEn, status: 'active'|'persisted', vars: [{name, value, flash}], refs: [] }

const env1 = (status, count, refs = [], flash = false) => ({
  id: 'env1',
  labelKo: 'env#1 (makeCounter)',
  labelEn: 'env#1 (makeCounter)',
  status,
  vars: count === null ? [] : [{ name: 'count', value: count, flash }],
  refs,
});

const env2 = (status, count, refs = [], flash = false) => ({
  id: 'env2',
  labelKo: 'env#2 (makeCounter)',
  labelEn: 'env#2 (makeCounter)',
  status,
  vars: count === null ? [] : [{ name: 'count', value: count, flash }],
  refs,
});

const STEPS = [
  {
    highlightLine: null,
    stack: ['Global'],
    envs: [],
    console: [],
    description: {
      ko: '스크립트가 로드되면 <strong>Global Execution Context</strong>가 생성됩니다. <code>makeCounter</code>는 호이스팅되어 이미 메모리에 올라와 있습니다.',
      en: 'When the script loads, a <strong>Global Execution Context</strong> is created. <code>makeCounter</code> is hoisted and already in memory.',
    },
  },
  {
    highlightLine: 8,
    stack: ['Global', 'makeCounter() #1'],
    envs: [env1('active', null)],
    console: [],
    description: {
      ko: '<code>makeCounter()</code> 호출. 새 EC가 push되고, 이 EC의 <strong>LexicalEnvironment(env#1)</strong>가 활성화됩니다.',
      en: '<code>makeCounter()</code> is called. A new EC is pushed, and its <strong>LexicalEnvironment (env#1)</strong> becomes active.',
    },
  },
  {
    highlightLine: 1,
    stack: ['Global', 'makeCounter() #1'],
    envs: [env1('active', 0, [], true)],
    console: [],
    description: {
      ko: '<code>let count = 0</code> — env#1의 환경 레코드에 <code>count</code>가 등록되고 <strong>0</strong>으로 초기화됩니다.',
      en: '<code>let count = 0</code> — <code>count</code> is registered in env#1\'s record and initialized to <strong>0</strong>.',
    },
  },
  {
    highlightLine: 2,
    stack: ['Global', 'makeCounter() #1'],
    envs: [env1('active', 0, ['returned inner function'])],
    console: [],
    description: {
      ko: '<code>return function() {...}</code> — 내부 익명 함수가 생성됩니다. 이 함수는 <strong>env#1을 outer reference로 가진 채</strong> 반환 준비를 합니다.',
      en: '<code>return function() {...}</code> — an inner anonymous function is created. It carries an <strong>outer reference to env#1</strong>.',
    },
  },
  {
    highlightLine: 8,
    stack: ['Global'],
    envs: [env1('persisted', 0, ['counter'])],
    console: [],
    description: {
      ko: '<code>makeCounter()</code>가 종료되어 EC가 pop됩니다. 보통이라면 env#1도 GC 대상이지만, 반환된 함수를 <code>counter</code>가 잡고 있고 그 함수가 env#1을 참조하므로 <strong>env#1은 살아남습니다</strong>. 이게 클로저입니다.',
      en: '<code>makeCounter()</code> finishes and its EC is popped. Normally env#1 would be GC-eligible, but the returned function held by <code>counter</code> references env#1, so <strong>env#1 survives</strong>. This is a closure.',
    },
  },
  {
    highlightLine: 9,
    stack: ['Global', 'counter()'],
    envs: [env1('persisted', 0, ['counter'])],
    console: [],
    description: {
      ko: '<code>counter()</code> 호출. 새 EC가 push됩니다. 이 EC의 outer reference는 <strong>env#1</strong>을 가리킵니다.',
      en: '<code>counter()</code> is called. A new EC is pushed, and its outer reference points to <strong>env#1</strong>.',
    },
  },
  {
    highlightLine: 3,
    stack: ['Global', 'counter()'],
    envs: [env1('persisted', 1, ['counter'], true)],
    console: [],
    description: {
      ko: '<code>count += 1</code>. 현재 스코프에 <code>count</code>가 없으므로 엔진은 스코프 체인을 따라 <strong>env#1에서 찾아 증가</strong>시킵니다. count: 0 → 1.',
      en: '<code>count += 1</code>. No <code>count</code> in the current scope, so the engine walks the chain and <strong>increments the one in env#1</strong>. count: 0 → 1.',
    },
  },
  {
    highlightLine: 9,
    stack: ['Global'],
    envs: [env1('persisted', 1, ['counter'])],
    console: ['1'],
    description: {
      ko: '<code>1</code>이 반환되어 콘솔에 출력되고 counter() EC는 pop됩니다. env#1은 <code>counter</code>가 계속 참조하므로 살아 있습니다.',
      en: '<code>1</code> is returned and logged, and counter()\'s EC is popped. env#1 stays alive as <code>counter</code> still references it.',
    },
  },
  {
    highlightLine: 10,
    stack: ['Global', 'counter()'],
    envs: [env1('persisted', 1, ['counter'])],
    console: ['1'],
    description: {
      ko: '<code>counter()</code> 두 번째 호출. 같은 env#1을 참조하므로 count는 1부터 시작합니다.',
      en: 'Second <code>counter()</code> call. Same env#1, so count starts from 1.',
    },
  },
  {
    highlightLine: 3,
    stack: ['Global', 'counter()'],
    envs: [env1('persisted', 2, ['counter'], true)],
    console: ['1'],
    description: {
      ko: '<code>count += 1</code>. env#1의 count가 1 → 2가 됩니다. 상태가 호출들 사이에 유지된다는 점이 핵심입니다.',
      en: '<code>count += 1</code>. env#1\'s count goes 1 → 2. The state is preserved across calls — that\'s the key.',
    },
  },
  {
    highlightLine: 10,
    stack: ['Global'],
    envs: [env1('persisted', 2, ['counter'])],
    console: ['1', '2'],
    description: {
      ko: '<code>2</code>가 반환되어 출력됩니다. env#1은 여전히 살아 있고 count는 2로 남습니다.',
      en: '<code>2</code> is returned and logged. env#1 is still alive with count = 2.',
    },
  },
  {
    highlightLine: 12,
    stack: ['Global', 'makeCounter() #2'],
    envs: [env1('persisted', 2, ['counter']), env2('active', null)],
    console: ['1', '2'],
    description: {
      ko: '<code>const counter2 = makeCounter()</code>. makeCounter가 다시 호출됩니다. 이번에는 완전히 <strong>새로운 env#2</strong>가 활성화됩니다.',
      en: '<code>const counter2 = makeCounter()</code>. makeCounter runs again — this time a <strong>brand-new env#2</strong> becomes active.',
    },
  },
  {
    highlightLine: 1,
    stack: ['Global', 'makeCounter() #2'],
    envs: [env1('persisted', 2, ['counter']), env2('active', 0, [], true)],
    console: ['1', '2'],
    description: {
      ko: 'env#2의 count가 <strong>0</strong>으로 초기화됩니다. env#1의 count(=2)와는 완전히 별개입니다.',
      en: 'env#2\'s count is initialized to <strong>0</strong>. This is entirely separate from env#1\'s count (=2).',
    },
  },
  {
    highlightLine: 12,
    stack: ['Global'],
    envs: [env1('persisted', 2, ['counter']), env2('persisted', 0, ['counter2'])],
    console: ['1', '2'],
    description: {
      ko: 'makeCounter #2가 pop됩니다. 반환된 함수가 <code>counter2</code>에 저장되고, env#2도 클로저로 살아남습니다. 이제 <strong>독립된 두 환경</strong>이 공존합니다.',
      en: 'makeCounter #2 is popped. The returned function is stored in <code>counter2</code>, and env#2 survives as a closure. <strong>Two independent environments</strong> now coexist.',
    },
  },
  {
    highlightLine: 13,
    stack: ['Global', 'counter2()'],
    envs: [env1('persisted', 2, ['counter']), env2('persisted', 0, ['counter2'])],
    console: ['1', '2'],
    description: {
      ko: '<code>counter2()</code> 호출. 이 EC의 outer reference는 <strong>env#2</strong>입니다. env#1은 건드리지 않습니다.',
      en: '<code>counter2()</code> is called. Its outer reference points to <strong>env#2</strong> — env#1 is untouched.',
    },
  },
  {
    highlightLine: 3,
    stack: ['Global', 'counter2()'],
    envs: [env1('persisted', 2, ['counter']), env2('persisted', 1, ['counter2'], true)],
    console: ['1', '2'],
    description: {
      ko: 'env#2의 count만 0 → 1로 바뀝니다. env#1의 count(=2)는 <strong>그대로</strong>입니다. 두 클로저가 각자의 상태를 갖는 이유가 여기에 있습니다.',
      en: 'Only env#2\'s count changes (0 → 1). env#1\'s count (=2) <strong>stays the same</strong>. This is why each closure has its own state.',
    },
  },
  {
    highlightLine: 13,
    stack: ['Global'],
    envs: [env1('persisted', 2, ['counter']), env2('persisted', 1, ['counter2'])],
    console: ['1', '2', '1'],
    description: {
      ko: '최종 상태 — env#1은 count=2, env#2는 count=1로 <strong>각자 독립</strong>된 값을 가집니다. <br/>💡 <code>makeCounter()</code>를 호출할 때마다 별개의 환경이 만들어지고, 각 환경은 반환된 함수가 살아 있는 동안 함께 살아남습니다.',
      en: 'Final state — env#1 has count=2, env#2 has count=1, <strong>each with its own state</strong>. <br/>💡 Every <code>makeCounter()</code> call creates a fresh environment, and each environment lives as long as its returned function does.',
    },
  },
];

// ─── State ───
let currentStep = -1;
let prevStack   = [];
let prevEnvIds  = [];

// ─── Helpers ───
const t = (key) => I18N[key]?.[lang] ?? key;

const escapeHtml = (str) =>
  String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ─── Language Switch ───
const handleLangSwitch = (selected) => {
  lang = selected;
  document.documentElement.lang = lang;
  ['Ko', 'En'].forEach((L) => {
    const btn = document.getElementById('btnLang' + L);
    const isActive = lang === L.toLowerCase();
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
  render();
};

// ─── Renderers ───
const renderStaticText = () => {
  document.getElementById('headerTitle').textContent   = t('headerTitle');
  document.getElementById('headerDesc').textContent    = t('headerDesc');
  document.getElementById('btnPrev').textContent       = t('btnPrev');
  document.getElementById('btnNext').textContent       = t('btnNext');
  document.getElementById('btnReset').textContent      = t('btnReset');
  document.getElementById('envPanelTitle').textContent = t('envPanelTitle');
  document.getElementById('envPanelHint').textContent  = t('envPanelHint');
  document.getElementById('consoleLabel').textContent  = t('consoleLabel');
};

const renderCode = () => {
  const panel = document.getElementById('codePanel');
  const step  = currentStep >= 0 ? STEPS[currentStep] : null;
  const hl    = step ? step.highlightLine : null;

  panel.innerHTML = CODE_LINES.map((text, i) => {
    const isHighlight = hl === i;
    const cls         = isHighlight ? 'line-highlight' : 'line-default';
    const num         = String(i + 1).padStart(2, ' ');
    const numColor    = isHighlight ? 'text-yellow-400' : 'text-gray-600';
    return `<div class="flex px-4 ${cls} transition-colors duration-200">
      <span class="${numColor} select-none w-7 text-right mr-4 text-xs leading-7">${num}</span>
      <span class="${isHighlight ? 'text-white' : 'text-gray-400'} whitespace-pre">${escapeHtml(text)}&nbsp;</span>
    </div>`;
  }).join('');
};

const renderStack = () => {
  const container = document.getElementById('callStack');
  const step      = currentStep >= 0 ? STEPS[currentStep] : { stack: [] };
  const newStack  = step.stack;

  container.innerHTML = '';

  if (newStack.length === 0) {
    container.innerHTML = `<div class="text-center text-gray-600 text-sm py-8">${t('emptyStack')}</div>`;
    prevStack = [];
    return;
  }

  newStack.forEach((name, i) => {
    const style = CTX_STYLES[name];
    const isNew = !prevStack.includes(name);
    const isTop = i === newStack.length - 1;
    const el    = document.createElement('div');
    el.className = `flex items-center gap-3 px-4 py-3 rounded-lg border-l-4 ${style.color} ${isNew ? 'stack-enter' : ''} ${isTop ? 'ring-1 ring-white/10' : ''}`;
    el.innerHTML = `
      <span class="w-2.5 h-2.5 rounded-full ${style.dot} shrink-0"></span>
      <span class="mono text-sm font-semibold text-white">${escapeHtml(name)}</span>
      <span class="text-xs text-gray-500 ml-auto">${style.label[lang]}</span>
      ${isTop ? `<span class="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full ml-2">${t('running')}</span>` : ''}
    `;
    container.appendChild(el);
  });

  prevStack = [...newStack];
};

const renderEnvs = () => {
  const container = document.getElementById('envPanel');
  const step      = currentStep >= 0 ? STEPS[currentStep] : { envs: [] };
  const envs      = step.envs || [];

  container.innerHTML = '';

  if (envs.length === 0) {
    container.innerHTML = `<div class="text-gray-600 text-xs italic text-center py-6">${lang === 'ko' ? '아직 만들어진 환경이 없습니다' : 'No environments yet'}</div>`;
    prevEnvIds = [];
    return;
  }

  envs.forEach((env) => {
    const style     = ENV_STYLE[env.id];
    const isNew     = !prevEnvIds.includes(env.id);
    const isActive  = env.status === 'active';
    const boxClass  = isActive ? style.activeClass : 'env-persisted';
    const badgeCls  = isActive ? style.badgeActive : 'env-badge-persisted';
    const badgeText = isActive ? t('badgeActive') : t('badgePersist');
    const label     = lang === 'ko' ? env.labelKo : env.labelEn;

    const varsHtml = env.vars.length === 0
      ? `<div class="mono text-[11px] text-gray-500 pl-4 italic">${lang === 'ko' ? '(아직 변수 없음)' : '(no variables yet)'}</div>`
      : env.vars.map(v => `
          <div class="mono text-xs text-gray-300 pl-4 flex items-baseline gap-2 rounded px-1 ${v.flash ? 'env-value-flash' : ''}">
            <span class="text-gray-400">${escapeHtml(v.name)}:</span>
            <span class="text-yellow-400 font-semibold">${escapeHtml(v.value)}</span>
          </div>
        `).join('');

    const refsHtml = env.refs.length > 0
      ? `<div class="env-ref-line mono">${t('refBy')} ${env.refs.map(r => `<span class="text-gray-300">${escapeHtml(r)}</span>`).join(', ')}</div>`
      : '';

    const el = document.createElement('div');
    el.className = `env-box ${boxClass} ${isNew ? 'env-enter' : ''}`;
    el.innerHTML = `
      <div class="flex items-center gap-2 mb-2">
        <span class="w-2 h-2 rounded-full ${style.dot}"></span>
        <span class="mono text-sm font-semibold text-white">${escapeHtml(label)}</span>
        <span class="ml-auto env-badge ${badgeCls}">${badgeText}</span>
      </div>
      ${varsHtml}
      ${refsHtml}
    `;
    container.appendChild(el);
  });

  prevEnvIds = envs.map(e => e.id);
};

const renderConsole = () => {
  const el   = document.getElementById('consoleOutput');
  const step = currentStep >= 0 ? STEPS[currentStep] : { console: [] };

  if (step.console.length === 0) {
    el.innerHTML = `<span class="text-gray-600">${t('consoleWait')}</span>`;
    return;
  }

  el.innerHTML = step.console.map(line => `<div>&gt; ${escapeHtml(line)}</div>`).join('');
  el.scrollTop = el.scrollHeight;
};

const renderDescription = () => {
  const el   = document.getElementById('description');
  const step = currentStep >= 0 ? STEPS[currentStep] : null;

  if (!step) {
    el.innerHTML = `<span class="text-gray-500">${t('initPrompt')}</span>`;
    return;
  }

  el.innerHTML = step.description[lang];
};

const renderBadge = () => {
  const el = document.getElementById('stepBadge');
  el.textContent = currentStep < 0 ? '' : `Step ${currentStep + 1} / ${STEPS.length}`;
};

const updateButtons = () => {
  document.getElementById('btnPrev').disabled = currentStep <= 0;
  const btnNext = document.getElementById('btnNext');
  const isLast  = currentStep >= STEPS.length - 1;
  btnNext.disabled = isLast;
  btnNext.classList.toggle('opacity-30', isLast);
};

const render = () => {
  renderStaticText();
  renderCode();
  renderStack();
  renderEnvs();
  renderConsole();
  renderDescription();
  renderBadge();
  updateButtons();
};

// ─── Controls ───
const handleNext = () => {
  if (currentStep < STEPS.length - 1) { currentStep++; render(); }
};

const handlePrev = () => {
  if (currentStep > 0) { currentStep--; render(); }
};

const handleReset = () => {
  currentStep = -1;
  prevStack   = [];
  prevEnvIds  = [];
  render();
};

// ─── Keyboard Shortcuts ───
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
  if (e.key === 'ArrowLeft')                   { e.preventDefault(); handlePrev(); }
  if (e.key === 'r' || e.key === 'R')          { handleReset(); }
});

render();

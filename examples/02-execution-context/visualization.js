// ─── i18n ───
let lang = 'ko';

const I18N = {
  headerTitle: { ko: '02. 실행 컨텍스트와 콜 스택',  en: '02. Execution Context & Call Stack' },
  headerDesc:  { ko: '함수가 호출될 때 콜 스택이 어떻게 변화하는지 단계별로 확인해 보세요.', en: 'Step through function calls and see how the call stack changes in real time.' },
  btnPrev:     { ko: '← 이전',  en: '← Prev' },
  btnNext:     { ko: '다음 →',  en: 'Next →' },
  btnReset:    { ko: '초기화',  en: 'Reset' },
  running:     { ko: '실행 중', en: 'running' },
  emptyStack:  { ko: '콜 스택이 비어 있습니다', en: 'Call stack is empty' },
  consoleWait: { ko: '// 출력 대기 중...', en: '// waiting for output...' },
  initPrompt:  { ko: '▶ "다음" 버튼을 눌러 코드 실행을 시작하세요.', en: '▶ Press "Next" to start stepping through the code.' },
};

// ─── Step Data ───
const STEPS = [
  {
    highlightLine: null,
    stack: ['Global'],
    console: [],
    description: {
      ko: '스크립트가 로드되면 <strong>Global Execution Context</strong>가 생성되고 콜 스택에 push됩니다.<br/>함수 선언들(first, second, third)이 생성 단계에서 메모리에 등록됩니다.',
      en: 'When the script loads, a <strong>Global Execution Context</strong> is created and pushed onto the call stack.<br/>Function declarations (first, second, third) are registered in memory during the creation phase.',
    },
  },
  {
    highlightLine: 16,
    stack: ['Global', 'first()'],
    console: [],
    description: {
      ko: '<code>first()</code>가 호출됩니다. <strong>Function Execution Context</strong>가 새로 생성되어 스택에 push됩니다.',
      en: '<code>first()</code> is called. A new <strong>Function Execution Context</strong> is created and pushed onto the stack.',
    },
  },
  {
    highlightLine: 1,
    stack: ['Global', 'first()'],
    console: ['first 시작'],
    description: {
      ko: '<code>first()</code> 내부 첫 줄. <code>console.log("first 시작")</code>이 실행됩니다.',
      en: 'Inside <code>first()</code>, the first line runs: <code>console.log("first start")</code>.',
    },
  },
  {
    highlightLine: 2,
    stack: ['Global', 'first()', 'second()'],
    console: ['first 시작'],
    description: {
      ko: '<code>second()</code>가 호출됩니다. 새로운 실행 컨텍스트가 스택에 push됩니다.<br/><code>first()</code>의 실행은 <code>second()</code>가 끝날 때까지 일시 정지됩니다.',
      en: '<code>second()</code> is called. A new execution context is pushed onto the stack.<br/><code>first()</code> is paused until <code>second()</code> completes.',
    },
  },
  {
    highlightLine: 7,
    stack: ['Global', 'first()', 'second()'],
    console: ['first 시작', 'second 시작'],
    description: {
      ko: '<code>second()</code> 내부 첫 줄. <code>console.log("second 시작")</code>이 실행됩니다.',
      en: 'Inside <code>second()</code>, the first line runs: <code>console.log("second start")</code>.',
    },
  },
  {
    highlightLine: 8,
    stack: ['Global', 'first()', 'second()', 'third()'],
    console: ['first 시작', 'second 시작'],
    description: {
      ko: '<code>third()</code>가 호출됩니다. 또 다른 실행 컨텍스트가 push됩니다.<br/>현재 콜 스택에 4개의 컨텍스트가 쌓여 있습니다.',
      en: '<code>third()</code> is called. Another execution context is pushed.<br/>The call stack now has 4 contexts stacked.',
    },
  },
  {
    highlightLine: 13,
    stack: ['Global', 'first()', 'second()', 'third()'],
    console: ['first 시작', 'second 시작', 'third'],
    description: {
      ko: '<code>third()</code> 내부. <code>console.log("third")</code>가 실행됩니다.',
      en: 'Inside <code>third()</code>: <code>console.log("third")</code> runs.',
    },
  },
  {
    highlightLine: 14,
    stack: ['Global', 'first()', 'second()'],
    console: ['first 시작', 'second 시작', 'third'],
    pop: 'third()',
    description: {
      ko: '<code>third()</code> 함수가 종료됩니다. 해당 실행 컨텍스트가 스택에서 <strong>pop</strong>됩니다.<br/>제어가 <code>second()</code>로 돌아갑니다.',
      en: '<code>third()</code> finishes. Its execution context is <strong>popped</strong> off the stack.<br/>Control returns to <code>second()</code>.',
    },
  },
  {
    highlightLine: 9,
    stack: ['Global', 'first()', 'second()'],
    console: ['first 시작', 'second 시작', 'third', 'second 끝'],
    description: {
      ko: '<code>second()</code>로 돌아와서 <code>console.log("second 끝")</code>이 실행됩니다.',
      en: 'Back in <code>second()</code>: <code>console.log("second end")</code> runs.',
    },
  },
  {
    highlightLine: 10,
    stack: ['Global', 'first()'],
    console: ['first 시작', 'second 시작', 'third', 'second 끝'],
    pop: 'second()',
    description: {
      ko: '<code>second()</code>가 종료되어 스택에서 pop됩니다. 제어가 <code>first()</code>로 돌아갑니다.',
      en: '<code>second()</code> finishes and is popped. Control returns to <code>first()</code>.',
    },
  },
  {
    highlightLine: 3,
    stack: ['Global', 'first()'],
    console: ['first 시작', 'second 시작', 'third', 'second 끝', 'first 끝'],
    description: {
      ko: '<code>first()</code>로 돌아와서 <code>console.log("first 끝")</code>이 실행됩니다.',
      en: 'Back in <code>first()</code>: <code>console.log("first end")</code> runs.',
    },
  },
  {
    highlightLine: 4,
    stack: ['Global'],
    console: ['first 시작', 'second 시작', 'third', 'second 끝', 'first 끝'],
    pop: 'first()',
    description: {
      ko: '<code>first()</code>가 종료되어 스택에서 pop됩니다. 콜 스택에는 <strong>Global</strong>만 남았습니다.',
      en: '<code>first()</code> finishes and is popped. Only <strong>Global</strong> remains on the stack.',
    },
  },
  {
    highlightLine: null,
    stack: [],
    console: ['first 시작', 'second 시작', 'third', 'second 끝', 'first 끝'],
    pop: 'Global',
    description: {
      ko: '모든 코드 실행이 완료되었습니다. Global Execution Context도 pop되어 콜 스택이 비워집니다.<br/><br/>💡 <strong>LIFO</strong>: 가장 마지막에 들어간 third()가 가장 먼저 나왔고, 가장 처음 들어간 Global이 가장 마지막에 나왔습니다.',
      en: 'All code has finished executing. The Global Execution Context is popped and the call stack is empty.<br/><br/>💡 <strong>LIFO</strong>: third() — the last one in — was the first one out, and Global — the first one in — was the last one out.',
    },
  },
];

// ─── Static Data ───
const CODE_LINES = [
  'function first() {',
  '  console.log("first 시작");',
  '  second();',
  '  console.log("first 끝");',
  '}',
  '',
  'function second() {',
  '  console.log("second 시작");',
  '  third();',
  '  console.log("second 끝");',
  '}',
  '',
  'function third() {',
  '  console.log("third");',
  '}',
  '',
  'first();',
];

const CTX_STYLES = {
  'Global':   { color: 'ctx-global',  dot: 'dot-global',  label: 'Global Execution Context' },
  'first()':  { color: 'ctx-first',   dot: 'dot-first',   label: 'first() — Function EC' },
  'second()': { color: 'ctx-second',  dot: 'dot-second',  label: 'second() — Function EC' },
  'third()':  { color: 'ctx-third',   dot: 'dot-third',   label: 'third() — Function EC' },
};

// ─── State ───
let currentStep = -1;
let prevStack = [];

// ─── Helpers ───
const t = (key) => I18N[key]?.[lang] ?? key;

const escapeHtml = (str) =>
  str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ─── Language Switch ───
const handleLangSwitch = (selected) => {
  lang = selected;
  document.documentElement.lang = lang;
  document.getElementById('btnLangKo').classList.toggle('active', lang === 'ko');
  document.getElementById('btnLangKo').setAttribute('aria-pressed', String(lang === 'ko'));
  document.getElementById('btnLangEn').classList.toggle('active', lang === 'en');
  document.getElementById('btnLangEn').setAttribute('aria-pressed', String(lang === 'en'));
  render();
};

// ─── Renderers ───
const renderStaticText = () => {
  document.getElementById('headerTitle').textContent = I18N.headerTitle[lang];
  document.getElementById('headerDesc').textContent  = I18N.headerDesc[lang];
  document.getElementById('btnPrev').textContent     = t('btnPrev');
  document.getElementById('btnNext').textContent     = t('btnNext');
  document.getElementById('btnReset').textContent    = t('btnReset');
};

const renderCode = () => {
  const panel = document.getElementById('codePanel');
  const step  = currentStep >= 0 ? STEPS[currentStep] : null;
  const hl    = step ? step.highlightLine : null;

  panel.innerHTML = CODE_LINES.map((text, i) => {
    const isHighlight = hl === i;
    const cls      = isHighlight ? 'line-highlight' : 'line-default';
    const num      = String(i + 1).padStart(2, ' ');
    const numColor = isHighlight ? 'text-yellow-400' : 'text-gray-600';
    return `<div class="flex px-4 ${cls} transition-colors duration-200">
      <span class="${numColor} select-none w-7 text-right mr-4 text-xs leading-7">${num}</span>
      <span class="${isHighlight ? 'text-white' : 'text-gray-400'}">${escapeHtml(text)}&nbsp;</span>
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
      <span class="text-xs text-gray-500 ml-auto">${style.label}</span>
      ${isTop ? `<span class="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full ml-2">${t('running')}</span>` : ''}
    `;
    container.appendChild(el);
  });

  prevStack = [...newStack];
};

const renderConsole = () => {
  const el   = document.getElementById('consoleOutput');
  const step = currentStep >= 0 ? STEPS[currentStep] : { console: [] };

  if (step.console.length === 0) {
    el.innerHTML = `<span class="text-gray-600">${t('consoleWait')}</span>`;
    return;
  }

  el.innerHTML   = step.console.map(line => `<div>&gt; ${escapeHtml(line)}</div>`).join('');
  el.scrollTop   = el.scrollHeight;
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
  render();
};

// ─── Keyboard Shortcuts ───
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); handleNext(); }
  if (e.key === 'ArrowLeft')                   { e.preventDefault(); handlePrev(); }
  if (e.key === 'r' || e.key === 'R')          { handleReset(); }
});

render();

// ─── i18n ───
let lang = 'ko';

const I18N = {
  headerTitle:   { ko: '04. this와 바인딩',                                     en: '04. this & Binding' },
  headerDesc:    { ko: '호출 형태에 따라 this가 어떻게 결정되는지 분기별로 따라가 보세요.', en: 'Walk through how this is decided by the call form.' },
  listLabel:     { ko: '예제 (클릭해서 선택)',                                   en: 'Examples (click to pick)' },
  listHint:      { ko: '총 10개',                                               en: '10 total' },
  flowLabel:     { ko: '바인딩 규칙 플로우',                                    en: 'Binding rule flow' },
  flowHint:      { ko: '위 → 아래 순서로 판정',                                 en: 'Evaluated top → bottom' },
  connLabel:     { ko: '호출 시점의 연결 상태 · this 결과',                     en: 'Link state at call · resolved this' },
  consoleLabel:  { ko: 'Console',                                               en: 'Console' },
  consoleWait:   { ko: '// 출력 대기 중...',                                    en: '// waiting for output...' },
  thisLabel:     { ko: 'this =',                                                en: 'this =' },
  arrowIgnore:   { ko: '(call/bind 시도 무시됨)',                               en: '(call/bind attempts ignored)' },
};

// ─── Binding rules (top → bottom) ───
const RULES = [
  { id: 'arrow',    qKo: '화살표 함수인가?',         qEn: 'Arrow function?',               rKo: '정의 위치의 바깥 this', rEn: "Outer this at definition" },
  { id: 'new',      qKo: 'new로 호출?',              qEn: 'Called with new?',              rKo: '새 인스턴스',           rEn: 'New instance' },
  { id: 'explicit', qKo: 'call / apply / bind?',     qEn: 'call / apply / bind?',          rKo: '지정한 객체',           rEn: 'Specified object' },
  { id: 'implicit', qKo: 'obj.fn() 형태?',           qEn: 'obj.fn() form?',                rKo: '점 앞 객체',            rEn: 'Object before the dot' },
  { id: 'default',  qKo: '그 외 — 그냥 fn() 호출',   qEn: 'Otherwise — plain fn() call',   rKo: '전역 객체 / undefined', rEn: 'Global / undefined' },
];

// ─── Examples ───
const EXAMPLES = [
  {
    id: 'default',
    titleKo: '기본 호출',
    titleEn: 'Default call',
    code: [
      '"use strict";',
      'function showThis() {',
      '  return this;',
      '}',
      'showThis();',
    ],
    highlightLines: [4],
    rule: 'default',
    leftBox: null,
    rightBox: 'showThis()',
    connection: 'none',
    thisKo: 'undefined (엄격 모드)',
    thisEn: 'undefined (strict)',
    console: ['undefined'],
    descKo: '점 앞 객체도, <code>new</code>도, <code>call/bind</code>도, 화살표도 아닌 <strong>그냥 호출</strong>. 기본 바인딩이 적용되고, 엄격 모드이므로 <code>this</code>는 <code>undefined</code>입니다.',
    descEn: 'No dot prefix, no <code>new</code>, no <code>call/bind</code>, not an arrow — just a plain call. Default binding applies, and strict mode yields <code>undefined</code>.',
  },
  {
    id: 'implicit',
    titleKo: '메서드 호출 (암시적)',
    titleEn: 'Method call (implicit)',
    code: [
      'const user = {',
      '  name: "Jeong",',
      '  greet() { return this; }',
      '};',
      'user.greet();',
    ],
    highlightLines: [4],
    rule: 'implicit',
    leftBox: { labelKo: 'user', labelEn: 'user', type: 'object' },
    rightBox: 'greet()',
    connection: 'solid',
    thisKo: 'user 객체',
    thisEn: 'user object',
    console: ['{ name: "Jeong", greet: ƒ }'],
    descKo: '호출 시점에 <code>.</code> 앞에 <strong>user</strong>가 있으므로 <strong>암시적 바인딩</strong>. this는 user입니다.',
    descEn: 'At the call site, <strong>user</strong> sits in front of the dot — <strong>implicit binding</strong>. this is user.',
  },
  {
    id: 'detached',
    titleKo: '떼어내기 — 연결 소멸',
    titleEn: 'Detached — link broken',
    code: [
      'const user = { name: "Jeong", greet() { return this; } };',
      'const g = user.greet;',
      'g();',
    ],
    highlightLines: [2],
    rule: 'default',
    leftBox: { labelKo: 'user', labelEn: 'user', type: 'object', ghost: true },
    rightBox: 'g()',
    connection: 'broken',
    thisKo: 'undefined (엄격)',
    thisEn: 'undefined (strict)',
    console: ['TypeError (strict) / undefined'],
    descKo: '함수를 변수에 담는 순간 점 앞 객체와의 연결이 <strong>끊어집니다</strong>. <code>g()</code>는 점이 없는 호출이라 기본 바인딩이 적용되고, this는 <code>undefined</code>.',
    descEn: 'Putting the method in a variable <strong>breaks</strong> the object link. <code>g()</code> is a plain call, so default binding kicks in and this is <code>undefined</code>.',
  },
  {
    id: 'explicit-call',
    titleKo: '명시적 바인딩 (call)',
    titleEn: 'Explicit (call)',
    code: [
      'function introduce() { return this.name; }',
      'const ctx = { name: "Jeong" };',
      'introduce.call(ctx);',
    ],
    highlightLines: [2],
    rule: 'explicit',
    leftBox: { labelKo: 'ctx', labelEn: 'ctx', type: 'explicit' },
    rightBox: 'introduce()',
    connection: 'solid',
    thisKo: 'ctx (call의 첫 인자)',
    thisEn: 'ctx (first arg of call)',
    console: ['Jeong'],
    descKo: '<code>call</code>의 첫 인자로 넘긴 객체가 곧 this가 됩니다. 호출 형태와 무관하게 this를 강제 지정하는 <strong>명시적 바인딩</strong>.',
    descEn: "The first argument of <code>call</code> becomes this, overriding any call-form rule — <strong>explicit binding</strong>.",
  },
  {
    id: 'explicit-bind',
    titleKo: 'bind로 this 고정',
    titleEn: 'bind — locked this',
    code: [
      'function introduce() { return this.name; }',
      'const bound = introduce.bind({ name: "Jeong" });',
      'bound();',
    ],
    highlightLines: [1],
    rule: 'explicit',
    leftBox: { labelKo: '{ name: "Jeong" }', labelEn: '{ name: "Jeong" }', type: 'explicit' },
    rightBox: 'bound()',
    connection: 'solid',
    thisKo: 'bind의 첫 인자 (고정됨)',
    thisEn: 'first arg of bind (locked)',
    console: ['Jeong'],
    descKo: '<code>bind</code>는 this가 <strong>고정된 새 함수</strong>를 돌려줍니다. 이후 어떻게 호출해도 this는 바뀌지 않습니다.',
    descEn: '<code>bind</code> returns a <strong>new function</strong> with this locked in. Later calls cannot change it.',
  },
  {
    id: 'new',
    titleKo: 'new 바인딩',
    titleEn: 'new binding',
    code: [
      'function User(name) {',
      '  this.name = name;',
      '}',
      'const u = new User("Jeong");',
    ],
    highlightLines: [3],
    rule: 'new',
    leftBox: { labelKo: '새 User 인스턴스', labelEn: 'new User instance', type: 'new-instance' },
    rightBox: 'User()',
    connection: 'solid',
    thisKo: '새로 만들어진 인스턴스',
    thisEn: 'the freshly created instance',
    console: ['User { name: "Jeong" }'],
    descKo: '<code>new</code>로 호출하면 엔진이 <strong>새 빈 객체</strong>를 만들어 this로 바인딩합니다. 함수 본문이 그 객체를 채우고, 완성된 객체가 반환됩니다.',
    descEn: 'A <code>new</code> call makes the engine create a <strong>fresh object</strong> as this. The body fills it in and the completed object is returned.',
  },
  {
    id: 'arrow-inside',
    titleKo: '화살표 — 렉시컬 this',
    titleEn: 'Arrow — lexical this',
    code: [
      'const user = {',
      '  name: "Jeong",',
      '  greet() {',
      '    const arrow = () => this.name;',
      '    return arrow();',
      '  }',
      '};',
      'user.greet();',
    ],
    highlightLines: [3, 4],
    rule: 'arrow',
    leftBox: { labelKo: 'greet의 this (= user)', labelEn: "greet's this (= user)", type: 'lexical' },
    rightBox: 'arrow()',
    connection: 'lexical',
    thisKo: '정의 위치의 바깥 this = user',
    thisEn: 'outer this at definition = user',
    console: ['Jeong'],
    descKo: '화살표는 <strong>자기 this가 없습니다</strong>. 정의된 위치의 바깥 스코프(= greet)의 this를 그대로 사용하고, greet은 <code>user.greet()</code>로 호출됐으니 this는 user.',
    descEn: 'Arrows have <strong>no own this</strong>. They pick up the outer scope\'s this at definition — greet\'s this, which is user because greet was invoked as <code>user.greet()</code>.',
  },
  {
    id: 'arrow-call-ignored',
    titleKo: '화살표에 call — 무시됨',
    titleEn: 'call on arrow — ignored',
    code: [
      'const arrow = () => this;',
      'arrow.call({ name: "X" });',
    ],
    highlightLines: [1],
    rule: 'arrow',
    leftBox: { labelKo: '모듈 최상위 this', labelEn: 'module-level this', type: 'lexical' },
    rightBox: 'arrow()',
    connection: 'lexical',
    thisKo: '바깥 스코프 this (call 무시됨)',
    thisEn: 'outer this (call ignored)',
    console: ['undefined (ESM) / {} (CJS)'],
    descKo: '화살표 함수의 this는 <strong>정의 시점에 고정</strong>되어 <code>call</code>로도 바꿀 수 없습니다. 넘긴 객체는 조용히 무시됩니다.',
    descEn: "An arrow's this is <strong>locked at definition</strong>, so <code>call</code> cannot change it. The passed object is silently ignored.",
  },
  {
    id: 'settimeout',
    titleKo: 'setTimeout 콜백 — 연결 소멸',
    titleEn: 'setTimeout callback — link lost',
    code: [
      'const user = { name: "Jeong", greet() { return this; } };',
      'setTimeout(user.greet, 100);',
    ],
    highlightLines: [1],
    rule: 'default',
    leftBox: { labelKo: 'user', labelEn: 'user', type: 'object', ghost: true },
    rightBox: 'greet()',
    connection: 'broken',
    thisKo: 'undefined (엄격)',
    thisEn: 'undefined (strict)',
    console: ['TypeError (strict) / undefined'],
    descKo: '<code>user.greet</code>를 인자로 넘기는 순간 점 앞 객체와의 연결이 끊어집니다. setTimeout은 나중에 <code>fn()</code> 꼴로 호출 → 기본 바인딩.',
    descEn: 'Passing <code>user.greet</code> as an argument drops the object link. setTimeout later calls it as <code>fn()</code> → default binding.',
  },
  {
    id: 'new-over-bind',
    titleKo: 'new > bind 우선순위',
    titleEn: 'new beats bind',
    code: [
      'function User(name) { this.name = name; }',
      'const Bound = User.bind({ locked: true });',
      'const u = new Bound("Jeong");',
    ],
    highlightLines: [2],
    rule: 'new',
    leftBox: { labelKo: '새 User 인스턴스', labelEn: 'new User instance', type: 'new-instance' },
    rightBox: 'Bound()',
    connection: 'solid',
    thisKo: '새 인스턴스 (bind의 this 무시)',
    thisEn: "new instance (bind's this ignored)",
    console: ['User { name: "Jeong" }'],
    descKo: '<code>bind</code>로 this를 고정해 뒀지만 <code>new</code>가 더 높은 우선순위입니다. 엔진은 새 인스턴스를 this로 사용하고 bind로 묶어둔 객체는 무시합니다.',
    descEn: '<code>bind</code> fixed this, but <code>new</code> has higher priority. The engine uses the fresh instance as this and discards the bound object.',
  },
];

// ─── State ───
let currentId = EXAMPLES[0].id;

// ─── Helpers ───
const t = (key) => I18N[key]?.[lang] ?? key;
const currentEx = () => EXAMPLES.find(e => e.id === currentId);
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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

const handleSelect = (id) => {
  currentId = id;
  render();
};

// ─── Renderers ───
const renderStaticText = () => {
  document.getElementById('headerTitle').textContent  = t('headerTitle');
  document.getElementById('headerDesc').textContent   = t('headerDesc');
  document.getElementById('listLabel').textContent    = t('listLabel');
  document.getElementById('listHint').textContent     = t('listHint');
  document.getElementById('flowLabel').textContent    = t('flowLabel');
  document.getElementById('flowHint').textContent     = t('flowHint');
  document.getElementById('connLabel').textContent    = t('connLabel');
  document.getElementById('consoleLabel').textContent = t('consoleLabel');
};

const renderExampleList = () => {
  const container = document.getElementById('exampleList');
  container.innerHTML = EXAMPLES.map((ex, i) => {
    const title = lang === 'ko' ? ex.titleKo : ex.titleEn;
    const isActive = ex.id === currentId;
    return `
      <div class="example-card ${isActive ? 'active' : ''}" onclick="handleSelect('${ex.id}')">
        <span class="card-num">${i + 1}</span>
        <span class="text-sm ${isActive ? 'text-white font-semibold' : 'text-gray-300'}">${escapeHtml(title)}</span>
        <span class="ml-auto mono text-[10px] text-gray-500 uppercase">${ex.rule}</span>
      </div>
    `;
  }).join('');
};

const renderCode = () => {
  const panel = document.getElementById('codePanel');
  const ex = currentEx();
  const hl = new Set(ex.highlightLines || []);
  panel.innerHTML = ex.code.map((line, i) => {
    const isH = hl.has(i);
    const cls = isH ? 'line-highlight' : 'line-default';
    const num = String(i + 1).padStart(2, ' ');
    const numColor = isH ? 'text-yellow-400' : 'text-gray-600';
    const txtColor = isH ? 'text-white' : 'text-gray-400';
    return `<div class="flex px-4 ${cls} transition-colors duration-200">
      <span class="${numColor} select-none w-7 text-right mr-4 text-xs leading-7">${num}</span>
      <span class="${txtColor} whitespace-pre">${escapeHtml(line)}&nbsp;</span>
    </div>`;
  }).join('');

  document.getElementById('codeBadge').textContent = (lang === 'ko' ? '예제 ' : 'Example ') + (EXAMPLES.findIndex(e => e.id === currentId) + 1) + ' / ' + EXAMPLES.length;
};

const renderFlowchart = () => {
  const container = document.getElementById('flowchart');
  const ex = currentEx();
  const activeIdx = RULES.findIndex(r => r.id === ex.rule);

  container.innerHTML = RULES.map((rule, i) => {
    const isActive = i === activeIdx;
    const isDimmed = !isActive;
    const q = lang === 'ko' ? rule.qKo : rule.qEn;
    const r = lang === 'ko' ? rule.rKo : rule.rEn;
    return `
      <div class="rule-row ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}">
        <span class="rule-badge">${rule.id.toUpperCase()}</span>
        <span class="text-sm ${isActive ? 'text-white' : 'text-gray-400'}">${escapeHtml(q)}</span>
        <span class="ml-auto text-xs mono rule-arrow">${escapeHtml(r)}</span>
      </div>
    `;
  }).join('');
};

const renderConnection = () => {
  const container = document.getElementById('connection');
  const ex = currentEx();
  const left = ex.leftBox;

  let html = '';

  if (left) {
    const label = lang === 'ko' ? left.labelKo : left.labelEn;
    const ghost = left.ghost ? 'ghost' : '';
    html += `<div class="conn-obj ${left.type} ${ghost}">${escapeHtml(label)}</div>`;
  } else {
    html += `<div class="text-gray-600 text-xs italic mono">(no caller)</div>`;
  }

  if (ex.connection === 'solid') {
    html += `<div class="conn-line"></div>`;
  } else if (ex.connection === 'broken') {
    html += `<div class="conn-line broken"></div>`;
  } else if (ex.connection === 'lexical') {
    html += `<div class="conn-line lexical"></div>`;
  } else {
    html += `<div class="conn-line" style="opacity:0.2"></div>`;
  }

  html += `<div class="conn-obj" style="border-color: rgba(250,204,21,0.5); background: rgba(250,204,21,0.08); color: #fde68a;">${escapeHtml(ex.rightBox)}</div>`;

  container.innerHTML = html;

  const tr = document.getElementById('thisResult');
  const thisVal = lang === 'ko' ? ex.thisKo : ex.thisEn;
  const hint = ex.rule === 'arrow'
    ? `<span class="text-gray-500 text-xs ml-2">${escapeHtml(t('arrowIgnore'))}</span>`
    : '';
  tr.innerHTML = `<span class="label">${t('thisLabel')}</span><span class="value">${escapeHtml(thisVal)}</span>${hint}`;
};

const renderDescription = () => {
  const el = document.getElementById('description');
  const ex = currentEx();
  el.innerHTML = lang === 'ko' ? ex.descKo : ex.descEn;
};

const renderConsole = () => {
  const el = document.getElementById('consoleOutput');
  const ex = currentEx();
  if (!ex.console || ex.console.length === 0) {
    el.innerHTML = `<span class="text-gray-600">${t('consoleWait')}</span>`;
    return;
  }
  el.innerHTML = ex.console.map(line => `<div>&gt; ${escapeHtml(line)}</div>`).join('');
};

const render = () => {
  renderStaticText();
  renderExampleList();
  renderCode();
  renderFlowchart();
  renderConnection();
  renderDescription();
  renderConsole();
};

// ─── Keyboard Shortcuts ───
document.addEventListener('keydown', (e) => {
  const idx = EXAMPLES.findIndex(ex => ex.id === currentId);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    e.preventDefault();
    if (idx < EXAMPLES.length - 1) handleSelect(EXAMPLES[idx + 1].id);
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    e.preventDefault();
    if (idx > 0) handleSelect(EXAMPLES[idx - 1].id);
  }
});

render();

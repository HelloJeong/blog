// ─── i18n ───
let lang = 'ko';

const I18N = {
  headerTitle:  { ko: '05. 데이터 타입과 동등 비교', en: '05. Types & Equality' },
  headerDesc:   { ko: '두 값을 골라 == 가 어떤 분기를 타고 어떤 변환을 거치는지 따라가 보세요.', en: 'Pick two values and walk through which branch == takes and how it converts them.' },
  listLabel:    { ko: '예제 (클릭해서 선택)', en: 'Examples (click to pick)' },
  listHint:     { ko: '총 10개', en: '10 total' },
  exprLabel:    { ko: '선택한 비교식', en: 'Selected comparison' },
  flowLabel:    { ko: '== 알고리즘 분기', en: '== algorithm branches' },
  flowHint:     { ko: '위 → 아래 순서로 판정', en: 'Evaluated top → bottom' },
  stepsLabel:   { ko: '변환 단계', en: 'Conversion steps' },
  resultsLabel: { ko: '== / === / Object.is 결과', en: '== / === / Object.is results' },
  noSteps:      { ko: '추가 변환 없음 — 같은 타입이라 바로 비교', en: 'No conversion — same type, compared directly' },
  differNote:   { ko: '결과가 갈리는 지점', en: 'where results diverge' },
};

// ─── Algorithm branches (top → bottom) ───
const RULES = [
  { id: 'same-type',   qKo: '두 값의 타입이 같은가?',          qEn: 'Same type?',                       rKo: '=== 규칙으로 비교',         rEn: 'Compare with === rules' },
  { id: 'null-undef',  qKo: 'null 과 undefined 인가?',         qEn: 'null and undefined?',              rKo: 'true (이 둘끼리만)',        rEn: 'true (only these two)' },
  { id: 'num-str',     qKo: 'Number ↔ String?',                qEn: 'Number ↔ String?',                 rKo: 'string 을 ToNumber',         rEn: 'ToNumber on the string' },
  { id: 'boolean',     qKo: '한쪽이 Boolean 인가?',            qEn: 'One side is Boolean?',             rKo: 'boolean 을 ToNumber 후 재평가', rEn: 'ToNumber on boolean, re-evaluate' },
  { id: 'obj-prim',    qKo: '한쪽이 Object 이고 다른쪽이 원시?', qEn: 'Object ↔ primitive?',              rKo: 'object 를 ToPrimitive 후 재평가', rEn: 'ToPrimitive on object, re-evaluate' },
  { id: 'fallback',    qKo: '그 외',                            qEn: 'Otherwise',                        rKo: 'false',                       rEn: 'false' },
];

// ─── Examples ───
// 각 예제는 == 알고리즘의 다른 분기를 보여준다
const EXAMPLES = [
  {
    id: 'num-num',
    titleKo: '숫자끼리 비교',
    titleEn: 'Number vs number',
    left:  { value: '1', type: 'number' },
    right: { value: '1', type: 'number' },
    branch: 'same-type',
    steps: [
      { ko: '두 값 모두 <code>number</code> 타입', en: 'Both values are <code>number</code>' },
      { ko: '값이 동일 → <code>true</code>', en: 'Values match → <code>true</code>' },
    ],
    results: { eq: 'true', seq: 'true', objIs: 'true' },
    descKo: '가장 단순한 경우. 같은 타입의 같은 값이라 어떤 비교 연산자를 써도 결과가 일치합니다.',
    descEn: 'The simplest case. Same type, same value — all three operators agree.',
  },
  {
    id: 'obj-ref',
    titleKo: '객체 — 다른 참조',
    titleEn: 'Objects — different references',
    left:  { value: '{ a: 1 }', type: 'object', label: 'objA' },
    right: { value: '{ a: 1 }', type: 'object', label: 'objB' },
    branch: 'same-type',
    steps: [
      { ko: '두 값 모두 <code>object</code> 타입', en: 'Both values are <code>object</code>' },
      { ko: '객체는 <strong>참조</strong>로 비교 — 서로 다른 주소', en: 'Objects compare by <strong>reference</strong> — different addresses' },
      { ko: '결과 <code>false</code>', en: 'Result <code>false</code>' },
    ],
    results: { eq: 'false', seq: 'false', objIs: 'false' },
    descKo: '내용이 같아 보여도 서로 다른 객체라면 참조가 다르므로 <code>false</code>. "내용 비교"는 별도 로직이 필요합니다.',
    descEn: 'They look identical but live at different addresses, so the reference check returns <code>false</code>. Deep equality needs separate logic.',
  },
  {
    id: 'null-undef',
    titleKo: 'null 과 undefined',
    titleEn: 'null and undefined',
    left:  { value: 'null', type: 'null' },
    right: { value: 'undefined', type: 'undef' },
    branch: 'null-undef',
    steps: [
      { ko: '타입이 다르다 (null ↔ undefined)', en: 'Types differ (null ↔ undefined)' },
      { ko: '<strong>특수 규칙</strong>: null 과 undefined 끼리는 <code>==</code>에서 같다고 본다', en: '<strong>Special rule</strong>: null and undefined are loosely equal' },
      { ko: '결과 <code>true</code> (단, ===는 false)', en: 'Result <code>true</code> (=== returns false)' },
    ],
    results: { eq: 'true', seq: 'false', objIs: 'false' },
    descKo: '"값이 비어있다"를 한 번에 체크할 때 쓰는 <code>value == null</code> 관용구의 근거. <code>===</code>는 두 값을 별개의 타입으로 봅니다.',
    descEn: "The basis of the <code>value == null</code> idiom for null/undefined checks. <code>===</code> treats them as distinct types.",
  },
  {
    id: 'null-zero',
    titleKo: 'null 과 0',
    titleEn: 'null and 0',
    left:  { value: 'null', type: 'null' },
    right: { value: '0', type: 'number' },
    branch: 'fallback',
    steps: [
      { ko: '타입이 다르다 (null ↔ number)', en: 'Types differ (null ↔ number)' },
      { ko: 'null 은 <strong>undefined 와만</strong> 같다고 본다', en: 'null is loosely equal <strong>only to undefined</strong>' },
      { ko: '나머지는 모두 <code>false</code>', en: 'Everything else → <code>false</code>' },
    ],
    results: { eq: 'false', seq: 'false', objIs: 'false' },
    descKo: '직관적으로는 "null도 0이나 false 같이 빈 값 아닌가?" 싶지만, 명세는 null의 짝을 undefined 하나로 못박아 두었습니다.',
    descEn: 'Intuitively null might feel "empty like 0", but the spec only pairs null with undefined and nothing else.',
  },
  {
    id: 'num-str',
    titleKo: '숫자와 숫자문자열',
    titleEn: 'Number and numeric string',
    left:  { value: '1', type: 'number' },
    right: { value: '"1"', type: 'string' },
    branch: 'num-str',
    steps: [
      { ko: '타입이 다르다 (number ↔ string)', en: 'Types differ (number ↔ string)' },
      { ko: 'string 을 <code>ToNumber("1")</code> = <code>1</code>', en: 'Apply <code>ToNumber("1")</code> = <code>1</code>' },
      { ko: '<code>1 == 1</code> → <code>true</code>', en: '<code>1 == 1</code> → <code>true</code>' },
    ],
    results: { eq: 'true', seq: 'false', objIs: 'false' },
    descKo: '입력값이 string 으로 들어오는 폼/쿼리스트링과 number 를 비교할 때 자주 마주치는 케이스. <code>===</code>는 즉시 false 입니다.',
    descEn: 'Common when comparing form / query-string strings against numbers. <code>===</code> returns false right away.',
  },
  {
    id: 'zero-empty',
    titleKo: '0 과 빈 문자열',
    titleEn: '0 and empty string',
    left:  { value: '0', type: 'number' },
    right: { value: '""', type: 'string' },
    branch: 'num-str',
    steps: [
      { ko: '타입이 다르다 (number ↔ string)', en: 'Types differ (number ↔ string)' },
      { ko: 'string 을 <code>ToNumber("")</code> = <code>0</code>', en: 'Apply <code>ToNumber("")</code> = <code>0</code>' },
      { ko: '<code>0 == 0</code> → <code>true</code>', en: '<code>0 == 0</code> → <code>true</code>' },
    ],
    results: { eq: 'true', seq: 'false', objIs: 'false' },
    descKo: '<code>ToNumber("")</code>가 <code>0</code>이라는 점이 직관에 어긋나는 결과를 만듭니다. 사용자 입력 검증에서 <code>==</code>를 쓰면 함정이 되는 대표 사례.',
    descEn: '<code>ToNumber("")</code> equals <code>0</code>, producing a counter-intuitive result. A classic pitfall when validating user input with <code>==</code>.',
  },
  {
    id: 'bool-str',
    titleKo: 'false 와 "0"',
    titleEn: 'false and "0"',
    left:  { value: 'false', type: 'boolean' },
    right: { value: '"0"', type: 'string' },
    branch: 'boolean',
    steps: [
      { ko: '한쪽이 Boolean → <code>ToNumber(false)</code> = <code>0</code>', en: 'Boolean side → <code>ToNumber(false)</code> = <code>0</code>' },
      { ko: '재평가: <code>0 == "0"</code>', en: 'Re-evaluate: <code>0 == "0"</code>' },
      { ko: 'Number ↔ String 분기로 진입 → <code>ToNumber("0")</code> = <code>0</code>', en: 'Now Number ↔ String → <code>ToNumber("0")</code> = <code>0</code>' },
      { ko: '<code>0 == 0</code> → <code>true</code>', en: '<code>0 == 0</code> → <code>true</code>' },
    ],
    results: { eq: 'true', seq: 'false', objIs: 'false' },
    descKo: 'Boolean 변환은 한 단계로 끝나지 않습니다. <code>false</code>를 <code>0</code>으로 바꾼 뒤 다시 알고리즘을 처음부터 돌립니다.',
    descEn: 'Boolean conversion is not a single step. <code>false</code> becomes <code>0</code>, then the algorithm restarts from the top.',
  },
  {
    id: 'arr-bool',
    titleKo: '빈 배열 과 false',
    titleEn: 'Empty array and false',
    left:  { value: '[]', type: 'object' },
    right: { value: 'false', type: 'boolean' },
    branch: 'boolean',
    steps: [
      { ko: '한쪽이 Boolean → <code>ToNumber(false)</code> = <code>0</code>', en: 'Boolean side → <code>ToNumber(false)</code> = <code>0</code>' },
      { ko: '재평가: <code>[] == 0</code> — 한쪽이 Object', en: 'Re-evaluate: <code>[] == 0</code> — one side is Object' },
      { ko: '<code>ToPrimitive([])</code> = <code>""</code>', en: '<code>ToPrimitive([])</code> = <code>""</code>' },
      { ko: '재평가: <code>"" == 0</code> → <code>ToNumber("")</code> = <code>0</code>', en: 'Re-evaluate: <code>"" == 0</code> → <code>ToNumber("")</code> = <code>0</code>' },
      { ko: '<code>0 == 0</code> → <code>true</code>', en: '<code>0 == 0</code> → <code>true</code>' },
    ],
    results: { eq: 'true', seq: 'false', objIs: 'false' },
    descKo: '세 단계의 변환을 거쳐 <code>true</code>에 도달합니다. 분기들이 어떻게 연쇄되는지 보여주는 가장 극적인 예입니다.',
    descEn: 'Three layers of conversion lead to <code>true</code>. The most dramatic example of how branches cascade.',
  },
  {
    id: 'nan-nan',
    titleKo: 'NaN 과 NaN',
    titleEn: 'NaN and NaN',
    left:  { value: 'NaN', type: 'number' },
    right: { value: 'NaN', type: 'number' },
    branch: 'same-type',
    steps: [
      { ko: '두 값 모두 <code>number</code> 타입 → === 규칙 적용', en: 'Both <code>number</code> → === rules apply' },
      { ko: '<strong>NaN 예외</strong>: NaN 은 자기 자신과도 같지 않다 (IEEE 754)', en: '<strong>NaN exception</strong>: NaN is never equal to itself (IEEE 754)' },
      { ko: '<code>==</code> / <code>===</code> 모두 <code>false</code>', en: 'Both <code>==</code> / <code>===</code> return <code>false</code>' },
      { ko: '<code>Object.is</code>는 NaN/NaN 을 <code>true</code>로 처리', en: '<code>Object.is</code> treats NaN/NaN as <code>true</code>' },
    ],
    results: { eq: 'false', seq: 'false', objIs: 'true' },
    descKo: '<code>Object.is</code>가 <code>===</code>와 갈라지는 두 지점 중 첫 번째. NaN 검사를 <code>===</code>로 하면 항상 false 가 나옵니다.',
    descEn: "The first of two cases where <code>Object.is</code> diverges from <code>===</code>. Checking for NaN via <code>===</code> always fails.",
  },
  {
    id: 'plus-minus-zero',
    titleKo: '+0 과 -0',
    titleEn: '+0 and -0',
    left:  { value: '+0', type: 'number' },
    right: { value: '-0', type: 'number' },
    branch: 'same-type',
    steps: [
      { ko: '두 값 모두 <code>number</code> 타입 → === 규칙 적용', en: 'Both <code>number</code> → === rules apply' },
      { ko: '<code>==</code> / <code>===</code>는 +0 과 -0 을 <strong>같다</strong>고 본다', en: '<code>==</code> / <code>===</code> treat +0 and -0 as <strong>equal</strong>' },
      { ko: '<code>Object.is</code>는 부호까지 구분하여 <code>false</code>', en: '<code>Object.is</code> distinguishes the sign → <code>false</code>' },
    ],
    results: { eq: 'true', seq: 'true', objIs: 'false' },
    descKo: '<code>Object.is</code>가 <code>===</code>와 갈라지는 두 번째 지점. 거의 모든 실무 코드에서는 둘이 같다고 봐도 무방하지만, 부호가 의미 있는 도메인(좌표·물리 시뮬레이션 등)에서는 <code>Object.is</code>가 정답이 됩니다.',
    descEn: "The second case where <code>Object.is</code> diverges. In most code +0 and -0 are interchangeable, but for domains where sign matters (coordinates, physics) <code>Object.is</code> is the right tool.",
  },
];

// ─── State ───
let currentId = EXAMPLES[0].id;

// ─── Helpers ───
const t = (key) => I18N[key]?.[lang] ?? key;
const currentEx = () => EXAMPLES.find((e) => e.id === currentId);
const escapeHtml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const typeLabel = (t) => ({
  string: 'string',
  number: 'number',
  boolean: 'boolean',
  null: 'null',
  undef: 'undefined',
  object: 'object',
}[t] ?? t);

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
  document.getElementById('exprLabel').textContent    = t('exprLabel');
  document.getElementById('flowLabel').textContent    = t('flowLabel');
  document.getElementById('flowHint').textContent     = t('flowHint');
  document.getElementById('stepsLabel').textContent   = t('stepsLabel');
  document.getElementById('resultsLabel').textContent = t('resultsLabel');
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
        <span class="ml-auto mono text-[10px] text-gray-500 uppercase">${ex.branch}</span>
      </div>
    `;
  }).join('');
};

const renderExpression = () => {
  const ex = currentEx();
  const renderOperand = (op) => `
    <div>
      <div class="operand t-${op.type}">${escapeHtml(op.value)}</div>
      <span class="operand-type">${typeLabel(op.type)}</span>
    </div>
  `;
  const expr = document.getElementById('expression');
  expr.innerHTML = `
    ${renderOperand(ex.left)}
    <div class="operator">==</div>
    ${renderOperand(ex.right)}
  `;
  document.getElementById('exprBadge').textContent =
    (lang === 'ko' ? '예제 ' : 'Example ') +
    (EXAMPLES.findIndex((e) => e.id === currentId) + 1) + ' / ' + EXAMPLES.length;
};

const renderFlowchart = () => {
  const container = document.getElementById('flowchart');
  const ex = currentEx();
  const activeIdx = RULES.findIndex((r) => r.id === ex.branch);

  container.innerHTML = RULES.map((rule, i) => {
    const isActive = i === activeIdx;
    const isDimmed = !isActive;
    const q = lang === 'ko' ? rule.qKo : rule.qEn;
    const r = lang === 'ko' ? rule.rKo : rule.rEn;
    return `
      <div class="rule-row ${isActive ? 'active' : ''} ${isDimmed ? 'dimmed' : ''}">
        <span class="rule-badge">${rule.id.toUpperCase()}</span>
        <span class="text-sm ${isActive ? 'text-white' : 'text-gray-400'}">${escapeHtml(q)}</span>
        <span class="ml-auto rule-arrow">→ ${escapeHtml(r)}</span>
      </div>
    `;
  }).join('');
};

const renderSteps = () => {
  const container = document.getElementById('steps');
  const ex = currentEx();
  if (!ex.steps || ex.steps.length === 0) {
    container.innerHTML = `<div class="steps-empty">${escapeHtml(t('noSteps'))}</div>`;
    return;
  }
  container.innerHTML = ex.steps.map((step, i) => {
    const text = lang === 'ko' ? step.ko : step.en;
    return `
      <div class="step-row">
        <span class="step-num">${i + 1}</span>
        <span class="step-text">${text}</span>
      </div>
    `;
  }).join('');
};

const renderResults = () => {
  const container = document.getElementById('results');
  const ex = currentEx();
  const { eq, seq, objIs } = ex.results;

  // 다수결과 다른 minority 결과만 강조 (세 결과는 boolean이라 항상 all-same 또는 2-1 분포)
  const allSame = eq === seq && seq === objIs;
  const minority = allSame
    ? null
    : eq !== seq && eq !== objIs ? '==' : seq !== eq && seq !== objIs ? '===' : 'Object.is';

  const row = (op, val) => {
    const differs = op === minority;
    const note = differs ? t('differNote') : '';
    return `
      <div class="result-row ${differs ? 'differ' : ''}">
        <span class="result-op">${escapeHtml(op)}</span>
        <span class="result-val ${val}">${escapeHtml(val)}</span>
        ${note ? `<span class="result-note">${escapeHtml(note)}</span>` : ''}
      </div>
    `;
  };

  container.innerHTML = [
    row('==', eq),
    row('===', seq),
    row('Object.is', objIs),
  ].join('');
};

const renderDescription = () => {
  const el = document.getElementById('description');
  const ex = currentEx();
  el.innerHTML = lang === 'ko' ? ex.descKo : ex.descEn;
};

const render = () => {
  renderStaticText();
  renderExampleList();
  renderExpression();
  renderFlowchart();
  renderSteps();
  renderResults();
  renderDescription();
};

// ─── Keyboard Shortcuts ───
document.addEventListener('keydown', (e) => {
  const idx = EXAMPLES.findIndex((ex) => ex.id === currentId);
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

// 01. JavaScript 엔진과 런타임 환경
// 블로그: ../javascript-core/01-javascript-engine-and-runtime.md

// -------------------------------------------
// JIT 최적화 — 타입 일관성의 중요성
// -------------------------------------------

function add(a, b) {
  return a + b;
}

// 타입이 일관되면 TurboFan이 최적화를 유지한다
for (let i = 0; i < 10000; i++) {
  add(i, i + 1); // 항상 number → 최적화 유지
}

// 타입이 섞이면 최적화가 해제(Deoptimization)된다
add(1, 2);     // number
add('a', 'b'); // string → 최적화 해제

// -------------------------------------------
// 런타임 환경 — setTimeout은 엔진이 아니다
// -------------------------------------------

console.log('1'); // 콜 스택에서 즉시 실행

setTimeout(() => {
  console.log('2'); // Web API → 콜백 큐 → 이벤트 루프가 실행
}, 0);

console.log('3'); // 콜 스택에서 즉시 실행

// 출력 순서: 1 → 3 → 2
// setTimeout(fn, 0)이어도 콜백은 항상 나중에 실행된다

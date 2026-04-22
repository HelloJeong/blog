// 02. 실행 컨텍스트와 콜 스택
// 블로그: ../javascript-core/02-execution-context.md

// =============================================
// 1. 호이스팅 — var vs let/const
// =============================================

console.log(a); // undefined
// console.log(b); // ReferenceError: Cannot access 'b' before initialization

var a = 1;
let b = 2;

// =============================================
// 2. 함수 선언문 vs 함수 표현식 호이스팅
// =============================================

hello(); // "hello"
// bye(); // TypeError: bye is not a function

function hello() {
  console.log("hello");
}

var bye = function () {
  console.log("bye");
};

// =============================================
// 3. 콜 스택 흐름 확인
// =============================================

function first() {
  console.log("first 시작");
  second();
  console.log("first 끝");
}

function second() {
  console.log("second 시작");
  third();
  console.log("second 끝");
}

function third() {
  console.log("third");
}

first();
// 출력:
// first 시작
// second 시작
// third
// second 끝
// first 끝

// =============================================
// 4. TDZ (Temporal Dead Zone)
// =============================================

const outerName = "outer";

function greet() {
  // console.log(innerName); // ReferenceError (TDZ)
  const innerName = "inner";
  console.log(innerName); // "inner"
}

greet();

// =============================================
// 5. 스택 오버플로우
// =============================================

// function loop() {
//   loop();
// }
// loop(); // RangeError: Maximum call stack size exceeded

function countdown(n) {
  if (n <= 0) return;
  console.log(n);
  countdown(n - 1);
}

countdown(5); // 출력: 5 → 4 → 3 → 2 → 1

// =============================================
// 6. 스택 트레이스 확인
// =============================================

function fnA() {
  fnB();
}
function fnB() {
  fnC();
}
function fnC() {
  throw new Error("문제 발생!");
}

try {
  fnA();
} catch (e) {
  console.error(e.stack);
}

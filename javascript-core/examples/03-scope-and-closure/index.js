// 03. 스코프와 클로저
// 블로그: ../javascript-core/03-scope-and-closure.md

// =============================================
// 1. 스코프 체인 — 안쪽에서 바깥쪽으로 탐색한다
// =============================================

const globalName = "global";

function outer() {
  const outerName = "outer";

  function inner() {
    const innerName = "inner";
    console.log(innerName); // "inner" — 자기 스코프
    console.log(outerName); // "outer" — 한 단계 바깥
    console.log(globalName); // "global" — 최상단까지 올라간다
  }

  inner();
}

outer();

// =============================================
// 2. 렉시컬 스코프 — 정의된 곳 기준이지 호출된 곳이 아니다
// =============================================

const x = 10;

function printX() {
  console.log(x); // 10 — 정의 시점의 바깥 스코프를 본다
}

function run() {
  const x = 999;
  printX(); // 999가 아니라 10
}

run();

// =============================================
// 3. 블록 스코프 — let / const / 함수 선언은 블록에 갇힌다
// =============================================

if (true) {
  var v = "var";
  let l = "let";
  const c = "const";
}

console.log(v); // "var" — 블록 밖에서도 접근 가능
// console.log(l); // ReferenceError
// console.log(c); // ReferenceError

// =============================================
// 4. 클로저 — 함수가 자기가 태어난 환경을 기억한다
// =============================================

function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3

const counter2 = makeCounter(); // 별개의 환경
console.log(counter2()); // 1

// =============================================
// 5. 데이터 은닉 — private 변수 흉내내기
// =============================================

function createAccount(initial) {
  let balance = initial;
  return {
    deposit(amount) {
      balance += amount;
    },
    withdraw(amount) {
      if (amount > balance) throw new Error("잔액 부족");
      balance -= amount;
    },
    getBalance() {
      return balance;
    },
  };
}

const account = createAccount(1000);
account.deposit(500);
account.withdraw(300);
console.log(account.getBalance()); // 1200
// account.balance 로는 접근 불가 — 클로저 안에 숨어 있다

// =============================================
// 6. 흔한 실수 — var + 반복문 + setTimeout
// =============================================

// ❌ var는 함수 스코프라 i가 공유된다
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log("var:", i), 10);
}
// 출력: var: 3, var: 3, var: 3

// ✅ let은 블록 스코프라 반복마다 새 바인딩
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log("let:", j), 20);
}
// 출력: let: 0, let: 1, let: 2

// =============================================
// 7. 커링 — 클로저의 실용 패턴
// =============================================

function multiply(a) {
  return function (b) {
    return a * b;
  };
}

const double = multiply(2);
const triple = multiply(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15

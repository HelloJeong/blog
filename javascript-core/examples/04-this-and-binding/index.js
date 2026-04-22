// 04. this와 바인딩
// 블로그: ../../04-this-and-binding.md
// 실행: node javascript-core/examples/04-this-and-binding/index.js

"use strict";

// === 1. 기본 바인딩 (strict 모드에서는 undefined) ===
function showThis() {
  return this;
}
console.log("1. 기본 바인딩:", showThis()); // undefined

// === 2. 암시적 바인딩 — 점(.) 앞 객체가 this ===
const user = {
  name: "Jeong",
  greet() {
    return `Hi, ${this.name}`;
  },
};
console.log("2. user.greet():", user.greet()); // Hi, Jeong

// 떼어내서 호출하면 this 연결이 끊긴다
const detached = user.greet;
try {
  detached();
} catch (e) {
  console.log("2. 떼어낸 호출 에러:", e.message);
}

// === 3. 명시적 바인딩 — call / apply / bind ===
function introduce(greeting) {
  return `${greeting}, ${this.name}`;
}
console.log("3. call :", introduce.call(user, "Hello"));
console.log("3. apply:", introduce.apply(user, ["Hi"]));
console.log("3. bind :", introduce.bind(user)("Hey"));

// bind로 부분 적용 — this는 null, 앞 인자만 고정
function log(level, message) {
  return `[${level}] ${message}`;
}
const error = log.bind(null, "ERROR");
console.log("3. 부분 적용:", error("파일 없음"));

// === 4. new 바인딩 — 새 객체가 this가 된다 ===
function User(name) {
  this.name = name;
}
const u = new User("Jeong");
console.log("4. new:", u.name); // Jeong

// === 5. 화살표 함수 — 렉시컬 this ===
const timer = {
  seconds: 10,
  tick() {
    const arrow = () => this.seconds; // tick의 this(= timer)를 그대로 캡처
    return arrow();
  },
};
console.log("5. 렉시컬 this:", timer.tick()); // 10

// call로도 화살표의 this는 바뀌지 않는다
// CommonJS 모듈 최상단의 this는 module.exports (= {}), ESM이면 undefined
const getThis = () => this;
console.log("5. arrow.call 무시:", getThis.call({ name: "X" })); // 바깥 this 그대로

// === 흔한 실수: 클래스 메서드를 떼어내면 깨진다 ===
class Counter {
  count = 0;
  increment() {
    this.count += 1;
  }
  incrementArrow = () => {
    this.count += 1;
  };
}

const c = new Counter();

const plain = c.increment;
try {
  plain(); // this === undefined → this.count에서 터진다
} catch (e) {
  console.log("실수. plain 호출 에러:", e.message);
}

// 해결 1 — bind
const bound = c.increment.bind(c);
bound();
console.log("해결 1. bind 이후 count:", c.count); // 1

// 해결 2 — 화살표 메서드 (클래스 필드)
const arrow = c.incrementArrow;
arrow();
console.log("해결 2. 화살표 이후 count:", c.count); // 2

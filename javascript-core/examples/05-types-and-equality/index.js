// 05. 데이터 타입과 동등 비교
// 블로그: ../../05-types-and-equality.md
// 실행: node javascript-core/examples/05-types-and-equality/index.js

"use strict";

// === 1. 원시 타입 7가지 + 객체 타입 ===
console.log("--- 1. typeof 결과 ---");
console.log("string :", typeof "hello"); // "string"
console.log("number :", typeof 42); // "number"
console.log("boolean:", typeof true); // "boolean"
console.log("undef  :", typeof undefined); // "undefined"
console.log("symbol :", typeof Symbol()); // "symbol"
console.log("bigint :", typeof 1n); // "bigint"
console.log("null   :", typeof null); // "object" ⚠ 호환성 버그
console.log("object :", typeof {}); // "object"
console.log("array  :", typeof []); // "object"
console.log("func   :", typeof function () {}); // "function"

// === 2. 원시값 vs 객체 — 저장 방식의 차이 ===
console.log("\n--- 2. 참조 동등 ---");
const a = { x: 1 };
const b = { x: 1 };
const c = a;
console.log("a === b (다른 객체):", a === b); // false
console.log("a === c (같은 참조):", a === c); // true

// === 3. === vs ==  ===
console.log("\n--- 3. 강제 변환의 함정 ---");
console.log('0 == ""    :', 0 == ""); // true  ("" → 0)
console.log('0 == "0"   :', 0 == "0"); // true  ("0" → 0)
console.log('"" == "0"  :', "" == "0"); // false (둘 다 string)
console.log('false == "0":', false == "0"); // true  (둘 다 number 0으로)
console.log("[] == false:", [] == false); // true  ([] → "" → 0, false → 0)
console.log("null == undefined:", null == undefined); // true
console.log("null == 0  :", null == 0); // false (null은 undefined와만 같다)

// === 4. NaN — 자기 자신과도 같지 않다 ===
console.log("\n--- 4. NaN 비교 ---");
console.log("NaN === NaN     :", NaN === NaN); // false
console.log("NaN == NaN      :", NaN == NaN); // false
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true
console.log("Object.is(NaN,NaN):", Object.is(NaN, NaN)); // true

// 전역 isNaN은 강제 변환 후 검사 → 함정
console.log('isNaN("hello")        :', isNaN("hello")); // true ⚠
console.log('Number.isNaN("hello") :', Number.isNaN("hello")); // false (의도대로)

// === 5. Object.is — ===에서 NaN과 ±0만 다르게 처리 ===
console.log("\n--- 5. Object.is의 차이 ---");
console.log("+0 === -0         :", +0 === -0); // true
console.log("Object.is(+0, -0) :", Object.is(+0, -0)); // false
console.log("Object.is(1, 1)   :", Object.is(1, 1)); // true (그 외엔 ===와 동일)

// === 6. 안전한 타입 검사 헬퍼 ===
console.log("\n--- 6. 타입 검사 헬퍼 ---");
const isString = (v) => typeof v === "string";
const isNumber = (v) => typeof v === "number" && !Number.isNaN(v);
const isNil = (v) => v === null || v === undefined;
const isObject = (v) =>
  v !== null && typeof v === "object" && !Array.isArray(v);

console.log("isNumber(NaN)  :", isNumber(NaN)); // false (NaN을 거른다)
console.log("isNumber(42)   :", isNumber(42)); // true
console.log("isNil(null)    :", isNil(null)); // true
console.log("isNil(undefined):", isNil(undefined)); // true
console.log("isNil(0)       :", isNil(0)); // false
console.log("isObject([])   :", isObject([])); // false
console.log("isObject({})   :", isObject({})); // true

// === 7. 객체 비교 — 내용이 같은가? ===
console.log("\n--- 7. 객체 deep equality ---");
const x = { a: 1, b: { c: 2 } };
const y = { a: 1, b: { c: 2 } };
console.log("x === y          :", x === y); // false (다른 참조)
console.log(
  "JSON 비교        :",
  JSON.stringify(x) === JSON.stringify(y),
); // true (단, 한계 있음)

// JSON 직렬화의 타입 손실
const data = {
  name: "Jeong",
  joined: new Date("2026-05-06"),
  greet: () => "hi",
  meta: undefined,
};
console.log("JSON 직렬화 결과:", JSON.stringify(data));
// joined는 문자열, greet/meta는 사라진다

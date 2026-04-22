# 02. 실행 컨텍스트와 콜 스택

> _Javascript Core — AI를 잘 다루려면 내가 잘 알아야한다_

> [참고코드](./examples/02-execution-context/index.js) | [시각화](./examples/02-execution-context/visualization.html)

---

## 핵심 개념

실행 컨텍스트(Execution Context)는 JS 코드가 실행되는 환경 정보를 담은 객체입니다.

변수, 함수 선언, `this`, 스코프 체인 등 코드를 실행하는 데 필요한 모든 정보가 여기에 들어갑니다. JS 엔진은 코드를 실행할 때 항상 실행 컨텍스트 안에서 동작합니다.

실행 컨텍스트는 3가지 종류가 있습니다.

| 종류                       | 생성 시점                    |
| -------------------------- | ---------------------------- |
| Global Execution Context   | 스크립트가 처음 실행될 때    |
| Function Execution Context | 함수가 호출될 때마다         |
| Eval Execution Context     | `eval()` 호출 시 (사용 지양) |

**콜 스택(Call Stack)** 은 이 실행 컨텍스트들을 쌓아두는 자료구조입니다. LIFO(Last In, First Out) 방식으로 동작하며, 현재 실행 중인 컨텍스트가 항상 스택의 최상단에 위치합니다.

> **eval() 사용을 지양해야하는 이유**
>
> - `보안 취약점 (Security Risk)`: 외부로부터 입력받은 문자열을 eval()로 실행할 경우, 악의적인 코드(Injection attack)가 실행되어 시스템이 위험해질 수 있습니다.
> - `성능 저하 (Performance Issue)`: 자바스크립트 엔진은 코드를 컴파일하여 최적화하는데, eval()은 런타임에 코드를 생성하므로 이러한 최적화가 불가능해 실행 속도가 느려집니다.
> - `디버깅의 어려움 (Debugging)`: eval() 내에서 실행되는 코드는 소스 파일에 나타나지 않아 디버깅과 에러 추적이 어렵습니다.
> - `스코프 문제 (Scope Issue)`: eval()은 실행 위치의 지역 변수에 접근하거나 원치 않게 변수 범위를 변경하여 의도치 않은 동작을 유발할 수 있습니다

---

## 동작 원리

실행 컨텍스트는 **생성 단계(Creation Phase)** 와 **실행 단계(Execution Phase)**, 2단계로 나뉩니다.

```
실행 컨텍스트 라이프사이클

1. 생성 단계 (Creation Phase)
   ├── LexicalEnvironment 생성
   │   ├── 환경 레코드 (Environment Record) ← let, const, 함수 선언
   │   └── 외부 환경 참조 (Outer Reference) ← 스코프 체인
   ├── VariableEnvironment 생성
   │   └── 환경 레코드 ← var 선언
   └── this 바인딩 결정

2. 실행 단계 (Execution Phase)
   └── 코드를 한 줄씩 실행하며 변수에 값을 할당
```

**1. 생성 단계 — 호이스팅이 일어나는 지점**

코드를 실행하기 전에, 엔진은 먼저 해당 스코프의 선언들을 훑습니다.

- `var` → `undefined`로 초기화
- `let`, `const` → 선언만 등록, 초기화하지 않음 (TDZ)
- `function` 선언문 → 함수 전체가 메모리에 올라감

```javascript
console.log(a); // undefined
console.log(b); // ReferenceError: Cannot access 'b' before initialization

var a = 1;
let b = 2;
```

**생성 단계에서 선언이 먼저 처리**되는 것을 호이스팅(Hoisting)이라고 합니다.

**2. 실행 단계 — 값 할당과 코드 실행**

생성 단계가 끝나면 코드를 위에서 아래로 실행하면서 변수에 실제 값을 할당합니다.

```javascript
var x = 10;
// 생성 단계: x → undefined
// 실행 단계: x → 10
```

---

## 코드 예제

콜 스택에 실행 컨텍스트가 쌓이고 빠지는 과정을 코드로 확인해 보겠습니다.

```javascript
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
```

### 콜스택에 쌓이는 모습

<iframe src="https://codesandbox.io/embed/2dm4rl?view=preview&module=%2Findex.html&hidenavigation=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="execution-context-viewer"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

함수 선언문과 함수 표현식의 호이스팅 차이도 중요합니다.

```javascript
// ✅ 함수 선언문 — 생성 단계에서 함수 전체가 올라간다
hello(); // "hello"

function hello() {
  console.log("hello");
}

// ❌ 함수 표현식 — 변수만 호이스팅되고 함수는 할당 전이다
bye(); // TypeError: bye is not a function

var bye = function () {
  console.log("bye");
};
```

---

## 흔한 실수

**TDZ(Temporal Dead Zone)를 모르고 `let`/`const`를 사용하는 경우**

`let`과 `const`도 호이스팅됩니다. 다만 <u>초기화 전까지 접근할 수 없는 구간</u>, 즉 **TDZ**가 존재합니다.

```javascript
// ❌ TDZ에 의한 에러
const name = "outer";

function greet() {
  console.log(name); // ReferenceError
  const name = "inner";
}

greet();
```

`greet` 함수의 실행 컨텍스트가 생성될 때 내부의 `name`이 먼저 등록됩니다. 외부 `name`이 아니라 아직 초기화되지 않은 내부 `name`을 참조하기 때문에 에러가 발생합니다.

```javascript
// ✅ 변수 선언을 사용 전에 배치
const name = "outer";

function greet() {
  const localName = "inner";
  console.log(localName); // "inner"
}

greet();
```

**스택 오버플로우(Stack Overflow)**

콜 스택에는 크기 제한이 있습니다. 종료 조건 없는 재귀 호출은 스택을 초과시킵니다.

```javascript
// ❌ 종료 조건이 없는 재귀
function loop() {
  loop();
}

loop(); // RangeError: Maximum call stack size exceeded
```

```javascript
// ✅ 종료 조건을 반드시 포함
function countdown(n) {
  if (n <= 0) return;
  console.log(n);
  countdown(n - 1);
}

countdown(5); // 출력: 5 → 4 → 3 → 2 → 1
```

---

## 실무 연결

**에러 스택 트레이스 읽기**

실무에서 에러가 발생하면 콜 스택 정보가 스택 트레이스로 출력됩니다. 이 트레이스가 바로 에러 발생 시점의 콜 스택 상태입니다.

```javascript
function a() {
  b();
}
function b() {
  c();
}
function c() {
  throw new Error("문제 발생!");
}

a();
// Error: 문제 발생!
//     at c (index.js:8)
//     at b (index.js:5)
//     at a (index.js:2)
//     at index.js:11
```

스택 트레이스는 **아래에서 위로** 호출 순서를 보여줍니다. 가장 위에 있는 함수가 에러가 실제로 발생한 지점이고, 아래로 갈수록 호출한 쪽입니다.

> NestJS나 Express에서 에러 로그를 볼 때도 같은 원리입니다. 스택 트레이스의 최상단이 원인, 하단이 진입점입니다.

**React와 실행 컨텍스트**

React 컴포넌트도 결국 함수입니다. 컴포넌트가 렌더링될 때마다 해당 함수의 실행 컨텍스트가 생성됩니다.

```javascript
function Counter() {
  const [count, setCount] = useState(0);
  // 이 함수가 호출될 때마다 새로운 실행 컨텍스트가 생성된다
  // count는 해당 컨텍스트의 LexicalEnvironment에 저장된다
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

매 렌더링마다 `count`가 새로운 값을 가지는 이유가 여기에 있습니다. 렌더링할 때마다 새로운 실행 컨텍스트가 생성되고, 그 안에서 `count`는 해당 시점의 값으로 고정됩니다. 이것이 클로저(Closure)와 연결되는 부분이며, 다음 클로저 파트에서 자세히 확인해보겠습니다.

---

## 정리

- **실행 컨텍스트**는 코드 실행에 필요한 환경 정보(변수, 스코프, this)를 담은 객체다
- 실행 컨텍스트는 **생성 단계**(선언 처리)와 **실행 단계**(값 할당)로 나뉜다
- **호이스팅**은 코드가 올라가는 것이 아니라, 생성 단계에서 선언이 먼저 처리되는 현상이다
- **콜 스택**은 실행 컨텍스트를 LIFO 방식으로 관리하며, 스택 트레이스의 기반이 된다
- `let`/`const`도 호이스팅되지만 **TDZ** 때문에 선언 전 접근 시 에러가 발생한다

<a href="https://github.com/hellojeong/blog" target="_blank" rel="noopener noreferrer">게시글 모음 바로가기</a>

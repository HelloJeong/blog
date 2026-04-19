# 03. 스코프와 클로저

> _Javascript Core — AI를 잘 다루려면 내가 잘 알아야한다_

> [참고코드](../examples/03-scope-and-closure/index.js) | [시각화](../examples/03-scope-and-closure/visualization.html)

---

## 핵심 개념

**스코프(Scope)** 는 식별자(변수·함수 이름)가 유효한 범위입니다.

JS 엔진은 어떤 이름을 만났을 때, **지금 위치에서 그 이름이 어디까지 보이는가**를 기준으로 값을 찾습니다. 이 범위가 바로 스코프입니다.

스코프는 3가지로 나뉩니다.

| 종류                  | 생성 단위                 | 예시                        |
| --------------------- | ------------------------- | --------------------------- |
| Global Scope (전역)   | 스크립트 전체             | 파일 최상단 선언            |
| Function Scope (함수) | 함수 하나                 | `var`, 함수 내부 선언       |
| Block Scope (블록)    | `{}` (if, for, 블록문 등) | `let`, `const`, 함수 선언문 |

**클로저(Closure)** 는 함수가 자기가 **정의된 시점의 스코프를 기억**하는 현상입니다.

함수가 외부 스코프의 변수를 참조하고 있으면, 그 함수가 살아 있는 동안 외부 스코프도 함께 살아남습니다. 이것은 앞서 정리한 LexicalEnvironment와 외부 환경 참조(Outer Reference)가 어떻게 동작하는지 이해하면 자연스럽게 따라옵니다.

> 면접에서 자주 나오는 질문입니다.
>
> "클로저란 무엇인가요?"
> → "함수가 자기가 선언된 렉시컬 스코프를 기억해서, 바깥 함수가 종료된 뒤에도 그 스코프의 변수에 접근할 수 있는 현상입니다."

---

## 동작 원리

스코프와 클로저의 뿌리는 02편에서 본 **실행 컨텍스트의 LexicalEnvironment** 입니다.

```
함수 실행 컨텍스트
└── LexicalEnvironment
    ├── 환경 레코드 (Environment Record)  ← 이 스코프의 식별자들
    └── 외부 환경 참조 (Outer Reference)   ← 바깥 스코프로 연결
```

### 스코프 체인은 이 Outer Reference를 따라가는 것

식별자 탐색은 **안쪽 스코프 → 바깥 스코프** 방향으로 진행됩니다.

```javascript
const a = 1;

function outer() {
  const b = 2;
  function inner() {
    const c = 3;
    console.log(a, b, c); // 1 2 3
  }
  inner();
}

outer();
```

`inner` 안에서 `a`를 찾을 때 엔진은 이렇게 움직입니다.

1. `inner`의 환경 레코드에서 `a`를 찾는다 → 없음
2. Outer Reference를 따라 `outer`의 환경 레코드에서 찾는다 → 없음
3. 또 Outer Reference를 따라 전역에서 찾는다 → 찾음(1)

이 경로가 **스코프 체인(Scope Chain)** 입니다.

### 렉시컬 스코프 — 호출된 곳이 아니라 정의된 곳 기준

자바스크립트는 **렉시컬(Lexical) 스코핑**을 채택합니다. Outer Reference가 **함수가 정의된 위치**에 따라 결정된다는 뜻입니다.

```javascript
const x = 10;

function printX() {
  console.log(x); // 10
}

function run() {
  const x = 999;
  printX(); // 999가 아니라 10
}

run();
```

`printX`는 전역에서 정의되었기 때문에, 어디서 호출되든 Outer Reference는 전역입니다. `run` 안에서 호출해도 `run`의 스코프를 보지 않습니다.

사실 대부분의 모던 언어가 같은 규칙을 따릅니다. Java로 똑같은 구조를 짜봐도 결과는 동일합니다.

```java
class Scope {
  static int x = 10;

  static void printX() {
    System.out.println(x); // 출력: 10
  }

  static void run() {
    int x = 999; // 지역 변수
    printX(); // 999가 아니라 10
  }
}
```

Java 역시 렉시컬 스코핑을 쓰기 때문에 `printX`는 **정의된 위치의 `x`**(= 10)를 참조합니다. 문법이 달라도 스코프의 본질은 같다는 걸 확인할 수 있습니다.

### 클로저가 만들어지는 지점

함수는 보통 실행이 끝나면 실행 컨텍스트가 스택에서 빠지고 LexicalEnvironment도 **가비지 컬렉션(GC, Garbage Collection)** 대상이 됩니다. 하지만 **내부 함수가 그 환경을 참조하고 있으면** 외부 함수가 끝나도 GC되지 않고 살아남습니다.

```javascript
function makeCounter() {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
}

const counter = makeCounter(); // makeCounter 종료
console.log(counter()); // 1 — count는 아직 살아 있다
console.log(counter()); // 2
```

`makeCounter`의 실행 컨텍스트는 이미 스택에서 빠졌지만, 반환된 함수가 `count`를 참조하므로 그 환경은 메모리에 남습니다. **이게 클로저입니다.**

### 환경이 살아남는 모습

<iframe src="https://codesandbox.io/embed/9f3t95?view=preview&module=%2Findex.html&hidenavigation=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="scope-closure-viewer"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## 코드 예제

클로저가 실무에서 어떻게 활용되는지 대표적인 두 가지 패턴으로 살펴보겠습니다.

### 클로저로 private 변수 만들기

JS에는 전통적으로 `private` 키워드가 없었습니다. 클로저는 이 공백을 오래도록 메워온 패턴입니다.

> ES2020에서 `#`이라는 접두사로 private field를 만들 수 있게 됐습니다.

```javascript
function createAccount(initial) {
  let balance = initial; // 외부에서 접근 불가

  return {
    deposit: (amount) => (balance += amount),
    withdraw: (amount) => {
      if (amount > balance) throw new Error("잔액 부족");
      balance -= amount;
    },
    getBalance: () => balance,
  };
}

const account = createAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
// account.balance → undefined (접근 불가)
```

`balance`는 `createAccount`의 지역 변수라 외부에서 직접 읽고 쓸 수 없습니다. 오직 반환된 메서드들을 통해서만 조작할 수 있습니다.

### 커링 — 클로저를 활용한 부분 적용

**커링(Currying)** 은 여러 인자를 한꺼번에 받는 함수를 **인자를 하나씩 나눠 받는 함수의 체인**으로 바꾸는 기법입니다. 이름은 수학자 Haskell Curry에서 왔습니다.

```javascript
// 일반 함수 — 인자를 한꺼번에 받는다
multiply(2, 5); // 10

// 커링된 함수 — 인자를 하나씩 받는다
multiply(2)(5); // 10
```

클로저 덕분에 **첫 번째 인자만 먼저 "고정"시킨 새 함수**를 만들어 재사용할 수 있습니다.

```javascript
function multiply(a) {
  return function (b) {
    return a * b; // a는 바깥 함수의 스코프에서 온다
  };
}

const double = multiply(2); // a를 2로 고정한 함수를 반환한다
const triple = multiply(3); // a를 3으로 고정한 함수를 반환한다

console.log(double(5)); // 10
console.log(triple(5)); // 15
```

`double`과 `triple`은 각각 자기만의 `a`를 기억하는 독립된 클로저입니다. 이처럼 인자 일부만 미리 채워 새 함수를 만드는 패턴을 **부분 적용(Partial Application)** 이라고 부릅니다.

---

## 흔한 실수

클로저의 동작 방식을 정확히 이해하지 못하면 자주 빠지는 함정 두 가지를 살펴보겠습니다.

### var + 반복문 + 비동기의 클래식한 함정

```javascript
// ❌ var는 함수 스코프라 i가 반복문 전체에서 공유된다
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 10);
}
// 출력: 3, 3, 3
```

`setTimeout`이 실행될 때쯤이면 반복문은 이미 끝나 있고 `i`는 `3`입니다. 모든 콜백이 **같은 `i`를 공유**하기 때문입니다.

```javascript
// ✅ let은 블록 스코프라 반복마다 새 바인딩이 생긴다
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 10);
}
// 출력: 0, 1, 2
```

`let`은 반복마다 **새로운 블록 스코프**를 만들어 각 콜백이 자기만의 `j`를 캡처합니다. 이는 클로저의 동작 방식과 정확히 맞물립니다.

### 의도치 않은 메모리 유지

클로저는 **바깥 스코프를 통째로** 들고 있는 게 아니라, **내부 함수가 코드 안에서 실제로 이름을 언급한 변수**만 살려둡니다. 그래서 내부에서 어떤 식별자를 쓰느냐에 따라 살아남는 메모리 양이 달라집니다.

```javascript
// ❌ 내부 함수가 bigData를 참조 → 객체 전체가 살아남는다
function attachHandler(bigData) {
  return function () {
    console.log(bigData.id); // "bigData"라는 이름이 등장한다
  };
}
```

내부 함수의 코드에 `bigData`라는 이름이 남아 있는 한, 엔진은 클로저 환경에 `bigData`를 계속 유지합니다. `id` 하나만 필요해도 부모 객체 전체가 GC되지 않습니다.

```javascript
// ✅ 값을 지역 변수로 꺼내 두면 bigData는 GC 대상이 된다
function attachHandler(bigData) {
  const id = bigData.id; // 이 줄이 끝나면 id에 값이 복사된다
  return function () {
    console.log(id); // "bigData"라는 이름이 더 이상 등장하지 않는다
  };
}
```

핵심은 **내부 함수의 코드 안에 `bigData`가 더는 등장하지 않는다**는 점입니다. `id`에는 값이 복사되어 독립적으로 존재하고, 클로저는 `id`만 살려두면 됩니다. 부모 객체 `bigData`는 `attachHandler`가 끝나는 순간 아무도 참조하지 않으므로 GC 대상이 됩니다.

> `id`가 문자열·숫자 같은 원시값이면 값이 그대로 복사되어 `bigData`와의 연결이 완전히 끊깁니다. 만약 `id`가 중첩 객체였다면 그 객체는 참조로 남지만, 그래도 부모 `bigData` 전체가 아니라 해당 하위 객체만 살아남습니다.

---

## 실무 연결

클로저는 React 훅부터 전통적인 모듈 패턴까지, 프런트엔드 개발의 여러 지점에 스며들어 있습니다.

### React의 `useState`는 클로저다

02편 마지막에 "매 렌더링마다 `count`가 새로운 값을 가지는 이유가 클로저와 연결된다"고 예고했습니다. 여기가 그 연결점입니다.

```javascript
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      console.log(count); // 이 시점의 count를 기억한다
    }, 1000);
    return () => clearInterval(id);
  }, []); // 의존성이 비어 있다

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

`useEffect`의 콜백은 **렌더링 시점의 `count`를 클로저로 캡처**합니다. 의존성 배열이 `[]`이면 최초 렌더의 `count`(= 0)만 계속 기억하게 됩니다. 이게 React 훅에서 자주 마주치는 "stale closure(낡은 클로저)" 버그의 정체입니다.

> 의존성 배열에 `count`를 넣으면 React가 매 렌더마다 effect를 다시 실행해 새 `count`를 캡처합니다. ESLint의 `react-hooks/exhaustive-deps` 규칙이 이걸 잡아주는 이유입니다.

### 모듈 패턴 — ES 모듈이 나오기 전의 은닉 기법

```javascript
const Counter = (function () {
  let count = 0;
  return {
    increment: () => ++count,
    get: () => count,
  };
})();

Counter.increment();
Counter.get(); // 1
```

IIFE(즉시 실행 함수)로 스코프를 만들고, 외부에는 공개할 API만 반환하는 패턴입니다. ES 모듈(`import`/`export`)이 나오기 전에는 이 방식이 표준에 가까웠고, 지금도 설정 객체나 싱글톤을 만들 때 종종 등장합니다.

---

## 정리

- **스코프**는 식별자가 유효한 범위이며, 전역/함수/블록 3가지로 나뉜다
- **스코프 체인**은 LexicalEnvironment의 Outer Reference를 따라 바깥 스코프로 탐색하는 경로다
- 자바스크립트는 **렉시컬 스코핑**을 쓰기 때문에 호출된 곳이 아니라 **정의된 곳**이 기준이다
- **클로저**는 함수가 자기가 태어난 스코프를 기억하는 것이며, 외부 함수가 종료된 뒤에도 그 변수에 접근할 수 있다
- 클로저는 **데이터 은닉**, **커링**, **React 훅의 상태 캡처** 등 실무의 수많은 패턴을 떠받친다

<a href="https://github.com/hellojeong/blog" target="_blank" rel="noopener noreferrer">게시글 모음 바로가기</a>

# 01. JavaScript 엔진과 런타임 환경

> _Javascript Core — AI를 잘 다루려면 내가 잘 알아야한다_

> [참고코드](../examples/01-engine-runtime/index.js)

---

## JavaScript 엔진이란?

JavaScript 엔진은 JS 코드를 읽고 실행하는 프로그램입니다.

브라우저나 Node.js에 내장되어 있으며, 우리가 작성한 `.js` 파일을 CPU가 이해할 수 있는 기계어로 변환해서 실행합니다.

대표적인 엔진은 다음과 같습니다.

| 엔진           | 사용처          |
| -------------- | --------------- |
| V8             | Chrome, Node.js |
| SpiderMonkey   | Firefox         |
| JavaScriptCore | Safari          |

실무에서 Node.js를 쓴다면 V8 엔진 위에서 코드가 돌아가고 있는 겁니다.

---

## V8 엔진의 동작 흐름 (파싱 → AST → 바이트코드 → 최적화)

V8이 코드를 실행하기까지의 흐름은 크게 4단계입니다.

```
소스 코드
   ↓ 파싱 (Parser)
AST (Abstract Syntax Tree, 추상 구문 트리)
   ↓ Ignition (인터프리터)
바이트코드 (Bytecode)
   ↓ TurboFan (최적화 컴파일러)
최적화된 기계어
```

**1. 파싱**

소스 코드를 읽어서 토큰으로 분리하고, AST를 생성합니다.

```javascript
const x = 1 + 2;
```

위 코드는 파싱을 거쳐 아래와 같은 트리 구조로 변환됩니다.

```
VariableDeclaration
└── VariableDeclarator
    ├── Identifier (x)
    └── BinaryExpression (+)
        ├── Literal (1)
        └── Literal (2)
```

> AST를 직접 확인하고 싶다면 [astexplorer.net](https://astexplorer.net)에서 볼 수 있습니다.

**2. Ignition — 바이트코드 생성**

AST를 V8의 인터프리터인 Ignition이 바이트코드로 변환합니다. 바이트코드는 기계어보다 추상적이지만, 소스 코드보다는 훨씬 빠르게 실행됩니다.

**3. TurboFan — 최적화**

Ignition이 실행하면서 "자주 호출되는 코드(Hot Code)"를 감지하면 TurboFan이 그 부분을 최적화된 기계어로 컴파일합니다. 이게 JIT 컴파일입니다.

---

## JIT(Just-In-Time) 컴파일이란?

전통적인 언어(C, Java 등)는 실행 전에 소스 코드를 전부 컴파일합니다. 반면 JS는 원래 인터프리터 방식이었습니다. 코드를 한 줄씩 읽으면서 바로 실행하는 방식이죠.

JIT는 두 방식의 중간입니다. **실행 중에** 자주 사용되는 코드만 골라서 컴파일합니다.

```javascript
function add(a, b) {
  return a + b;
}

// 처음 몇 번은 Ignition이 바이트코드로 실행
add(1, 2);
add(3, 4);

// 반복 호출이 감지되면 TurboFan이 기계어로 최적화
for (let i = 0; i < 10000; i++) {
  add(i, i + 1);
}
```

단, `타입이 바뀌면 최적화가 해제(Deoptimization)`됩니다.

```javascript
// ❌ 타입이 섞이면 최적화가 깨진다
add(1, 2); // number
add("a", "b"); // string → 최적화 해제

// ✅ 타입을 일관되게 유지하면 최적화가 유지된다
add(1, 2);
add(3, 4);
```

> TypeScript를 쓰는 이유 중 하나가 여기에 있습니다. 타입이 일관되면 V8이 더 적극적으로 최적화할 수 있습니다.

---

## 런타임 환경: 브라우저 vs Node.js

엔진은 JS 코드 자체를 실행하는 역할만 합니다. `setTimeout`, `fetch`, `fs.readFile` 같은 기능은 엔진이 아니라 **런타임 환경**이 제공합니다.

```
브라우저 런타임
├── V8 엔진           ← JS 실행
├── Web APIs          ← DOM, fetch, setTimeout, ...
├── 콜백 큐
└── 이벤트 루프

Node.js 런타임
├── V8 엔진           ← JS 실행
├── libuv             ← 파일 I/O, 네트워크, 타이머, ...
├── 콜백 큐
└── 이벤트 루프
```

`fetch` 함수는 Web API에만 있었지만 Node18 이후로 Node.js에도 기본 탑재된 함수가 됐습니다.

같은 V8 엔진을 쓰더라도, 브라우저에서는 `window.document`가 있고 Node.js에서는 `process`, `fs`가 있는 이유가 바로 런타임 환경이 다르기 때문입니다.

---

## Web API / libuv는 엔진의 일부가 아니다

면접에서 자주 나오는 질문입니다.

> "setTimeout은 어디서 실행되나요?"

정답은 **엔진이 아닌 런타임(Web API 또는 libuv)** 입니다.

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

console.log("3");

// 출력: 1 → 3 → 2
```

`setTimeout`의 콜백은 V8이 직접 처리하지 않습니다. Web API(브라우저) 또는 libuv(Node.js)가 타이머를 관리하고, 시간이 지나면 콜백을 큐에 넣습니다. 이벤트 루프가 콜 스택이 비어있을 때 그 콜백을 실행합니다.

---

## 정리

- **JS 엔진**은 코드를 파싱 → 바이트코드 → 기계어로 변환해 실행한다
- V8은 **Ignition**(인터프리터)과 **TurboFan**(최적화 컴파일러)으로 구성된다
- **JIT 컴파일**은 자주 실행되는 코드를 런타임에 최적화한다. 타입이 일관될수록 유리하다.(Typescript를 쓰는 이유 중 하나)
- `setTimeout`, `fetch`, `fs` 등은 엔진이 아닌 **런타임 환경**(Web API / libuv)이 제공한다
- 브라우저와 Node.js는 같은 V8을 쓰지만, 제공하는 **런타임 환경이 다르다**

[게시글 모음 바로가기](https://github.com/hellojeong/blog)

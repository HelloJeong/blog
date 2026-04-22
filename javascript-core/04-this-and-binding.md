# 04. this와 바인딩

> _Javascript Core — AI를 잘 다루려면 내가 잘 알아야한다_

> [참고코드](./examples/04-this-and-binding/index.js) | [시각화](./examples/04-this-and-binding/visualization.html)

---

## 핵심 개념

**`this`** 는 함수가 실행되는 순간 엔진이 자동으로 채워 넣는 특수한 참조입니다.

다른 언어의 `this`는 "이 클래스의 인스턴스"를 의미하는 경우가 많지만, 자바스크립트의 `this`는 **선언된 위치가 아니라 호출된 방식**에 따라 달라집니다. 같은 함수라도 어떻게 부르느냐에 따라 `this`가 가리키는 대상이 바뀝니다.

`this`가 결정되는 방식은 크게 5가지로 나눌 수 있습니다.

| 규칙             | 호출 형태                                         | `this`가 가리키는 것                      |
| ---------------- | ------------------------------------------------- | ----------------------------------------- |
| 기본(Default)    | `fn()`                                            | 전역 객체(비엄격) / `undefined`(엄격)     |
| 암시적(Implicit) | `obj.fn()`                                        | 점(`.`) 앞의 객체                         |
| 명시적(Explicit) | `fn.call(ctx)` · `fn.apply(ctx)` · `fn.bind(ctx)` | 첫 번째 인자로 넘긴 것                    |
| 생성자(`new`)    | `new Fn()`                                        | 새로 만들어진 인스턴스                    |
| 화살표 함수      | `() => {}`                                        | **정의된 위치의 `this`** (렉시컬, 고정됨) |

> 면접에서 자주 나오는 질문입니다.
>
> "자바스크립트의 `this`는 언제 결정되나요?"
> → "함수가 선언될 때가 아니라 **호출되는 시점**에 결정됩니다. 호출 형태에 따라 5가지 규칙 중 하나가 적용됩니다."

---

## 동작 원리

엔진은 함수 호출을 만나면 호출 형태를 보고 아래 경로를 타고 내려가면서 `this`를 결정합니다.

```
함수 호출 시
   ↓ 어떤 형태로 호출됐는가?
   ├── new Fn()         → 새 인스턴스
   ├── fn.call/apply    → 명시한 객체
   ├── obj.fn()         → 점 앞 객체
   ├── fn()             → 전역 또는 undefined
   └── () => ...        → 렉시컬 this (이미 정해져 있음)
```

### 기본 바인딩 — 그냥 호출하면 전역 또는 undefined

```javascript
function showThis() {
  console.log(this);
}

showThis();
// 비엄격: window (Node에서는 global)
// 엄격:   undefined
```

ES 모듈 파일과 ES6 클래스 본문은 기본적으로 엄격 모드입니다. 실무 코드에서 기본 바인딩된 `this`는 거의 대부분 `undefined`라고 봐도 됩니다.

### 암시적 바인딩 — 점(`.`) 앞의 객체가 this

```javascript
const user = {
  name: "Jeong",
  greet() {
    console.log(`Hi, ${this.name}`);
  },
};

user.greet(); // "Hi, Jeong" — this는 user
```

중요한 건 **호출 시점의 `.` 앞**입니다. 같은 함수라도 떼어내서 호출하면 this 연결이 사라집니다.

```javascript
const greet = user.greet;
greet(); // 엄격 모드에서 TypeError — this가 undefined
```

`greet` 변수에 들어간 건 함수 참조뿐이고, `user`와의 연결은 `user.greet()`라는 **호출 표현식에만** 존재합니다.

> 비엄격 모드에서는 `this`가 **전역 객체**(브라우저 `window`, Node `global`)가 됩니다. 에러가 나는 대신 `this.name`이 전역 `name` 속성을 읽는데, 브라우저의 `window.name`은 기본값이 빈 문자열이라 `"Hi, "`처럼 **에러도 없이 틀린 값**이 찍힙니다. 이런 **묵시적 실패(silent failure)**를 줄이려는 것이 엄격 모드가 기본이 된 이유 중 하나입니다.

### 명시적 바인딩 — call / apply / bind

`this`를 강제로 지정하고 싶을 때 씁니다.

```javascript
function introduce(greeting) {
  console.log(`${greeting}, ${this.name}`);
}

const user = { name: "Jeong" };

introduce.call(user, "Hello"); // "Hello, Jeong"
introduce.apply(user, ["Hi"]); // "Hi, Jeong"

const bound = introduce.bind(user);
bound("Hey"); // "Hey, Jeong"
```

- `call(ctx, arg1, arg2, …)` — this 지정 + 즉시 호출
- `apply(ctx, [args])` — this 지정 + 인자를 **배열**로 넘겨 즉시 호출
- `bind(ctx)` — this가 고정된 **새 함수**를 반환 (호출은 나중에)

### `new` 바인딩 — 새 객체를 만들고 this로 쓴다

`new`로 함수를 호출하면 엔진이 내부적으로 네 단계를 거칩니다.

1. 새로운 빈 객체를 만든다
2. 이 객체를 함수의 `this`로 바인딩한다
3. 함수 본문을 실행한다 (프로퍼티가 `this`에 채워짐)
4. 함수가 객체를 반환하지 않으면 새로 만든 객체를 반환한다

```javascript
function User(name) {
  this.name = name; // 3단계에서 새 객체에 할당된다
}

const u = new User("Jeong");
console.log(u.name); // "Jeong"
```

ES6 클래스의 `constructor`도 내부적으로는 이 규칙을 따릅니다.

### 화살표 함수 — this를 갖지 않는다

화살표 함수는 **자기만의 `this`가 없습니다.** `this`를 쓰면 정의된 위치에서 바깥 스코프의 `this`를 그대로 가져다 씁니다. 03편에서 본 렉시컬 스코프와 같은 원리입니다.

```javascript
const user = {
  name: "Jeong",
  greet() {
    const arrow = () => console.log(this.name);
    arrow(); // "Jeong" — greet의 this(= user)를 그대로 쓴다
  },
};

user.greet();
```

`arrow`는 자기 `this`가 없으니 바깥 `greet`의 `this`를 참조하고, `greet`은 `user.greet()`로 호출됐으니 `this`는 `user`입니다. 그래서 결과는 `"Jeong"`.

이 특성 때문에 `call`, `apply`, `bind`로도 화살표 함수의 `this`는 바꿀 수 없습니다.

```javascript
const arrow = () => console.log(this);
arrow.call({ name: "X" }); // 여전히 바깥 this — call이 무시된다
```

### 우선순위

여러 규칙이 충돌할 수 있는 상황에서는 다음 우선순위가 적용됩니다.

```
new  >  bind  >  call / apply  >  암시적(obj.fn)  >  기본(fn)
```

화살표 함수는 이 규칙들 바깥에 있습니다. 한 번 만들어지면 그 이후로는 바꿀 수 없습니다.

### 규칙을 직접 눌러보기

아래 시각화에서 10가지 호출 패턴 중 하나를 골라, 어떤 바인딩 규칙이 적용되고 `this`가 무엇이 되는지 분기를 따라가 보세요. 점 앞 객체와의 **연결이 끊어지는 순간**도 함께 확인할 수 있습니다.

<iframe src="https://codesandbox.io/embed/mwj933?view=preview&module=%2Findex.html&hidenavigation=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="this-binding-viewer"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## 코드 예제

`this` 바인딩을 실무에서 활용하는 대표적인 두 패턴을 보겠습니다.

### bind로 부분 적용 만들기

잠깐 03편 복습입니다. **커링(Currying)** 은 여러 인자를 한꺼번에 받는 함수를 **인자를 하나씩 받는 함수의 체인**(`fn(a)(b)`)으로 바꾸는 기법이고, 그중 **앞쪽 인자만 미리 채워 새 함수를 만드는 것**을 **부분 적용(Partial Application)** 이라고 부릅니다. 클로저가 바깥 스코프의 값을 계속 붙잡아 주기 때문에 가능했죠.

`bind`는 바로 이 부분 적용을 **내장으로 제공**하는 메서드입니다. 첫 인자로 `this`(불필요하면 `null`)를, 두 번째 인자부터는 **함수의 앞 인자부터 고정할 값**으로 사용됩니다.

```javascript
function log(level, message) {
  console.log(`[${level}] ${message}`);
}

const error = log.bind(null, "ERROR");
const warn = log.bind(null, "WARN");

error("파일을 찾을 수 없습니다"); // [ERROR] 파일을 찾을 수 없습니다
warn("캐시 적중률 낮음"); // [WARN] 캐시 적중률 낮음
```

`error("파일 없음")`을 호출하는 순간 내부에서는 **왼쪽부터 채워져** `log("ERROR", "파일 없음")`이 실행됩니다. `bind`의 두 번째 인자부터가 원본 함수의 앞 인자 자리에 **순서대로** 꽂힌다고 보면 됩니다.

```
log(level, message)        ← 원본 시그니처
     │       │
     ▼       ▼
log.bind(null, "ERROR")
         │     │
         │     └─ 첫 번째 파라미터(level)에 고정
         └─ this (이 함수는 this를 안 쓰니 null)

반환값 = 새 함수 error(message)   ← level은 이미 고정된 상태
```

왼쪽부터만 채울 수 있다는 점은 주의해야 합니다. `level`은 그대로 두고 `message`만 먼저 고정하고 싶다면 `bind` 하나로는 안 되고 래퍼 함수로 직접 돌려 받아야 합니다.

```javascript
// bind는 "왼쪽부터"만 가능하므로 이런 경우는 래퍼가 필요하다
const fixMessageOnly = (level) => log(level, "파일 없음");
```

### 메서드 내부 콜백은 화살표로

객체 메서드 안에서 다시 콜백을 만들 때, 콜백이 바깥 메서드의 `this`를 쓰고 싶다면 화살표 함수가 가장 간결합니다.

```javascript
const timer = {
  seconds: 0,
  start() {
    setInterval(() => {
      this.seconds += 1; // ✅ start의 this를 그대로 쓴다
      console.log(this.seconds);
    }, 1000);
  },
};

timer.start();
```

같은 코드를 일반 함수 콜백으로 바꾸면 `setInterval`이 전역에서 기본 바인딩으로 호출하기 때문에 `this.seconds`가 동작하지 않습니다.

---

## 흔한 실수

`this`가 호출 형태에 따라 결정된다는 성질 때문에, 메서드를 **떼어 내거나**, **콜백으로 넘기거나**, **엄격 모드 여부를 잘못 가정할 때** 쉽게 깨집니다.

### 메서드를 콜백으로 전달하면 this가 날아간다

```javascript
const user = {
  name: "Jeong",
  greet() {
    console.log(this.name);
  },
};

// ❌ setTimeout이 greet을 "기본 호출"로 부른다
setTimeout(user.greet, 100); // 출력: undefined (엄격이면 TypeError)

// ✅ 호출 시점에 user가 점 앞에 오도록 감싼다
setTimeout(() => user.greet(), 100); // 출력: "Jeong"

// ✅ 또는 bind로 this를 고정시킨다
setTimeout(user.greet.bind(user), 100); // 출력: "Jeong"
```

`setTimeout`은 받은 함수 참조를 시간이 지난 뒤 그냥 `fn()` 꼴로 호출합니다. 점 앞 객체 정보는 이미 날아간 상태입니다.

좀 더 일반화하면, 함수를 **변수에 담거나, 인자로 넘기거나, `return`으로 돌려주는 순간** `this` 연결은 끊어집니다. `user`와 함수의 연결은 오직 `user.greet()`라는 **호출 표현식 안에서만** 살아 있기 때문입니다. `setTimeout`은 그 "떨어뜨리는 순간"이 가장 자주 마주치는 대표 사례일 뿐이고, 같은 원리가 이벤트 핸들러·배열 메서드·Promise 체인 등 **콜백이 등장하는 모든 지점**에서 동일하게 발생합니다.

### 클래스 메서드도 예외가 아니다

```javascript
class Counter {
  count = 0;
  increment() {
    this.count += 1;
  }
}

const c = new Counter();
const fn = c.increment;
fn(); // ❌ TypeError: Cannot read properties of undefined (reading 'count')
```

클래스 본문은 엄격 모드라 기본 바인딩의 `this`가 `undefined`이고, 그래서 `this.count`가 즉시 터집니다.

```javascript
// ✅ 화살표 메서드(클래스 필드)로 선언하면 this가 고정된다
class Counter {
  count = 0;
  increment = () => {
    this.count += 1;
  };
}
```

화살표 함수는 정의 시점의 `this`(= 인스턴스)를 렉시컬로 캡처하므로, 메서드를 떼어 내도 바인딩이 유지됩니다.

### 엄격 모드 여부를 놓치면 디버깅이 꼬인다

```javascript
// 비엄격 — 브라우저 콘솔에 그대로 붙여 넣었을 때
function f() {
  return this;
}
f() === window; // true

// 엄격 — 모듈 파일, 클래스 본문, "use strict" 선언
function g() {
  "use strict";
  return this;
}
g() === undefined; // true
```

개발자 도구 콘솔은 보통 비엄격이고, 실제 소스 파일(`<script type="module">`, `.mjs`, 대부분의 번들러 출력)은 엄격입니다. "콘솔에서는 되는데 코드에서는 안 된다"의 원인이 여기에 숨어 있는 경우가 많습니다.

---

## 실무 연결

`this` 바인딩 규칙은 DOM, React, jQuery 같은 도구 곳곳에 그대로 얼굴을 내밉니다.

### React — 클래스 컴포넌트의 bind와 함수 컴포넌트의 해방

```javascript
// 클래스 컴포넌트 시절에는 메서드마다 바인딩이 필요했다
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this); // this 고정
  }
  handleClick() {
    console.log(this.props.label); // bind가 없으면 this가 undefined
  }
  render() {
    return <button onClick={this.handleClick}>...</button>;
  }
}
```

메서드를 `onClick` 핸들러로 넘기는 순간 점 앞 객체가 사라져 기본 바인딩이 됐기 때문입니다. 함수 컴포넌트와 훅으로 넘어오면서 이 문제는 사실상 사라졌습니다. 함수 컴포넌트에는 `this`가 없고, 상태는 클로저로 캡처합니다.

### addEventListener — 콜백의 this는 currentTarget

```javascript
button.addEventListener("click", function () {
  console.log(this); // this === button
});

button.addEventListener("click", () => {
  console.log(this); // this === 바깥 스코프의 this (보통 window 또는 undefined)
});
```

DOM 이벤트 핸들러는 **일반 함수로 등록하면 `currentTarget`을 `this`로 넘겨줍니다.** 화살표 함수를 쓰면 이 편의를 잃게 되므로, 그 안에서는 `e.currentTarget`을 대신 사용해야 합니다.

### jQuery의 `$(this)` — 같은 규칙이 만든 관용구

```javascript
$(".item").on("click", function () {
  $(this).toggleClass("active"); // this = 클릭된 DOM
});
```

jQuery가 제공하는 마법이 아니라, `addEventListener`와 똑같이 **일반 함수의 `this`가 호출 방식에 따라 결정된다**는 규칙이 그대로 드러난 결과입니다. 핸들러 안에서 화살표 함수를 쓰면 같은 이유로 `this`를 잃게 됩니다.

---

## 정리

- **`this`는 호출 시점에 결정**되는 특수 참조이며, 선언 위치나 스코프와는 별개다
- 바인딩 규칙은 **기본 / 암시적 / 명시적 / `new` / 화살표** 5가지이고, 우선순위는 `new > bind > call·apply > 암시적 > 기본`이다
- **화살표 함수**는 자기 `this`가 없어 **정의 위치의 바깥 `this`**를 쓰며, `call`·`bind`로도 바꿀 수 없다
- 메서드를 **떼어 내거나 콜백으로 넘기면 `this`가 깨진다** — `bind`, 래퍼 함수, 화살표 메서드로 해결한다
- React 클래스 컴포넌트의 `bind`, DOM 이벤트의 `this = currentTarget`, jQuery의 `$(this)`는 모두 같은 규칙에서 파생된 결과다

<a href="https://github.com/hellojeong/blog" target="_blank" rel="noopener noreferrer">게시글 모음 바로가기</a>

# 05. 데이터 타입과 동등 비교

> _Javascript Core — AI를 잘 다루려면 내가 잘 알아야한다_

> [참고코드](./examples/05-types-and-equality/index.js) | [시각화](./examples/05-types-and-equality/visualization.html)

---

## 핵심 개념

자바스크립트의 모든 값은 **8가지 타입** 중 하나입니다. 이 중 7개는 **원시 타입(Primitive)**, 나머지 하나가 **객체 타입(Object)** 입니다.

| 분류          | 타입                                                                   | 비고                            |
| ------------- | ---------------------------------------------------------------------- | ------------------------------- |
| 원시 타입 (7) | `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint` | 값 자체로 저장, 불변(immutable) |
| 객체 타입 (1) | `object` (배열, 함수, Date, 정규식 등 모든 비원시값)                   | 참조로 저장, 가변(mutable)      |

원시값과 객체는 **메모리에 저장되는 방식**부터 다릅니다. 이 차이가 그대로 **동등 비교(equality)** 의 차이로 이어집니다. 같은 `===`를 써도 원시값은 "값이 같은가"를 보고, 객체는 "**같은 참조인가**"를 봅니다.

자바스크립트의 동등 비교 연산자도 **3가지**가 있습니다.

| 연산자           | 이름              | 동작                                          |
| ---------------- | ----------------- | --------------------------------------------- |
| `==`             | 느슨한 동등       | 타입이 다르면 **강제 변환(coercion)** 후 비교 |
| `===`            | 엄격한 동등       | 타입까지 일치해야 `true`                      |
| `Object.is(a,b)` | 동일성(SameValue) | 거의 `===`와 같지만 `NaN`과 `±0` 처리만 다름  |

> 면접에서 자주 나오는 질문입니다.
>
> "`==`와 `===`의 차이는 무엇인가요?"
> → "`==`는 비교 전 타입을 강제로 맞추고(`coercion`), `===`는 타입이 다르면 그대로 `false`를 반환합니다. 강제 변환 규칙이 직관과 어긋나는 경우가 많아 실무에서는 `===`를 기본으로 씁니다."

---

## 동작 원리

### 원시값과 객체의 저장 방식

원시값은 **값 자체**가 변수에 들어갑니다. 객체는 변수에 **참조(주소)** 만 들어가고 실체는 힙(heap)에 따로 있습니다.

```
원시값                     객체
┌─────────┐               ┌─────────┐         ┌──────────────┐
│  a = 1  │               │  obj ───┼────────▶│ { x: 1 }     │
└─────────┘               └─────────┘         └──────────────┘
   변수가 값을 직접 가짐     변수는 주소만 가짐, 실체는 힙에
```

이 차이 때문에 같은 모양의 두 객체도 **서로 다른 참조**라면 같지 않습니다.

```javascript
const a = { x: 1 };
const b = { x: 1 };
const c = a;

a === b; // false — 서로 다른 객체(주소가 다르다)
a === c; // true  — c는 a와 같은 주소를 가리킨다
```

### typeof — 타입을 문자열로 돌려준다

`typeof`는 피연산자의 타입을 **문자열**로 반환하는 단항 연산자입니다.

| 값                      | `typeof` 결과 |
| ----------------------- | ------------- |
| `"hello"`               | `"string"`    |
| `42`, `NaN`, `Infinity` | `"number"`    |
| `true`                  | `"boolean"`   |
| `undefined`             | `"undefined"` |
| `Symbol()`              | `"symbol"`    |
| `1n`                    | `"bigint"`    |
| `null`                  | `"object"` ⚠  |
| `{}`, `[]`, `/re/`      | `"object"`    |
| `function() {}`         | `"function"`  |

두 가지가 직관과 어긋납니다.

- **`typeof null === "object"`** — 자바스크립트 초창기의 버그입니다. 표준에 박혀버려 지금까지 호환성 때문에 못 고치고 있습니다. `null` 검사는 `typeof`로 하지 말고 `value === null`로 직접 비교해야 합니다.
- **`typeof function() {} === "function"`** — 함수도 객체지만 `typeof`만 예외적으로 `"function"`을 돌려줍니다. 호출 가능한지 빠르게 확인할 때 유용합니다.

배열·날짜·정규식은 모두 `"object"`로 묶이므로 구분하려면 별도의 도구가 필요합니다.

```javascript
Array.isArray([]); // true
[] instanceof Array; // true
Object.prototype.toString.call([]); // "[object Array]"
```

### `===` — 엄격한 동등

같은 타입이면 값을 비교하고, 다른 타입이면 즉시 `false`입니다. 단, **두 가지 예외**가 있습니다.

```javascript
NaN === NaN; // false  ⚠ NaN은 자기 자신과도 같지 않다
+0 === -0; // true   ⚠ +0과 -0은 같다고 본다
```

`NaN`은 IEEE 754 부동소수점 표준이 "정의되지 않음"의 의미로 정한 값이라, 어떤 비교에서도 `false`를 돌려주도록 명세되어 있습니다.

### `==` — 느슨한 동등(타입 강제 변환)

`==`는 두 피연산자의 타입이 다르면 **한쪽을 변환해서** 비교합니다. 변환 규칙은 다음과 같이 단순화할 수 있습니다.

```
타입이 같다 → ===와 동일

타입이 다르다 ↓
  ├── null == undefined          → true (이 둘끼리만)
  ├── number ↔ string            → string을 number로
  ├── boolean ↔ ?                → boolean을 number로 (true→1, false→0)
  └── object ↔ primitive         → object를 ToPrimitive로 변환
```

이 규칙이 만들어 내는 결과는 종종 직관에 어긋납니다.

```javascript
0 == ""; // true  — "" → 0
0 == "0"; // true  — "0" → 0
"" == "0"; // false — 둘 다 string, 그대로 비교
false == "0"; // true  — false → 0, "0" → 0
null == undefined; // true
null == 0; // false — null은 undefined와만 같다고 본다
[] == false; // true  — [] → "" → 0, false → 0
```

이런 변환 규칙은 외울 가치가 거의 없습니다. **`===`를 기본**으로 쓰고, `null` 또는 `undefined` 둘 중 하나인지 확인할 때만 `value == null` 관용구를 의식적으로 사용합니다.

### `Object.is` — `===`의 두 예외만 바로잡은 버전

`Object.is(a, b)`는 `===`와 거의 동일하지만, 위에서 본 두 예외를 **반대로** 처리합니다.

```javascript
Object.is(NaN, NaN); // true   — ===와 다르다
Object.is(+0, -0); // false  — ===와 다르다
Object.is(1, 1); // true   — 그 외에는 ===와 같다
```

`NaN` 검사가 필요할 때 `Object.is(x, NaN)` 또는 `Number.isNaN(x)`를 쓰면 깔끔하게 처리됩니다.

### 강제 변환 단계를 직접 따라가기

아래 시각화에서 두 값을 골라, `==`가 어떤 분기를 타고 어떤 변환 단계를 거쳐 결과에 도달하는지 한 단계씩 펼쳐 보세요. 같은 두 값에 `===`와 `Object.is`를 적용했을 때 결과가 어디서 갈라지는지도 함께 확인할 수 있습니다.

<iframe src="https://codesandbox.io/embed/dd2lcj?view=preview&module=%2Findex.html&hidenavigation=1"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="types-and-equality-viewer"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## 코드 예제

타입과 동등 비교를 실무에서 안전하게 다루는 패턴 두 가지를 보겠습니다.

### 안전한 타입 검사 헬퍼

`typeof null === "object"`나 `typeof [] === "object"` 같은 함정을 피하려면 검사 도구를 분리해 두는 편이 안전합니다.

```javascript
const isString = (v) => typeof v === "string";
const isNumber = (v) => typeof v === "number" && !Number.isNaN(v); // NaN 제외
const isNil = (v) => v === null || v === undefined;
const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const isArray = Array.isArray;
const isFunction = (v) => typeof v === "function";

isNumber(NaN); // false — 의도대로 거른다
isNil(null); // true
isNil(undefined); // true
isObject([]); // false — 배열은 따로 본다
isObject({}); // true
```

`isNil`처럼 **`null`과 `undefined`를 한 번에 묶어 검사**하는 패턴은 자주 등장합니다. `value == null`(느슨한 비교)이 같은 동작을 하지만, 함수로 분리해 두면 의도가 더 또렷해집니다.

### NaN 검사는 Number.isNaN으로

전역 함수 `isNaN`은 **인자를 number로 강제 변환한 뒤** 검사하기 때문에, 숫자가 아닌 값에서도 `true`를 돌려줍니다.

```javascript
isNaN("hello"); // true  ⚠ "hello"를 number로 변환 → NaN → true
Number.isNaN("hello"); // false — 변환 없이 NaN인지만 확인
Number.isNaN(NaN); // true  — 의도대로
```

ES2015에 추가된 `Number.isNaN`은 강제 변환 없이 **값이 정확히 `NaN`인지**만 검사합니다. 일반 `isNaN`은 사실상 쓰지 않는 게 좋습니다.

---

## 흔한 실수

타입과 동등 비교는 **직관과 명세가 어긋나는 지점**이 가장 많은 영역입니다. 자주 마주치는 함정 세 가지를 정리합니다.

### 객체끼리 `===`로 "내용"을 비교하려는 시도

```javascript
const a = { x: 1 };
const b = { x: 1 };

// ❌ 같은 모양이지만 다른 객체 — 항상 false
a === b; // false

// ✅ 내용이 같은지 확인하려면 직접 비교하거나 라이브러리를 쓴다
JSON.stringify(a) === JSON.stringify(b); // true (단, 키 순서·undefined·함수 등 한계가 있음)
// 또는 lodash의 isEqual 같은 deep equality 함수
```

`===`는 객체에 대해서는 **참조 동등**(같은 주소인지)만 확인합니다. "내용이 같은가"는 별도의 비교 로직이 필요합니다.

> `JSON.stringify`로 비교하는 트릭은 간단한 객체에서는 동작하지만, 키 순서가 다르거나 `undefined`·함수·`Symbol` 같은 직렬화 불가 값이 끼면 결과가 어긋납니다. 실무에서는 보통 `lodash.isEqual`이나 `node:util`의 `isDeepStrictEqual`을 씁니다.

### `==`가 만드는 거짓 양성·거짓 음성

```javascript
// ❌ 빈 문자열이 0과 같다고 판정된다
if (count == "") { ... }   // count가 0이면 통과돼 버린다

// ✅ 의도가 분명한 비교를 쓴다
if (count === 0) { ... }
if (count === "") { ... }
```

`==`의 강제 변환은 **사용자 입력**(문자열로 들어오는 값)을 검사할 때 특히 위험합니다. `"0"`, `""`, `false`, `0`, `null`이 서로 같다고 판정되는 경우가 섞여 있어, 한 번이라도 잘못된 통과가 일어나면 디버깅이 까다롭습니다.

예외는 `value == null` 관용구뿐입니다. `null`과 `undefined`를 한 번에 거를 때 가장 짧고 의도가 명확합니다.

### `NaN`을 `===`나 `==`로 검사한다

```javascript
const result = Number("abc"); // NaN

// ❌ 어떤 비교 연산자로도 NaN은 자기 자신과 같지 않다
result === NaN; // false
result == NaN; // false

// ✅ 전용 함수를 쓴다
Number.isNaN(result); // true
Object.is(result, NaN); // true
```

`Number()`나 `parseInt()`로 변환을 시도한 결과를 검증할 때 자주 마주칩니다. "변환에 실패했나"를 체크하려면 비교 연산자가 아니라 `Number.isNaN`이 정답입니다.

---

## 실무 연결

### React — `Object.is`로 상태 변경을 판단한다

React의 `useState`는 **새 값과 이전 값이 다를 때만** 컴포넌트를 다시 렌더링합니다. 이 비교에 사용되는 게 정확히 `Object.is`입니다.

```javascript
const [user, setUser] = useState({ name: "Jeong" });

// ❌ 같은 객체에 프로퍼티만 바꾸면 React는 변경을 감지하지 못한다
user.name = "Kim";
setUser(user); // Object.is(prev, next) → true → 리렌더 안 됨

// ✅ 새 객체를 만들어 넘긴다
setUser({ ...user, name: "Kim" }); // 다른 참조 → 리렌더
```

`useEffect`·`useMemo`·`useCallback`의 의존성 배열도 같은 규칙으로 비교합니다. 매 렌더마다 새로 만들어진 객체·배열을 의존성에 넣으면 effect도 매 렌더 다시 실행됩니다. 그게 의도라면 문제없지만, "값은 그대로 같은 것 같은데 왜 effect가 자꾸 도나"의 원인은 대부분 여기서 시작됩니다. **참조 동등**의 사고방식이 React 훅 사용의 절반을 결정합니다.

> "왜 React에서 상태를 직접 수정하면 안 되나요?" → "React가 `Object.is`로 이전 상태와 새 상태를 비교하는데, 같은 객체를 수정하면 참조가 그대로라 변경을 감지하지 못합니다."

### JSON 직렬화 — 타입이 사라진다

```javascript
const data = {
  name: "Jeong",
  joined: new Date(),
  greet: () => "hi",
  id: 10n, // BigInt
  meta: undefined,
};

JSON.stringify(data);
// '{"name":"Jeong","joined":"2026-05-06T...","id":...}'
// → joined는 string으로, greet과 meta는 사라지고, BigInt는 TypeError를 던진다
```

JSON에는 `string`, `number`, `boolean`, `null`, `object`, `array`만 있습니다. `Date`는 ISO 문자열, `function`·`undefined`·`Symbol`은 통째로 사라지고, `BigInt`는 직렬화 자체가 막혀 있습니다. **API 응답을 받아 그대로 비교하면 타입이 어긋난 채 흘러가는 일**이 흔합니다.

### TypeScript — 정적으로 막을 수 있는 영역

여기서 본 함정 중 상당수는 **타입 검사기가 컴파일 시점에** 잡아낼 수 있는 종류입니다.

```typescript
function isAdult(age: number) {
  return age >= 18;
}

isAdult("20"); // ❌ Argument of type 'string' is not assignable to parameter of type 'number'
```

런타임에 일어나는 강제 변환 자체는 TS도 막지 못하지만, **그런 비교가 일어날 만한 경로**를 미리 차단해 버립니다. 자바스크립트의 동등 비교 규칙을 알아두는 이유 중 하나는 **타입 검사기가 왜 그렇게 짜여 있는지**를 이해하기 위해서이기도 합니다.

---

## 정리

- 자바스크립트 값은 **7개의 원시 타입과 객체 타입**으로 나뉘며, 원시는 값으로, 객체는 **참조**로 저장된다
- **`typeof null === "object"`** 는 명세에 박혀버린 호환성 버그이며, 배열·Date·정규식도 모두 `"object"`로 묶이므로 별도의 도구로 구분해야 한다
- **`==`** 는 강제 변환 규칙이 직관과 어긋나는 경우가 많아 **`===`를 기본**으로 쓰고, `value == null` 관용구만 예외로 둔다
- **`NaN`은 자기 자신과도 같지 않으며**, `Number.isNaN` 또는 `Object.is(x, NaN)`로 검사한다. **`Object.is`** 는 `===`에서 `NaN`과 `±0` 처리만 바로잡은 버전이다
- **객체 동등 비교는 참조 비교**다. React의 `useState`·의존성 배열도 `Object.is` 기반이므로, "새 참조를 만들어 넘긴다"가 곧 상태 변경의 의미가 된다

<a href="https://github.com/hellojeong/blog" target="_blank" rel="noopener noreferrer">게시글 모음 바로가기</a>

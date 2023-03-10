[원본 게시글로 바로가기](https://velog.io/@jeongyk92/React-Slider-%EA%B5%AC%ED%98%84)

최근 [포트폴리오](https://hellojeong.github.io/portfolio/)를 작성하면서 슬라이더를 직접 구현해보았다. 찾아보니 좌우 슬라이더는 참 많은데 상하로 움직이는 슬라이더는 없는 것 같았다.
그래서 이 게시글 최종 코드는 상하로 움직이는 슬라이더이다.

## 사용한 기술

react, typescript

## 실습 예제 코드

> #### 목표
>
> - 상하로 움직이는 슬라이더를 제작해본다.
>
> #### 실습 환경
>
> - m1 mac
> - vscode
> - node(14.17.3)
> - npm(7.20.3)

해당 실습에서 사용할 슬라이더의 구성은 **_현재 슬라이드 칸의 내용을 보여줄 slider_** 와 **_item을 움직여 내용을 바꿔서 보여줄 view_** , 그리고 slider의 **_내용인 item_** 이다.

### react+ts 세팅

프로젝트 폴더를 생성한다.

```bash
> npx create-react-app top-down-carousel --template=typescript
> cd top-down-carousel && code .
```

### components 세팅

Slider 컴포넌트를 만들어 문자열 배열을 props로 넘겨주면 해당 문자열 배열을 토대로 슬라이더를 생성할 예정이다.

`src/components/Slider.tsx` 파일의 코드

```tsx
import SliderItem from "./SliderItem";

interface ISliderProps {
  items: string[];
}

const Slider: React.FC<ISliderProps> = ({ items }) => {
  return (
    <div className="slider">
      <div className="slider-view">
        {items.map((item, idx) => (
          <SliderItem key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
```

`src/components/SliderItem.tsx` 파일의 코드

```tsx
interface ISliderItemProps {
  item: string;
}

const SliderItem: React.FC<ISliderItemProps> = ({ item }) => {
  return <div className="slider-item">{item}</div>;
};

export default SliderItem;
```

`src/app.tsx` 파일의 코드

```tsx
import "./App.css";
import Slider from "./components/Slider";

const items: string[] = ["Hello!", "World!", "Bye!", "World!"];

function App() {
  return (
    <div className="App">
      <Slider items={items} />
    </div>
  );
}

export default App;
```

해당 코드를 적용한 후 실행한 결과이다.
![](https://images.velog.io/images/jeongyk92/post/75509afd-7f42-40e8-a7ed-299f24d9b18b/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-26%2019.26.21.png)

### css 세팅

편의상 `app.css` 파일만 사용합니다.

```css
.App {
  text-align: center;
}

.slider {
  height: 70px;
  overflow: hidden;
}

.slider-view {
  height: 100%;
}

.slider-item {
  height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}
```

해당 코드를 적용한 후 실행한 결과이다.
![](https://images.velog.io/images/jeongyk92/post/dab2acc1-aef9-457f-8e38-81020c19767c/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-26%2019.37.18.png)

### setInterval 세팅

다음 item으로 넘어가게끔 setInterval을 부여해보자.
주의해야 할 점은 **_useEffect에서 cleanup을 통해 interval이 중첩되는 것을 방지해줘야한다. 안그러면... 갑자기 많이 빨라진다.._**
또 view를 useRef를 통해 지정해서 style을 변경해준다.

`src/components/Slider.tsx`

```tsx
import { useEffect, useRef, useState } from "react";
import SliderItem from "./SliderItem";

interface ISliderProps {
  items: string[];
}

const Slider: React.FC<ISliderProps> = ({ items }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) {
        return;
      }

      ref.current.style.transition = `all 0.5s ease-in-out`;
      ref.current.style.transform = `translateY(-${selectedIndex}00%)`;
      if (selectedIndex === items.length) {
        ref.current.style.transition = `0s`;
        ref.current.style.transform = `translateY(0)`;
        setSelectedIndex(0);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedIndex, items]);

  return (
    <div className="slider">
      <div className="slider-view" ref={ref}>
        {items.map((item, idx) => (
          <SliderItem key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Slider;
```

코드를 적용하고 실행해보면 위에서 아래로 이동하는 슬라이더가 완성된다!

### 문제점

위의 슬라이더에서 마지막 item을 집중해서 봐보자. 다음 item(첫 번째 item)으로 이동할 때 짠!하고 이동하게 된다.
이를 해결하기 위해서는 첫 번째 item을 마지막에도 배치해주는 것이다.
`src/components/Slider.tsx return 부분`

```tsx
return (
  <div className="slider">
    <div className="slider-view" ref={ref}>
      {items.map((item, idx) => (
        <SliderItem key={idx} item={item} />
      ))}
      <SliderItem item={items[0]} />
    </div>
  </div>
);
```

item의 개수가 늘었으니 useEffect에서 length 계산 부분을 length + 1로 변경해주고 setSelectedIndex는 1로 지정해주면 된다.(마지막 item은 0번째 item과 같은 내용이니까!)
`src/components/Slider.tsx useEffect 부분`

```tsx
// 생략
if (selectedIndex === items.length + 1) {
  ref.current.style.transition = `0s`;
  ref.current.style.transform = `translateY(0)`;
  setSelectedIndex(1);
}
// 생략
```

이렇게 적용을 하면 스무스하게 넘어가는 것을 확인할 수 있다!

### 두 번째 문제점

스무스하게 잘 넘어간다! 하지만 문제가 하나 더 있다. 첫 번째 아이템으로 transform을 통해 잘 갔지만, setInterval 효과로 인해 transform(0)에서 1초를 기다리게 된다. 다음과 같이 setTimeout을 추가하면서 해결 할 수 있다. 501ms 뒤에 실행하는 이유는 transition에 0.5s가 적용되어 있기 때문에 한 번에 넘어가기 위함이다.

```tsx
useEffect(() => {
  const interval = setInterval(() => {
    if (!ref.current) {
      return;
    }
    ref.current.style.transition = `all 0.5s ease-in-out`;
    ref.current.style.transform = `translateY(-${selectedIndex}00%)`;
    if (selectedIndex === items.length) {
      setTimeout(() => {
        if (!ref.current) {
          return;
        }
        ref.current.style.transition = `0s`;
        ref.current.style.transform = `translateY(0)`;
      }, 501);
      setSelectedIndex(1);
    } else {
      setSelectedIndex(selectedIndex + 1);
    }
  }, 1000);

  return () => {
    clearInterval(interval);
  };
}, [selectedIndex, items]);
```

### Slider.tsx 최종코드

```tsx
import { useEffect, useRef, useState } from "react";
import SliderItem from "./SliderItem";

interface ISliderProps {
  items: string[];
}

const Slider: React.FC<ISliderProps> = ({ items }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!ref.current) {
        return;
      }
      ref.current.style.transition = `all 0.5s ease-in-out`;
      ref.current.style.transform = `translateY(-${selectedIndex}00%)`;
      if (selectedIndex === items.length) {
        setTimeout(() => {
          if (!ref.current) {
            return;
          }
          ref.current.style.transition = `0s`;
          ref.current.style.transform = `translateY(0)`;
        }, 501);
        setSelectedIndex(1);
      } else {
        setSelectedIndex(selectedIndex + 1);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [selectedIndex, items]);

  return (
    <div className="slider">
      <div className="slider-view" ref={ref}>
        {items.map((item, idx) => (
          <SliderItem key={idx} item={item} />
        ))}
        <SliderItem item={items[0]} />
      </div>
    </div>
  );
};

export default Slider;
```

### 후기

예전 바닐라 js로 슬라이더 공부를 할 때는 좌우로 무한 슬라이더를 해결했었다.
하지만 이 블로그 [첫 게시글](https://velog.io/@jeongyk92/Hello-Velog)에 작성한 것처럼 그 때의 나는 기록을 해두지 않았기 때문에 역시나 까먹었었다. 앞으로 기록을 잘하도록 하고 다음에는 다른 라이브러리를 사용해서 완성을 시켜볼까 한다.

#### 참고

[두 번째 문제점 참고 사이트](https://takeknowledge.tistory.com/34)

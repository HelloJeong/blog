[원본 게시글로 바로가기](https://velog.io/@jeongyk92/how-to-know-if-react-canvas-draw-is-finished)

> 이미지 파일을 canvas에 draw해주고 해당 canvas에 그려진 이미지를 `todataURL()` 로 가져와야하는 상황이 있을 수 있다.

내가 직면했었던 문제는 state가 변경되면서 import되는 image를 canvas에 그려주고 canvas에 뿌려진 이미지 `todataURL()`을 통해 변경된 base64를 pdf 파일에 넣으면 빈 화면을 보게되는 문제였다. ( 물론 image를 base64로 바로 변경해서 pdf 파일에 넣어도 됐지만, 그렇게 할 수 있는 상황이 아니었다. )

이유는 단순했다.

> 이미지가 canvas에 draw 되기 전에 `todataURL()`을 사용했다는 것

코드를 통해 보도록하자. 사용한 sampleImage의 출처는 아래에 있다.

`App.tsx`

```tsx
import { useState } from "react";
import "./App.css";
import MyCanvas from "./MyCanvas";

const App = () => {
  const [showCanvas, setShowCanvas] = useState(false);

  return (
    <div className="App">
      <button onClick={() => setShowCanvas((s) => !s)}>
        {showCanvas ? "hide canvas" : "show canvas"}
      </button>
      {showCanvas && (
        <div>
          <MyCanvas />
        </div>
      )}
    </div>
  );
};

export default App;
```

button으로 MyCanvas 컴포넌트의 렌더 여부를 결정한다.

`MyCanvas.tsx`

```tsx
import { useCallback, useEffect, useRef } from "react";
import sampleImage from "./asset/sample.jpg";

const MyCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getImageEl: () => Promise<HTMLImageElement> = useCallback(() => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = sampleImage;
      img.onload = (e) => {
        console.log("done");
        resolve(img);
      };
    });
  }, []);

  useEffect(() => {
    getImageEl().then((img) => {
      if (!canvasRef || !canvasRef.current) return;
      canvasRef.current.width = 300;
      canvasRef.current.height = 300;
      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(img, 0, 0, 300, 300);
    });
  }, [getImageEl]);

  useEffect(() => {
    if (!canvasRef || !canvasRef.current) {
      alert("canvas 정보를 가져올 수 없습니다.");
      return;
    }
    const dataurl = canvasRef.current.toDataURL();
    console.log("dataurl1", dataurl);
  }, []);

  return <canvas ref={canvasRef} />;
};

export default MyCanvas;
```

canvas에 image를 넣는 코드 + 렌더가 되면 `todataURL()`을 이용해서 캔버스에 그려진 정보를 base64로 바꾸는 코드이다.
우리가 주의깊게 봐야하는 곳은 `todataURL()`을 사용하는 `useEffect`이다.
실제 콘솔에 찍힌 것을 보면 dataurl은 잘 나왔다. 하지만 이 변환된 URL은 확인해보면 빈 화면일 것이다.
![](https://velog.velcdn.com/images/jeongyk92/post/d5fdb7ef-e027-46fb-b39a-2ac928ed2467/image.png)

> 빈화면의 url이 나오게 된 것은 todataURL()의 호출 시점이 canvas의 render가 끝난 직후이지 canvas의 draw가 끝난 시점이 아니기 때문이다.
> draw가 끝났다는 state 하나만 만들어두면 쉽게 해결 할 수 있다.

`MyCanvas.tsx`

```tsx
import { useCallback, useEffect, useRef, useState } from "react";
import sampleImage from "./asset/sample.jpg";

const MyCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drawDone, setDrawDone] = useState<Boolean>(false);

  const getImageEl: () => Promise<HTMLImageElement> = useCallback(() => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = sampleImage;
      img.onload = (e) => {
        console.log("done");
        resolve(img);
      };
    });
  }, []);

  useEffect(() => {
    getImageEl().then((img) => {
      if (!canvasRef || !canvasRef.current) return;
      canvasRef.current.width = 300;
      canvasRef.current.height = 300;
      const ctx = canvasRef.current.getContext("2d");
      ctx?.drawImage(img, 0, 0, 300, 300);
      setDrawDone(true);
    });
  }, [getImageEl]);

  useEffect(() => {
    if (!drawDone) return;

    if (!canvasRef || !canvasRef.current) {
      alert("canvas 정보를 가져올 수 없습니다.");
      return;
    }
    const dataurl = canvasRef.current.toDataURL();
    console.log("dataurl1", dataurl);
  }, [drawDone]);

  return <canvas ref={canvasRef} />;
};

export default MyCanvas;
```

![](https://velog.velcdn.com/images/jeongyk92/post/63426aba-3d00-40a0-8567-1a95335d3346/image.png)

#### 참고 및 출처

[sampleImage](https://pixabay.com/photos/ocean-milky-way-boat-sailing-3605547/)

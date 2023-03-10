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

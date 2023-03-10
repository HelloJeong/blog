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

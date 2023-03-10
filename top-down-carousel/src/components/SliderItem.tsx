interface ISliderItemProps {
  item: string;
}

const SliderItem: React.FC<ISliderItemProps> = ({ item }) => {
  return <div className="slider-item">{item}</div>;
};

export default SliderItem;

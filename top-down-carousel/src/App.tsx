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

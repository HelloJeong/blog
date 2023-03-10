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

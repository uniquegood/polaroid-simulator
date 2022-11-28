import { useState } from "react";
import reactLogo from "./assets/react.svg";
import Polaroid from "./Polaroid";
import "./App.css";

function App() {
  const [progress, setProgress] = useState(0);

  return (
    <div className="App">
      <div className="card">
        <Polaroid
          width={100}
          height={100}
          progress={progress}
          src={
            "https://images.unsplash.com/photo-1582152629442-4a864303fb96?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80"
          }
        />
        <div>
          <input
            type="range"
            min="0"
            max="100"
            defaultValue={0}
            onChange={(e) => setProgress(e.target.value / 100)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

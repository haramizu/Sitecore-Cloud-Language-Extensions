import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const locale = navigator.language;

  return (
    <>
      <h1>Sitecore Language Switcher</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <p className="read-the-docs">Click count</p>
      <p>Browser Locale: {locale}</p>
    </>
  );
}

export default App;

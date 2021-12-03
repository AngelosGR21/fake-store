import { useState } from "react";

function App() {
  let [state, setState] = useState(1);
  return (
    <>
      <h1>{state}</h1>
      <button onClick={() => setState(state + 1)}>Up state</button>
    </>
  );
}

export default App;

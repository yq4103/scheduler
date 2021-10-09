import { useState } from "react";

export default function useVisualMode(initial) {

  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
  //update the current mode to a new mode
    setHistory((prev) => {
      const newHistory = [...prev];

      if (replace) {
        newHistory.pop();
      }

      newHistory.push(mode);
      return newHistory;
    });
  }

  function back() {
  //constraint on the back function, do not allow the user to go back past the initial mode
    if (history.length < 2) {
      return;
    }

    setHistory((prev) => {
      const newHistory = [...prev];
      newHistory.pop();
      return newHistory;
    });
  }

  const mode = history[history.length-1];

  return { mode, transition, back };
}

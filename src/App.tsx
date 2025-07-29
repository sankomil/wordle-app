import React from "react";

function App() {
  const attempts = parseInt(process.env.REACT_APP_ATTEMPTS || "5");
  const wordList = JSON.parse(process.env.REACT_APP_WORDLE_LIST || "[]");

  const selectedWord = wordList[Math.floor(Math.random() * wordList.length)];

  return (
    <div className="App">
      <h1>Wordle</h1>
      <p>Number of attempts: {attempts}</p>
    </div>
  );
}

export default App;

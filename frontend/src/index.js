import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import "./index.css";

//Component imports
import Timer from "./Timer/Timer";

function App() {
  const [refreshFlag, updateRefreshFlag] = useState(0);
  const [timers, updateTimers] = useState(null);
  const [timerName, updateTimerName] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8083/getStates").then(response => response.json()).then(data => {
      let timerElements = [];
      data.timers.forEach(timer => {
        const onClickFunction = timer.is_paused ? startTimer : stopTimer;
        updateTimerName(timer.name);
        timerElements.push(
          <Timer
            label={timer.name}
            isPaused={timer.is_paused}
            startTime={timer.start_time ? new Date(timer.start_time) : null}
            resumedTime={timer.resumed_time ? new Date(timer.resumed_time) : null}
            pausedTime={timer.resumed_time ? new Date(timer.paused_time) : null}
            onClick={() => onClickFunction({ name: timer.name })}
          />
        );
      });
      updateTimers(timerElements);
    });
  }, [refreshFlag]);


  const startTimer = ({ name }) => {
    fetch("http://localhost:8083/startTimer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timerName: name,
      })
    }).then(response => response.json()).then(data => {
      updateRefreshFlag(!refreshFlag);
    });
  }

  const stopTimer = ({ name }) => {
    fetch("http://localhost:8083/stopTimer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timerName: name,
      })
    }).then(response => response.json()).then(data => {
      updateRefreshFlag(!refreshFlag);
    });
  }

  return (
    <div>
      {timers}
      <ClearButton name={timerName} refreshFlag={refreshFlag} updateRefreshFlag={updateRefreshFlag} />
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&display=swap" rel="stylesheet" />

    </div>
  );

}

function ClearButton({ name, updateRefreshFlag, refreshFlag }) {
  const clearTimer = () => {
    fetch("http://localhost:8083/clearTimer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timerName: name,
      })
    }).then(response => response.json()).then(data => {
      updateRefreshFlag(!refreshFlag);
    });
  }
  return <button onClick={() => clearTimer()} className="clear-btn">
    ✕
  </button>
}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
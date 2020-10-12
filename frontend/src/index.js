import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import "./index.css";

//Component imports
import Timer from "./Timer/Timer";

function App() {
  const [refreshFlag, updateRefreshFlag] = useState(0);
  const [timers, updateTimers] = useState(null);
  const [timerName, updateTimerName] = useState(null);
  const endpoint = process.env.NODE_ENV === "production" ? "https://time.sahilkapur.com/server" : "http://localhost:8083";

  useEffect(() => {
    fetch(endpoint + "/getStates").then(response => response.json()).then(data => {
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
    fetch(endpoint + "/startTimer", {
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
    fetch(endpoint + "/stopTimer", {
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
    </div>
  );

}

function ClearButton({ name, updateRefreshFlag, refreshFlag }) {
  const endpoint = process.env.NODE_ENV === "production" ? "https://time.sahilkapur.com/server" : "http://localhost:8083";

  const clearTimer = () => {
    fetch(endpoint + "/clearTimer", {
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
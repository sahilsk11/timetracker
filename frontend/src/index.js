import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import "./index.css";

//Component imports
import Timer from "./Timer/Timer";

function App() {
  const [refreshFlag, updateRefreshFlag] = useState(0);
  const [timers, updateTimers] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/getStates").then(response => response.json()).then(data => {
      let timerElements = [];
      data.timers.forEach(timer => {
        const onClickFunction = timer.is_paused ? startTimer : stopTimer;
        timerElements.push(
          <Timer
            label={timer.name}
            isPaused={timer.is_paused}
            startTime={new Date(timer.start_time)}
            resumedTime={new Date(timer.resumed_time)}
            pausedTime={new Date(timer.paused_time)}
            onClick={() => onClickFunction({ name: timer.name })}
          />
        );
      });
      updateTimers(timerElements);
    });
  }, [refreshFlag]);


  const startTimer = ({ name }) => {
    fetch("http://localhost:8080/startTimer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timerName: name,
      })
    }).then(response => response.json()).then(data => {
      console.log(data);
      updateRefreshFlag(!refreshFlag);
    });
  }

  const stopTimer = ({ name }) => {
    fetch("http://localhost:8080/stopTimer", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        timerName: name,
      })
    }).then(response => response.json()).then(data => {
      console.log(data);
      updateRefreshFlag(!refreshFlag);
    });
  }

  const clearTimer = () => {

  }

  return (
    <div>
      {timers}
    </div>
  );

}


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
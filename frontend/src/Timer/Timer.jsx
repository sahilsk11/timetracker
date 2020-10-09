import React, { useState, useRef, useEffect } from "react";
import "./timer.css";

export default function Timer({ label, startTime, pausedTime, resumedTime, isPaused, onClick }) {
  const [time, updateTime] = useState("");
  const [splitTime, updateSplitTime] = useState("");

  useEffect(() => {
    if (isPaused) {
      if (startTime.toString() === new Date(null).toString()) {
        updateTime("00:00:00");
      } else {
        updateTime(calculateStopwatchValue(pausedTime - startTime));
      }
      if (resumedTime.toString() === new Date(null).toString()) {
        updateSplitTime("00:00:00");
      } else {
        updateSplitTime(calculateStopwatchValue(new Date() - resumedTime));
      }
    } else {
      updateTime(calculateStopwatchValue(new Date() - startTime));
      updateSplitTime(calculateStopwatchValue(new Date() - resumedTime));
    }
  }, []);

  useInterval(() => {
    updateTime(calculateStopwatchValue(new Date() - startTime));
    updateSplitTime(calculateStopwatchValue(new Date() - resumedTime));
  }, isPaused ? null : 500);

  return (
    <div className="timer-container" onClick={() => onClick()}>
      <h2 className="timer-label">{label}</h2>
      <p className="timer">{time}</p>
      <p className="timer-split-time">{splitTime}</p>
    </div>
  );
}

function calculateStopwatchValue(difference) {
  var hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((difference / 1000) % 60);

  var hoursStr = hours, minutesStr = minutes, secondsStr = seconds;
  if (hours < 10) {
    hoursStr = "0" + hours;
  }
  if (minutes < 10) {
    minutesStr = "0" + minutes;
  }
  if (seconds < 10) {
    secondsStr = "0" + seconds;
  }
  return hoursStr + ":" + minutesStr + ":" + secondsStr;
}

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
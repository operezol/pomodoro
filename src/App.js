import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);

  const audioElement = useRef(null);

  useEffect(() => {
    setTimeLeft(sessionLength * 60);
  }, [sessionLength]);

  const decrementBreakLength = () => {
    if (breakLength > 1 && !isRunning) {
      setBreakLength(prevBreakLength => prevBreakLength - 1);
    }
  };

  const incrementBreakLength = () => {
    if (breakLength < 60 && !isRunning) {
      setBreakLength(prevBreakLength => prevBreakLength + 1);
    }
  };

  const decrementSessionLength = () => {
    if (sessionLength > 1 && !isRunning) {
      setSessionLength(prevSessionLength => prevSessionLength - 1);
    }
  };

  const incrementSessionLength = () => {
    if (sessionLength < 60 && !isRunning) {
      setSessionLength(prevSessionLength => prevSessionLength + 1);
    }
  };

  const startStopTimer = () => {
    setIsRunning(prevIsRunning => !prevIsRunning);
  };

  const resetTimer = () => {
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
    setIsRunning(false);
    audioElement.current.pause();
    audioElement.current.currentTime = 0;
  };

  useEffect(() => {
    let countdownInterval;

    if (isRunning) {
      countdownInterval = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft === 0) {
            audioElement.current.play();
            if (timerLabel === 'Session') {
              setTimerLabel('Break');
              return breakLength * 60;
            } else {
              setTimerLabel('Session');
              return sessionLength * 60;
            }
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
    }

    return () => clearInterval(countdownInterval);
  }, [isRunning, sessionLength, breakLength, timerLabel]);

  const formatTime = time => {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="app">
      <h1>25 + 5 Clock</h1>
      <div className="settings">
        <div className="setting">
          <h2 id="break-label">Break Length</h2>
          <div className="setting-controls">
            <button id="break-decrement" onClick={decrementBreakLength}>-</button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={incrementBreakLength}>+</button>
          </div>
        </div>
        <div className="setting">
          <h2 id="session-label">Session Length</h2>
          <div className="setting-controls">
            <button id="session-decrement" onClick={decrementSessionLength}>-</button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={incrementSessionLength}>+</button>
          </div>
        </div>
      </div>
      <div className="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <button id="start_stop" onClick={startStopTimer}>
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <button id="reset" onClick={resetTimer}>Reset</button>
        <audio id="beep" ref={audioElement} src="/beep.wav" />
      </div>
      <div></div>
    </div>
  );
};

export default App;

import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const [targetTime, setTargetTime] = useState(() => {
    const saved = localStorage.getItem('lastTimer');
    return saved ? parseInt(saved, 10) : null;
  });
  const [timeLeft, setTimeLeft] = useState({});
  const [paused, setPaused] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });

  const timerRef = useRef(null);

  useEffect(() => {
    if (!targetTime || paused) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      const now = Date.now();
      const distance = targetTime - now;

      if (distance <= 0) {
        clearInterval(timerRef.current);
        setTimeLeft({});
        setTimeUp(true);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
        setTimeUp(false);
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [targetTime, paused]);

  const handleStart = () => {
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    if (!date || !time) {
      alert('Please select both date and time.');
      return;
    }
    const finalDate = new Date(`${date}T${time}:00`).getTime();
    if (finalDate <= Date.now()) {
      alert('Please choose a future date and time!');
      return;
    }
    setTargetTime(finalDate);
    localStorage.setItem('lastTimer', finalDate);
    setPaused(false);
    setTimeUp(false);
  };

  const togglePause = () => {
    if (!targetTime) return;
    setPaused(!paused);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('darkMode', !darkMode);
  };

  return (
    <div className={`container ${darkMode ? 'dark' : ''}`}>
      <h1>Countdown Timer</h1>

      <div className="dark-mode-toggle">
        <label>
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          Dark Mode
        </label>
      </div>

      <div className="input-group">
        <input type="date" id="date" />
        <input type="time" id="time" />
      </div>

      <div className="button-group">
        <button onClick={handleStart}>Start</button>
        <button onClick={togglePause} disabled={!targetTime}>
          {paused ? 'Resume' : 'Pause'}
        </button>
      </div>

      {timeUp ? (
        <div className="time-up">
          <h2>Time's Up!</h2>
        </div>
      ) : (
        <div className="timer">
          <div>
            <span>{timeLeft.days || '0'}</span>
            <p>Days</p>
          </div>
          <div>
            <span>{timeLeft.hours || '0'}</span>
            <p>Hours</p>
          </div>
          <div>
            <span>{timeLeft.minutes || '0'}</span>
            <p>Minutes</p>
          </div>
          <div>
            <span>{timeLeft.seconds || '0'}</span>
            <p>Seconds</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

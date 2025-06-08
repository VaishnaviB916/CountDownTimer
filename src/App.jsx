import React, { useState, useEffect } from 'react';

const App = () => {
  const [targetTime, setTargetTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState({});
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let interval;

    if (targetTime && !paused) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance <= 0) {
          clearInterval(interval);
          setTimeLeft({});
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000),
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [targetTime, paused]);

  const handleStart = () => {
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const finalDate = new Date(`${date}T${time}:00`).getTime();
    setTargetTime(finalDate);
    localStorage.setItem('lastTimer', finalDate);
  };

  const togglePause = () => setPaused(!paused);

  return (
    <div className="container">
      <h1>Countdown Timer</h1>
      <div className="input-group">
        <input type="date" id="date" />
        <input type="time" id="time" />
      </div>
      <div className="button-group">
        <button onClick={handleStart}>Start</button>
        <button onClick={togglePause}>{paused ? 'Resume' : 'Pause'}</button>
      </div>
      <div className="timer">
        <div><span>{timeLeft.days || '0'}</span><p>Days</p></div>
        <div><span>{timeLeft.hours || '0'}</span><p>Hours</p></div>
        <div><span>{timeLeft.minutes || '0'}</span><p>Minutes</p></div>
        <div><span>{timeLeft.seconds || '0'}</span><p>Seconds</p></div>
      </div>
    </div>
  );
};

export default App;

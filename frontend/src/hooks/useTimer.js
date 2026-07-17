import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Countdown timer hook.
 * @param {number} duration — total seconds (default 10)
 * @param {function} onExpire — callback when timer reaches 0
 * @param {boolean} active — whether the timer is running
 */
export function useTimer(duration = 10, onExpire, active = false) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  const reset = useCallback(() => {
    setTimeLeft(duration);
    startTimeRef.current = Date.now();
  }, [duration]);

  useEffect(() => {
    if (!active) {
      clearInterval(intervalRef.current);
      return;
    }

    startTimeRef.current = Date.now();
    setTimeLeft(duration);

    intervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        onExpire?.();
      }
    }, 100); // Update every 100ms for smooth animation

    return () => clearInterval(intervalRef.current);
  }, [active, duration, onExpire]);

  const getTimeTaken = useCallback(() => {
    if (!startTimeRef.current) return duration;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    return Math.min(elapsed, duration);
  }, [duration]);

  return { timeLeft, reset, getTimeTaken };
}

export default useTimer;

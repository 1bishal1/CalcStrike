import { useState, useEffect, useRef } from 'react';

export const useTimer = (initialTime = 5, onComplete) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          if (onComplete) onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [onComplete]);

  return timeLeft;
};

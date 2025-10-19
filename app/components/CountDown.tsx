import React, { useState, useEffect } from "react";

export const calculateTimeRemaining = (targetDate: Date) => {
  const now = new Date().getTime();
  const targetTime = new Date(targetDate).getTime();
  const timeDifference = targetTime - now;

  if (timeDifference <= 0) {
    return null;
  }

  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
};

export function getTimeRemainingString(date: Date) {
  const reminaing = calculateTimeRemaining(date);

  if (!reminaing) {
    return "";
  }

  const { hours, minutes, seconds } = reminaing;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

export const Countdown = ({ date }: { date: Date }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(date),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(date));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [date]);

  if (timeRemaining === null) {
    return null;
  }

  const { hours, minutes, seconds } = timeRemaining;

  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

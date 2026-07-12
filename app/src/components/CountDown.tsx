import { getTimeRemaining } from "@/utils/date";
import { useState, useEffect } from "react";

interface Props {
  date: string;
}

export const Countdown = (props: Props) => {
  const [timeRemaining, setTimeRemaining] = useState(
    getTimeRemaining(props.date)
  );

  useEffect(() => {
    setTimeRemaining(getTimeRemaining(props.date));

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(props.date));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [props.date]);

  if (timeRemaining === null) {
    return "N/A";
  }

  return timeRemaining;
};

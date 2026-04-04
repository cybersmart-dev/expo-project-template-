import { useRef, useState } from "react";

interface useCounterProps {
  count?: number;
}
export const useCounter = ({ count = 30 }: useCounterProps) => {
  const [resendCount, setResendCount] = useState(count);
  const intervalRef = useRef(0);

  const startCounter = () => {
    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    let count = 30;
    setResendCount(count);

    intervalRef.current = setInterval(() => {
      count -= 1;
      setResendCount(count);

      console.log(count);

      if (count <= 0) {
        clearInterval(intervalRef.current);
        intervalRef.current = 0;
      }
    }, 1000);
  };

  return { resendCount, startCounter };
};

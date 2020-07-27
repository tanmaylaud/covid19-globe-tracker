import React from "react";
import { useEffect, useState } from "react";

interface CounterProps {
  count: number;
}

export function Counter({ count }: CounterProps) {
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter <= count) {
      if (count - counter <= 200) setCounter(counter + 1);
      else if (count - counter <= 1000) setCounter(counter + 100);
      else if (count - counter <= 10000) setCounter(counter + 1000);
      else setCounter(counter + 1000);
    }
  }, [counter]);

  function numberWithCommas(x: number) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return <>{numberWithCommas(counter)}</>;
}

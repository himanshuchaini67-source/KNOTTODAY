import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: string;
}

export function Countdown({ targetDate }: CountdownProps) {
  const [days, setDays] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);
      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return <span className="tabular-nums">{days}</span>;
}

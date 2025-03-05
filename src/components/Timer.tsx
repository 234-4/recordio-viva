
import React from "react";

interface TimerProps {
  seconds: number;
}

const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const formatTime = (totalSeconds: number): string => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    const parts = [];
    if (hrs > 0) parts.push(hrs.toString().padStart(2, '0'));
    parts.push(mins.toString().padStart(2, '0'));
    parts.push(secs.toString().padStart(2, '0'));
    
    return parts.join(':');
  };

  return (
    <div className="font-mono text-3xl font-semibold text-white">
      {formatTime(seconds)}
    </div>
  );
};

export default Timer;

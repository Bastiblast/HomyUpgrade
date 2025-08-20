import React, { useContext, useEffect, useState } from 'react';
import { DataCenterContext } from '../query/datacenter-contextAndProvider';
import ClockTime from 'react-clock';
import 'react-clock/dist/Clock.css';

const Clock: React.FC = () => {
  const { ITC } = useContext(DataCenterContext) || { ITC: Date.now() }; // Fallback to current time if context is null
  const [time, setTime] = useState(new Date(ITC));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date(ITC));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, [ITC]);

  return (
    <>
    <div className='digital'>
      {time.getHours().toString().padStart(2, '0')}:
      {time.getMinutes().toString().padStart(2, '0')}
    </div>
    <ClockTime value={time} />
    
    </>
  );
};

export default Clock;
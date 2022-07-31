import React from 'react';
import Time from './Time';

const TimePane = ({
  current,
  duration,
}: {
  current: number;
  duration: number;
}) => {
  return (
    <div style={{ color: '#777', marginRight: 16 }}>
      <Time seconds={current} />
      <span>/</span>
      <Time seconds={duration} />
    </div>
  );
};

export default TimePane;

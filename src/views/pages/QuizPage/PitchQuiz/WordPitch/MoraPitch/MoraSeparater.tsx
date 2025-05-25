import { memo } from 'react';

const MoraSeparater = ({ isAccent }: { isAccent?: boolean }) => {
  return (
    <div
      style={{
        top: -15,
        left: 16,
        height: 21,
        position: 'absolute',
        borderLeft: isAccent ? '2px solid #f50057' : '2px dotted #86bec4',
      }}
    />
  );
};

export default memo(MoraSeparater);

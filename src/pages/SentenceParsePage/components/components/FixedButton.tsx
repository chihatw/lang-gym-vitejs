import React from 'react';
import BackButton from './BackButton';

const FixedButton = ({ handleBack }: { handleBack: () => void }) => {
  return (
    <div
      style={{
        top: 0,
        left: 0,
        position: 'fixed',
        zIndex: 1000,
        paddingTop: 12,
        paddingLeft: 16,
      }}
    >
      <BackButton handleBack={handleBack} />
    </div>
  );
};

export default FixedButton;
